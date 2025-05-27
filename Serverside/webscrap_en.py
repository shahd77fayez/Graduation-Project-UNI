import schedule
from datetime import datetime
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import psycopg2


def parse_date(date_string):
    if '-' not in date_string:
        # Default to today's date
        return datetime.now().strftime("%Y-%m-%d")

    date_part, _ = date_string.split(' - ')
    date_format = "%A %d/%m"

    try:
        date_obj = datetime.strptime(date_part, date_format)
        date_obj = date_obj.replace(year=datetime.now().year)
        formatted_date = date_obj.strftime("%Y-%m-%d")
        return formatted_date
    except ValueError as e:
        print(f"Error parsing date: {e}")
        return None

def article_exists(cursor, title):
    cursor.execute("SELECT COUNT(*) FROM article WHERE articlecontent = %s", (title,))
    return cursor.fetchone()[0] > 0

def scrape_articles(driver, xpath, article_type):
    wait = WebDriverWait(driver, 10)

    news = []
    dates = []

    try:
        section_link = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
        section_link.click()
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.article-item-info')))

        content = driver.page_source
        soup = BeautifulSoup(content, 'html.parser')

        articles = soup.select('.article-item-info')
        for item in articles:
            try:
                article_div = item.find('div', class_='article-item-title')
                if article_div:
                    newsitem = article_div.find('a')
                    if newsitem:
                        title = newsitem.text.strip()
                        if title not in news:
                            news.append(title)

                newsdate = item.find('time')
                if newsdate:
                    date = newsdate.text.strip()
                    formatted_date = parse_date(date)
                    dates.append(formatted_date)
                else:
                    dates.append(datetime.now().strftime("%Y-%m-%d"))  # Default to today's date

            except Exception as e:
                print(f"An error occurred while extracting news titles: {e}")

    except Exception as e:
        print(f"An error occurred: {e}")

    return news, [article_type] * len(news), dates
def scrape_and_store():
    driver = webdriver.Chrome()
    driver.get('https://english.aawsat.com/')
    wait = WebDriverWait(driver, 10)

    try:
        # Define categories and their XPaths
        categories = [
            ('Sports', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[9]/a'),
            ('Business', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[7]/a'),
            ('Fashion', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[11]/a'),
            ('World', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[3]/a'),
            ('ArabWorld', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[2]/a'),
            ('Entertainment', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[10]/a'),
            ('Technology', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[13]/a'),
            ('Culture', '//*[@id="main-header"]/div[3]/div/div/div[3]/nav/ul/li[13]/a')
        ]

        combined_news = []
        combined_types = []
        combined_dates = []
        article_langs = []

        for category_name, category_xpath in categories:
            news, types, dates = scrape_articles(driver, category_xpath, category_name)

            # Map ArabWorld to World
            if category_name == 'ArabWorld':
                types = ['World'] * len(types)

            combined_news.extend(news)
            combined_types.extend(types)
            combined_dates.extend(dates)
            article_langs.extend(['English'] * len(news))

        # Combine data into a DataFrame
        df = pd.DataFrame({
            'articlecontent': combined_news,
            'articletype': combined_types,
            'articledate': combined_dates,
            'articlelang': article_langs
        })

        # Connection to the database
        conn = psycopg2.connect(
            dbname="truthGuard",
            user="postgres",
            password="123456789",
            host="localhost",
            port="5432"
        )

        # Insert data into the database
        try:
            cursor = conn.cursor()

            # Insert data row by row
            for index, row in df.iterrows():
                if not article_exists(cursor, row['articlecontent']):
                    cursor.execute("""
                        INSERT INTO article (articlecontent, articletype, articledate, articlelang)
                        VALUES (%s, %s, %s, %s)
                    """, (row['articlecontent'], row['articletype'], row['articledate'], row['articlelang']))

            conn.commit()
            print("Data insertion successful!")

        except Exception as e:
            print(f"Data insertion failed. Error: {e}")

        finally:
            cursor.close()
            conn.close()

    finally:
        driver.quit()
# Schedule scraping job
schedule.every(12).hours.do(scrape_and_store)

# Main loop to keep the script running
if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(1)
