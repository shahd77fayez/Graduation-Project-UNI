from PIL import Image
import numpy as np
from io import BytesIO
import matplotlib.pyplot as plt
from tensorflow.keras.layers import Input, Dense, Flatten, Conv2D, MaxPooling2D, BatchNormalization, Dropout, Reshape, Concatenate, LeakyReLU
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model


image_dimensions = {'height':256, 'width':256, 'channels':3}



# Create a Classifier class
class Classifier:
    def predict(self, x):
        return self.model.predict(x)
    
    def load(self, path):
        self.model.load_weights(path)

class Meso4(Classifier):
    def __init__(self, learning_rate=0.001):
        self.model = self.init_model()
        optimizer = Adam(learning_rate=learning_rate)
        self.model.compile(optimizer=optimizer,
                           loss='mean_squared_error',
                           metrics=['accuracy'])
    
    def init_model(self): 
        x = Input(shape=(image_dimensions['height'],
                         image_dimensions['width'],
                         image_dimensions['channels']))
        
        x1 = Conv2D(8, (3, 3), padding='same', activation='relu')(x)
        x1 = BatchNormalization()(x1)
        x1 = MaxPooling2D(pool_size=(2, 2), padding='same')(x1)
        
        x2 = Conv2D(8, (5, 5), padding='same', activation='relu')(x1)
        x2 = BatchNormalization()(x2)
        x2 = MaxPooling2D(pool_size=(2, 2), padding='same')(x2)
        
        x3 = Conv2D(16, (5, 5), padding='same', activation='relu')(x2)
        x3 = BatchNormalization()(x3)
        x3 = MaxPooling2D(pool_size=(2, 2), padding='same')(x3)
        
        x4 = Conv2D(16, (5, 5), padding='same', activation='relu')(x3)
        x4 = BatchNormalization()(x4)
        x4 = MaxPooling2D(pool_size=(4, 4), padding='same')(x4)
        
        y = Flatten()(x4)
        y = Dropout(0.5)(y)
        y = Dense(16)(y)
        y = LeakyReLU(alpha=0.1)(y)
        y = Dropout(0.5)(y)
        y = Dense(1, activation='sigmoid')(y)

        return Model(inputs=x,outputs=y)
# Instantiate a MesoNet model with pretrained weights
meso = Meso4()
meso.load('Models/Meso4_DF.h5')





def predict_image(image_path):
    imagee = Image.open(BytesIO(image_path))
    imge = imagee.resize((256, 256))
    img_array = image.img_to_array(imge)
    img_array = np.expand_dims(img_array, axis=0)  # Create a batch dimension

    pred = meso.predict(img_array)[0][0]  # Assuming model output is a single value
    label = 'fake' if pred < 0.5 else 'real'  # Adjust threshold as necessary
    confidence = pred if label == 'real' else 1 - pred

    print(f"Prediction: {label} ({pred})")
    return label ,confidence



#image_path = './data/test/3.jpg'  # Replace with the path to your image
#predict_image(image_path)
