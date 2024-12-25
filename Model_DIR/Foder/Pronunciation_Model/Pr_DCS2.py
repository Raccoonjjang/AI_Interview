# audio_analysis.py

import numpy as np
import librosa
from keras.models import load_model
from sklearn.metrics import mean_squared_error

model_path = 'C:/Users/82109/Desktop/Model_DIR/Foder/Pronunciation_Model/pronunciation_model_combined.h5'

def extract_melspectrogram(audio_path, n_mels=128):
    y, sr = librosa.load(audio_path, sr=None)
    mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels)
    return mel_spec

def extract_mfccs(audio_path, n_mfcc=13):
    y, sr = librosa.load(audio_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    return mfccs

def load_trained_model(model_path):
    return load_model(model_path, compile=False)

def prepare_features(melspectrogram, mfccs, max_len_melspec=128, max_len_mfcc=13):
    # Adjusting the melspectrogram length
    if melspectrogram.shape[1] < max_len_melspec:
        melspectrogram = np.pad(melspectrogram, ((0, 0), (0, max_len_melspec - melspectrogram.shape[1])))
    else:
        melspectrogram = melspectrogram[:, :max_len_melspec]

    # Adjusting the MFCC length
    if mfccs.shape[1] < max_len_mfcc:
        mfccs = np.pad(mfccs, ((0, 0), (0, max_len_mfcc - mfccs.shape[1])))
    else:
        mfccs = mfccs[:, :max_len_mfcc]

    # Expanding dimensions for model input
    melspectrogram = np.expand_dims(melspectrogram, axis=0)
    melspectrogram = np.expand_dims(melspectrogram, axis=-1)
    mfccs = np.expand_dims(mfccs, axis=0)
    mfccs = np.expand_dims(mfccs, axis=-1)

    return melspectrogram, mfccs

def predict_audio_label(audio_path):
    melspectrogram = extract_melspectrogram(audio_path)
    mfccs = extract_mfccs(audio_path)
    melspectrogram, mfccs = prepare_features(melspectrogram, mfccs)
    loaded_model = load_trained_model(model_path)
    prediction = loaded_model.predict([mfccs, melspectrogram])
    
    predicted_label = "Good" if prediction > 0.5 else "Bad"
    return predicted_label, prediction

def calculate_mse(true_label, prediction):
    mse_result = mean_squared_error([1] if true_label == "좋음" else [0], prediction)    
    return f"{mse_result * 100:.2f}"

# def predict_label_def(prediction):
#     predicted_label = "좋음" if prediction > 0.5 else "나쁨"
#     return predicted_label