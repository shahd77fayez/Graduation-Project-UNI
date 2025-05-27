import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import time
import pandas as pd
from langdetect import detect
import os
from gnews import GNews
import re
import requests

NEWS_API_KEY=os.environ["NEWS_API_KEY"]
WORLD_NEWS_API_KEY=os.environ["WORLD_NEWS_API_KEY"]




# Load models and tokenizers
english_model = tf.keras.models.load_model('Models/English-2nd_News_Classifier_rnn.keras')
with open('Models/English-3rd_News_Classifier_rnn.pkl', 'rb') as english_tokenizer_file:
    english_tokenizer = pickle.load(english_tokenizer_file)

# Ensure the models are compiled (if not already compiled)
english_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

# Load models and tokenizers
arabic_model = tf.keras.models.load_model('Models/two.keras')
with open('Models/YaKereem.pkl', 'rb') as arabic_tokenizer_file:
    arabic_tokenizer = pickle.load(arabic_tokenizer_file)
arabic_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
def predict_Arabic_Text(text):
    sequences = arabic_tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequences, maxlen=100, padding='post', truncating='post')
    prediction = arabic_model.predict(padded)[0][0]
    label = 'Real' if prediction >= 0.5 else 'Fake'
    confidence = prediction if label == 'Real' else 1 - prediction
    print(label)
    print(confidence)
    return label, (confidence*100)
def predict_English_Text(text):
    sequences = english_tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequences, maxlen=100, padding='post', truncating='post')
    prediction = english_model.predict(padded)[0][0]
    label = 'Real' if prediction >= 0.5 else 'Fake'
    confidence = prediction if label == 'Real' else 1 - prediction
    print(label)
    print(confidence)
    return label, (confidence*100)
def clean_input_text(text):
    # Remove special characters and punctuation
    text= re.sub(r'[^A-Za-z0-9\s]+', '', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)

    # Strip leading and trailing whitespace
    text = text.strip()
    return text
def search_news_with_newsapi(query):
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        search_results = []
        for article in data['articles']:
            source = article['source']['name']
            if source != "IR":
                title = article['title']
                link = article['url']
                snippet = article['description']
                search_results.append({"title": title, "link": link, "snippet": snippet, "source": source})
        return search_results
    else:
        return []
def search_news_with_worldnewsapi(query):
    url = f"https://api.worldnewsapi.com/search-news?text={query}&language=en"
    headers = {'x-api-key': WORLD_NEWS_API_KEY}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        search_results = []
        for article in data['news']:
            source = article['source_country']
            if source != "IR":
                title = article['title']
                link = article['url']
                snippet = article['summary']
                search_results.append({"title": title, "link": link, "snippet": snippet, "source": source})
        return search_results
    else:
        return []
def search_news_with_googlenews(query):
    google_news = GNews(language="en", country="US", max_results=10)
    results = google_news.get_news(query)
    if results is None:
        return []
    search_results = []
    for result in results:
        source = result['publisher']['title']
        if source != "IR":
            title = result['title']
            link = result['url']
            snippet = result['description']
            search_results.append({"title": title, "link": link, "snippet": snippet, "source": source})
    return search_results
def Search_and_detect(userInput):
    cleaned_input = clean_input_text(userInput)
    results_googlenews = search_news_with_googlenews(cleaned_input)
    results_newsapi = search_news_with_newsapi(cleaned_input)
    results_worldnewsapi = search_news_with_worldnewsapi(cleaned_input)

    finalResult=None
    apiName=None
    if results_googlenews or results_newsapi or results_worldnewsapi:
        print("Real")
        if results_googlenews:
                finalResult = results_googlenews[0]  # Get the first result
                apiName="Google News"
        if results_newsapi:
                finalResult = results_newsapi[0]  # Get the first result
                apiName="News API"
        if results_worldnewsapi:
                finalResult = results_worldnewsapi[0]  # Get the first result
                apiName="World News API"

        return 1,apiName,finalResult['title'],finalResult['source'],finalResult['link'],finalResult['snippet']

    else:
            try:
                lang=detect(userInput)
            except:
                lang= None
            
            # Determine language and set the appropriate model and tokenizer
            if lang == 'ar':
                prediction, confidence = predict_Arabic_Text(cleaned_input)
            elif lang == 'en':
                prediction, confidence = predict_English_Text(cleaned_input)
            else:
                 return 3,0,0
            return 2,prediction,confidence







