import os
from moviepy.editor import VideoFileClip

def Check_Extension(Audio_file) :
    file_name, file_extension = os.path.splitext(Audio_file)
    if file_extension.lower() == '.wav' : return Audio_file

    elif file_extension.lower() == '.mp4' :
        convert = convert_mp4_to_wav(Audio_file)
        return convert
    
    else :
        return convert

def convert_mp4_to_wav(mp4_file):
    # 출력 폴더 생성
    output_folder = 'data'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # WAV 파일 이름 설정 (원본 MP4 파일 이름 사용)
    wav_file_name = os.path.splitext(os.path.basename(mp4_file))[0] + '.wav'
    
    # WAV 파일을 저장할 전체 경로
    wav_file = os.path.join(output_folder, wav_file_name)

    # 비디오 파일 로드
    video = VideoFileClip(mp4_file)

    # 오디오 추출 및 WAV 파일로 저장
    video.audio.write_audiofile(wav_file)

    return wav_file
