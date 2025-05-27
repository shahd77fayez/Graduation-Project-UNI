from datetime import datetime
import time
import schedule
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import psycopg2


# Dictionary to map Arabic day names to English day names
arabic_to_english_days = {
    'الأحد': 'Sunday',
    'الاثنين': 'Monday',
    'الثلاثاء': 'Tuesday',
    'الأربعاء': 'Wednesday',
    'الخميس': 'Thursday',
    'الجمعة': 'Friday',
    'السبت': 'Saturday'
}

def parse_date(date_string):
    # Input date string format: "الأحد 23/06 - 13:31" (example in Arabic)
    if '-' not in date_string:
        return datetime.now().strftime("%Y-%m-%d")  # Use today's date if format does not contain '-'

    # Extract date and time parts
    date_part, _ = date_string.split(' - ')

    # Translate Arabic day name to English
    for arabic_day, english_day in arabic_to_english_days.items():
        if date_part.startswith(arabic_day):
            date_part = date_part.replace(arabic_day, english_day)
            break

    # Define the format of the date part (in English)
    date_format = "%A %d/%m"

    # Parse the date part to a datetime object
    try:
        date_obj = datetime.strptime(date_part, date_format)

        # Optionally, add the current year if it's missing
        date_obj = date_obj.replace(year=datetime.now().year)

        # Format the datetime object to a string in the desired format
        formatted_date = date_obj.strftime("%Y-%m-%d")

        return formatted_date

    except ValueError as e:
        print(f"Error parsing date: {e}")
        return None

def article_exists(cursor, title):
    cursor.execute("SELECT COUNT(*) FROM article WHERE articlecontent = %s", (title,))
    return cursor.fetchone()[0] > 0

def scrape_articles(driver, category_xpath, category_name):
    wait = WebDriverWait(driver, 10)
    news = []
    dates = []

    try:
        section_link = wait.until(EC.presence_of_element_located((By.XPATH, category_xpath)))
        section_link.click()
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.article-item-info')))

        content = driver.page_source
        soup = BeautifulSoup(content, 'html.parser')

        articles = soup.select('.article-item-info')
        for item in articles:
            try:
                # Find the title
                article_div = item.find('div', class_='article-item-title')
                if article_div:
                    newsitem = article_div.find('a')
                    if newsitem:
                        title = newsitem.text.strip()
                        if title not in news:
                            news.append(title)

                # Find the date
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

    return news, [category_name] * len(news), dates
def scrape_and_store():
    driver = webdriver.Chrome()
    driver.get('https://aawsat.com/')
    wait = WebDriverWait(driver, 10)

    try:
        # Define categories and their XPaths
        categories = [
            ('Sports', '//*[@id="main-header"]/div[3]/div[1]/div/div[4]/nav/ul/li[10]/a'),
            ('Culture', '//*[@id="main-header"]/div[3]/div[1]/div/div[4]/nav/ul/li[6]/a'),
            ('Technology', '//*[@id="main-header"]/div[3]/div[1]/div/div[4]/nav/ul/li[8]/a'),
            ('Economy', '//*[@id="main-header"]/div[3]/div[1]/div/div[4]/nav/ul/li[5]/a'),
            ('World', '//*[@id="main-header"]/div[3]/div[1]/div/div[4]/nav/ul/li[3]/a'),
            ('Health', '//*[@id="main-header"]/div[3]/div[1]/div/div[4]/nav/ul/li[7]/a'),
            ('Middle East', '//*[@id="main-header"]/div[3]/div[1]/div/div[4]/nav/ul/li[2]/a')
        ]

        combined_news = []
        combined_types = []
        combined_dates = []
        article_langs = []

        for category_name, category_xpath in categories:
            news, types, dates = scrape_articles(driver, category_xpath, category_name)
            combined_news.extend(news)
            combined_types.extend(types)
            combined_dates.extend(dates)
            article_langs.extend(['Arabic'] * len(news))

        # # Remove rows where articledate is None (invalid dates)
        # valid_indices = [i for i, date in enumerate(combined_dates) if date is not None]
        # combined_news = [combined_news[i] for i in valid_indices]
        # combined_types = [combined_types[i] for i in valid_indices]
        # combined_dates = [combined_dates[i] for i in valid_indices]
        # article_langs = [article_langs[i] for i in valid_indices]

        # Combine data into a DataFrame
        df = pd.DataFrame({
            'articlecontent': combined_news,
            'articletype': combined_types,
            'articledate': combined_dates,
            'articlelang': article_langs
        })
        # Remove rows where articledate is None 
        # df = df.dropna(subset=['articledate'])

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