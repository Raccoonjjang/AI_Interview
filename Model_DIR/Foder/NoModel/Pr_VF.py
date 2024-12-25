import os
import speech_recognition as sr
from pydub import AudioSegment
from matplotlib import font_manager, rc

def set_korean_font():
    # 한글 폰트 설정
    font_path = "C:\\Windows\\Fonts\\malgun.ttf"  # 한글 폰트 경로 설정
    font_name = font_manager.FontProperties(fname=font_path).get_name()
    rc('font', family=font_name)

def mp3_to_text(mp3_file):
    # MP3 파일을 WAV 파일로 변환
    audio = AudioSegment.from_mp3(mp3_file)
    audio.export("temp.wav", format="wav")

    # 음성 인식 객체 생성
    recognizer = sr.Recognizer()

    # WAV 파일에서 오디오 읽기
    with sr.AudioFile(mp3_file) as source:
        audio_data = recognizer.record(source)

    try:
        # 음성을 텍스트로 변환
        text = recognizer.recognize_google(audio_data, language='ko-KR')  # 한국어로 설정, 다른 언어로 변경 가능
        return text
    except sr.UnknownValueError:
        #print("음성을 인식할 수 없습니다.")
        return ""
    except sr.RequestError as e:
        #print(f"Google API 요청에 실패했습니다. 오류: {e}")
        return ""
    finally:
        # 임시 WAV 파일 삭제
        os.remove("temp.wav")

def analyze_speed(mp3_file_path, average_speed=65):
    # MP3 파일을 텍스트로 변환
    result_text = mp3_to_text(mp3_file_path)

    # 텍스트 수 계산
    text_count = len(result_text.split())

    # 출력 WAV 파일의 총 시간 계산
    audio = AudioSegment.from_mp3(mp3_file_path)
    audio_duration = audio.duration_seconds

    # 단어 수와 영상의 총 길이를 이용하여 말의 속도 계산
    words_per_minute = (text_count / audio_duration) * 60

    # 평균값과 비교한 백분율 계산
    percentage_difference = ((words_per_minute - average_speed) / average_speed) * 100

    return result_text, text_count, audio_duration, words_per_minute, percentage_difference

def plot_speed_comparison(mp3_file_path, average_speed=65):
    # 한글 폰트 설정
    set_korean_font()

    result_text, text_count, audio_duration, words_per_minute, percentage_difference = analyze_speed(mp3_file_path, average_speed)

    words_per_minute_round = round(words_per_minute)
    return words_per_minute_round
   