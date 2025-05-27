import torch
import torchvision
from torchvision import transforms
from torch.utils.data import Dataset
import numpy as np
import cv2
import matplotlib.pyplot as plt
from torch import nn
from torchvision import models

# Model with feature visualization
class Model(nn.Module):
    def __init__(self, num_classes, latent_dim=2048, lstm_layers=1, hidden_dim=2048, bidirectional=False):
        super(Model, self).__init__()
        model = models.resnext50_32x4d(pretrained=True)
        self.model = nn.Sequential(*list(model.children())[:-2])
        self.lstm = nn.LSTM(latent_dim, hidden_dim, lstm_layers, bidirectional)
        self.relu = nn.LeakyReLU()
        self.dp = nn.Dropout(0.4)
        self.linear1 = nn.Linear(2048, num_classes)
        self.avgpool = nn.AdaptiveAvgPool2d(1)

    def forward(self, x):
        batch_size, seq_length, c, h, w = x.shape
        x = x.view(batch_size * seq_length, c, h, w)
        fmap = self.model(x)
        x = self.avgpool(fmap)
        x = x.view(batch_size, seq_length, 2048)
        x_lstm, _ = self.lstm(x, None)
        return fmap, self.dp(self.linear1(x_lstm[:, -1, :]))

# Helper functions
im_size = 112
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
sm = nn.Softmax(dim=1)
inv_normalize = transforms.Normalize(mean=-1 * np.divide(mean, std), std=np.divide([1, 1, 1], std))

def im_convert(tensor):
    """ Display a tensor as an image. """
    image = tensor.clone().detach()
    image = image.squeeze()
    image = inv_normalize(image)
    image = image.numpy()
    image = image.transpose(1, 2, 0)
    image = image.clip(0, 1)
    cv2.imwrite('./2.png', image * 255)
    return image

def predict_video(model, img):
    fmap, logits = model(img)
    logits = sm(logits)
    _, prediction = torch.max(logits, 1)
    confidence = logits[:, int(prediction.item())].item() * 100
    print('confidence of prediction:', confidence)
    idx = np.argmax(logits.detach().numpy())
    bz, nc, h, w = fmap.shape
    out = np.dot(fmap[-1].detach().numpy().reshape((nc, h * w)).T, model.linear1.weight[idx, :].detach().numpy().T)
    predict = out.reshape(h, w)
    predict = predict - np.min(predict)
    predict_img = predict / np.max(predict)
    predict_img = np.uint8(255 * predict_img)
    out = cv2.resize(predict_img, (im_size, im_size))
    heatmap = cv2.applyColorMap(out, cv2.COLORMAP_JET)
    img = im_convert(img[:, -1, :, :, :])
    result = heatmap * 0.5 + img * 0.8 * 255
    cv2.imwrite('/content/1.png', result)
    result1 = heatmap * 0.5 / 255 + img * 0.8
    r, g, b = cv2.split(result1)
    result1 = cv2.merge((r, g, b))
    #plt.imshow(result1)
    #plt.show()
    return [int(prediction.item()), confidence]

# Code for full frame processing
class ValidationDataset(Dataset):
    def __init__(self, video_path, sequence_length=60, transform=None):
        self.video_path = video_path
        self.transform = transform
        self.count = sequence_length

    def __len__(self):
        return 1

    def __getitem__(self, idx):
        frames = []
        for i, frame in enumerate(self.frame_extract(self.video_path)):
            if self.transform:
                frame = self.transform(frame)
            frames.append(frame)
            if len(frames) == self.count:
                break
        if not frames:
            raise ValueError(f"No frames extracted from video: {self.video_path}")
        frames = torch.stack(frames)
        frames = frames[:self.count]
        return frames.unsqueeze(0)

    def frame_extract(self, path):
        vidObj = cv2.VideoCapture(path)
        if not vidObj.isOpened():
            raise ValueError(f"Error opening video file: {path}")
        success, image = vidObj.read()
        while success:
            yield image
            success, image = vidObj.read()

# Transformations
train_transforms = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((im_size, im_size)),
    transforms.ToTensor(),
    transforms.Normalize(mean, std)
])
def Vidpredict(vid):
    path_to_model = 'Models/Model.pt'  # Replace with the correct path
    video_dataset = ValidationDataset(vid, sequence_length=100, transform=train_transforms)
    model = Model(num_classes=2)
    model.load_state_dict(torch.load(path_to_model, map_location=torch.device('cpu')))
    model.eval()

    # Load the video frames
    video_loader = torch.utils.data.DataLoader(video_dataset, batch_size=1, shuffle=False)
    for video in video_loader:
        video = video.squeeze(0)  # Remove the batch dimension
        # Get the prediction
        prediction = predict_video(model, video)
        if prediction[0] == 1:
            print("REAL")
        else:
            print("FAKE")
    return prediction


