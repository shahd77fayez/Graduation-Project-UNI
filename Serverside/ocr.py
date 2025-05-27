import io
import pytesseract
from PIL import Image
import re
import os

# Set the Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def Image_extract_english(image_path):
    image = Image.open(image_path)
    image = image.convert('L')
    # Apply OCR to extract text
    # Specify the language parameter as 'ara' for Arabic
    text = pytesseract.image_to_string(image, lang='eng', config='--tessdata-dir "C:\\Program Files\\Tesseract-OCR\\tessdata"')
    print(text)
    return text
def Image_extract_arabic(image_path):
    image = Image.open(image_path)
    image = image.convert('L')
    # Apply OCR to extract text
    # Specify the language parameter as 'ara' for Arabic
    text = pytesseract.image_to_string(image, lang='ara', config='--tessdata-dir "C:\\Program Files\\Tesseract-OCR\\tessdata"')
    print(text)
    return text
