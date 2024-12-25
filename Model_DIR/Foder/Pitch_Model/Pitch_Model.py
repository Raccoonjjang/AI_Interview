import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, RandomizedSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
from scipy.stats import randint
import librosa
import numpy as np

def load_data():
    df = pd.read_excel('C:/Users/82109/Desktop/Model_DIR/pitch_data_labeled_4000_ver2.xlsx')
    unique_labels = df['Label'].unique()

    X = df[['Mean Pitch', 'Pitch STD', 'Pitch Range']]
    y = df['Label']

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    return X, y_encoded, label_encoder

def train_model(X, y):
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

    cv = StratifiedKFold(n_splits=5)

    model = RandomForestClassifier(n_estimators=100, random_state=42)

    param_dist = {
        'max_depth': randint(1, 20),
        'min_samples_split': randint(2, 20),
        'min_samples_leaf': randint(1, 20)
    }

    random_search = RandomizedSearchCV(model, param_distributions=param_dist, n_iter=10, cv=cv, random_state=42)
    random_search.fit(X_train, y_train)


    best_model = random_search.best_estimator_
    y_val_pred = best_model.predict(X_val)

    return best_model

def extract_pitch(file_path):
    y, sr = librosa.load(file_path, sr=None)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[magnitudes > np.median(magnitudes)].flatten()
    pitch_values = pitch_values[pitch_values > 0]
    mean_pitch = np.mean(pitch_values)
    std_pitch = np.std(pitch_values)
    pitch_range = np.max(pitch_values) - np.min(pitch_values)
    return mean_pitch, std_pitch, pitch_range

def predict_and_compare(new_data, model, label_encoder):
    new_data_pred = model.predict([new_data])
    new_label = label_encoder.inverse_transform(new_data_pred)[0]
    return new_label
    

def pitch_model(wav_file_dir) :
    X, Y_encoded, Label_encoder = load_data() #인코딩
    Model = train_model(X, Y_encoded)

    mean_pitch, std_pitch, pitch_range = extract_pitch(wav_file_dir)  # 음성파일
    new_data = [mean_pitch, std_pitch, pitch_range]    
    new_label = predict_and_compare(new_data, Model, Label_encoder)

    if new_label == '낮은 변동성' :
        new_label = "Low Volatility";    return new_label
    
    elif new_label == '중간 변동성' : 
        new_label = "Medium Volatility"; return new_label
    
    elif new_label == '높은 변동성' :
        new_label = "High Volatility";   return new_label    




