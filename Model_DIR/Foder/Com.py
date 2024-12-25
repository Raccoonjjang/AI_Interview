from Pitch_Model import Pitch_Model as pm
from NoModel import Pr_VF as vf
from STT_Model import SpeachUp as su
from Pronunciation_Model import Pr_DCS2 as dcs
from AudioSegment import AudioSegment as audioS
import sys
import json
import os


# dir = r'C:/Users/82109/Desktop/KakaoTalk_20231222_112349205.mp4'
# wav_file = audioS.Check_Extension(dir)
# true_label = "나쁨"  # 실제 레이블로 바꿔주세요
# import speech_recognition
# print(speech_recognition.__file__)

wav_file   = audioS.Check_Extension(sys.argv[1])
true_label = sys.argv[2]

print("빠르기 계산중....")
Voice_Speed = vf.plot_speed_comparison(wav_file)#말 빠르기

print("높낮이 계산중....")
Pitch_Volatility = pm.pitch_model(wav_file) # Pitch_Volatility - 음성 변동성

print("정확도 계산중....")
prediction, percentage = dcs.predict_audio_label(wav_file) #발음 정확도

print("정확도(float) 계산중....")
total_prediction = dcs.calculate_mse(true_label, percentage) #발음 정확도(float)

print("전사 처리중....")
filler_count, slience_count = su.return_transcript(wav_file) #전사 처리

os.system('cls')

result = {
    "Pitch_Volatility": Pitch_Volatility,
    "Voice_Speed": Voice_Speed,
    "Prediction": prediction,
    "Total_Prediction": total_prediction,
    "Filler_Count": filler_count,
    "Silence_Count": slience_count
}

print(json.dumps(result, ensure_ascii=False))
#print(json.dumps(result, ensure_ascii=False).encode('utf-8'))
