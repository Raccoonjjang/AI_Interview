import os
import librosa
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, Input, concatenate
from keras.models import Model
from keras.callbacks import ModelCheckpoint
from keras.preprocessing.sequence import pad_sequences



# 함수: .wav 파일의 MFCCs 추출
def extract_mfccs(audio_path, n_mfcc=13):
    y, sr = librosa.load(audio_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    return mfccs

# 함수: .wav 파일의 Melspectrogram 특징 추출
def extract_melspectrogram(audio_path, n_mels=128):
    y, sr = librosa.load(audio_path, sr=None)
    mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels)
    return mel_spec

# 함수: 폴더 내 모든 파일의 특징 추출 (재귀적으로 모든 서브폴더 검색)
def extract_features_from_folder(folder_path, label, num_repeats=3):
    mfcc_features = []
    mel_spec_features = []
    labels = []

    for root, dirs, files in os.walk(folder_path):
        for filename in files:
            if filename.endswith(".wav"):
                audio_path = os.path.join(root, filename)

                # MFCCs 추출
                mfccs = extract_mfccs(audio_path)

                # Melspectrogram 추출
                melspectrogram = extract_melspectrogram(audio_path)

                # 데이터 복제
                for _ in range(num_repeats):
                    mfcc_features.append(mfccs)
                    mel_spec_features.append(melspectrogram)
                    labels.append(label)

    return mfcc_features, mel_spec_features, labels

# 나쁜 발음 데이터 경로
bad_pronunciation_folder = r"C:\Users\user\Desktop\Sample (1)\Sample\01.원천데이터\pronunciation\sound"

# 좋은 발음 데이터 경로
good_pronunciation_folder = r"C:\Users\user\Desktop\새 폴더"

# 나쁜 발음 데이터 추출
bad_mfcc_features, bad_mel_spec_features, bad_labels = extract_features_from_folder(bad_pronunciation_folder, label="bad", num_repeats=3)

# 좋은 발음 데이터 추출
good_mfcc_features, good_mel_spec_features, good_labels = extract_features_from_folder(good_pronunciation_folder, label="good", num_repeats=3)

# 데이터셋 구성
all_mfcc_features = bad_mfcc_features + good_mfcc_features
all_mel_spec_features = bad_mel_spec_features + good_mel_spec_features
all_labels = bad_labels + good_labels

# 레이블을 숫자로 변환
label_encoder = LabelEncoder()
encoded_labels = label_encoder.fit_transform(all_labels)

# 데이터 분할
X_train_mfcc, X_test_mfcc, y_train, y_test = train_test_split(all_mfcc_features, encoded_labels, test_size=0.3, random_state=42)
X_train_mel_spec, X_test_mel_spec, _, _ = train_test_split(all_mel_spec_features, encoded_labels, test_size=0.3, random_state=42)

# 최대 시퀀스 길이 계산
max_sequence_length_mfcc = max(len(seq) for seq in all_mfcc_features)
max_sequence_length_mel_spec = max(len(seq) for seq in all_mel_spec_features)

# 각 시퀀스의 길이를 동일하게 만들기 위해 패딩
X_train_mfcc = [pad_sequences(seq, padding='post', maxlen=max_sequence_length_mfcc, dtype='float32') for seq in X_train_mfcc]
X_test_mfcc = [pad_sequences(seq, padding='post', maxlen=max_sequence_length_mfcc, dtype='float32') for seq in X_test_mfcc]

X_train_mel_spec = [pad_sequences(seq, padding='post', maxlen=max_sequence_length_mel_spec, dtype='float32') for seq in X_train_mel_spec]
X_test_mel_spec = [pad_sequences(seq, padding='post', maxlen=max_sequence_length_mel_spec, dtype='float32') for seq in X_test_mel_spec]

# 리스트를 넘파이 배열로 변환
X_train_mfcc = np.array(X_train_mfcc)
X_test_mfcc = np.array(X_test_mfcc)

X_train_mel_spec = np.array(X_train_mel_spec)
X_test_mel_spec = np.array(X_test_mel_spec)

# 모델 구성
mfcc_input = Input(shape=(X_train_mfcc.shape[1], X_train_mfcc.shape[2]))
mel_spec_input = Input(shape=(X_train_mel_spec.shape[1], X_train_mel_spec.shape[2]))

mfcc_branch = LSTM(128)(mfcc_input)
mel_spec_branch = LSTM(128)(mel_spec_input)

# 두 가지 특징을 합침
merged = concatenate([mfcc_branch, mel_spec_branch])

# 완전 연결층 추가
merged = Dense(64, activation='relu')(merged)
merged = Dropout(0.5)(merged)
output_layer = Dense(1, activation='sigmoid')(merged)

model = Model(inputs=[mfcc_input, mel_spec_input], outputs=output_layer)

# 모델 컴파일
# 모델 컴파일
model.compile(loss='mean_squared_error', optimizer='adam', metrics=['mean_squared_error'])

# 모델 체크포인트 설정
checkpoint = ModelCheckpoint("pronunciation_model_combined.h5", monitor="val_accuracy", save_best_only=True, mode="max")

# 모델 학습
model.fit([X_train_mfcc, X_train_mel_spec], y_train, validation_data=([X_test_mfcc, X_test_mel_spec], y_test), epochs=30, batch_size=32, callbacks=[checkpoint])

# 모델 평가
loss, mse = model.evaluate([X_test_mfcc, X_test_mel_spec], y_test)
print(f"Mean Squared Error: {mse}")
