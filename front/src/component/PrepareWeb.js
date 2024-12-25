
// 필요한 React 기능, CSS 스타일, 그리고 react-router-dom의 Link 컴포넌트를 임포트
import styles from "./PrepareWeb.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; //WebCam.js 에 질문 개수 넘기기 위해 선언


// PrepareWeb 컴포넌트 정의 (기본 내보내기)
export default function PrepareWeb() {
    const [hasMediaAccess, setHasMediaAccess] = useState(false); // 웹캠/ 마이크 권한 상태 추적 변수
    const [error, setError] = useState(null);
    // useRef를 사용하여 비디오 엘리먼트에 대한 참조를 생성
    const videoRef = useRef(null);
    const navigate = useNavigate(); //WebCam.js 에 질문 개수 넘기기 위해 선언
    const userId = sessionStorage.getItem('userId');
    
    const [formattedDate, setFormattedDate] = useState(getFormattedDate());
    function getFormattedDate() {
        const now = Date.now();
        const date = new Date(now);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    }
    

    // useState를 사용하여 상태를 관리
    const [isWebcamStarted, setWebcamStarted] = useState(false); // 웹캠이 시작되었는지 여부
    const [audioVolume, setAudioVolume] = useState(0); // 오디오 볼륨
    const [questionCount, setQuestionCount] = useState(null); // 선택된 질문의 수

    // "다음" 버튼 클릭 이벤트 핸들러
    const handleNextButtonClick = async () => {
        if (questionCount !== null) {
            setFormattedDate(getFormattedDate());
            console.log(userId, formattedDate, questionCount)
            sessionStorage.setItem("formattedDate", formattedDate);
            console.log(`Selected question count: ${questionCount}`);
            try {
                fetch(`https://0d6d-220-68-223-111.ngrok-free.app/log/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        questionCount,
                        formattedDate,
                    }),
                });
                
                console.log("123213213213");
                navigate(`/WebCam?questionCount=${questionCount}`);
    
            } catch (error) {
                console.error('Error fetching data from server:', error);
            }
        } else {
            alert('진행할 질문 개수를 선택해주세요.');
        }
    };

    // useEffect를 사용하여 컴포넌트 마운트 시 비디오와 오디오 스트림을 시작
    useEffect(() => {

    const startMedia = async () => {
        try {
        // 웹캠과 마이크로부터 미디어 스트림을 가져옴
            const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        // 비디오 엘리먼트에 미디어 스트림을 설정
        videoRef.current.srcObject = mediaStream;

        // 오디오 컨텍스트 및 분석기 설정
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(mediaStream);
        microphone.connect(analyser);
        analyser.fftSize = 1024;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // 오디오 볼륨 체크 함수
        const checkVolume = () => {
            setTimeout(checkVolume, 100);
            analyser.getByteFrequencyData(dataArray);

            let values = 0;
            const length = dataArray.length;
            for (let i = 0; i < length; i++) {
            values += dataArray[i];
            }   

            const volume = values / length;
            setAudioVolume(volume);
        };

        // 오디오 볼륨 체크 함수 실행
        checkVolume();

        // 웹캠이 시작되었음을 설정
        setWebcamStarted(true);

        setHasMediaAccess(true);// 웹캠 / 마이크 권한 상태 추적 변수
        
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("웹캠에 접근할 수 없습니다. 웹캠이 연결되어 있는지 확인하시고, 웹사이트가 웹캠에 접근할 수 있도록 허용해 주세요.");
            setHasMediaAccess(false);// 웹캠 / 마이크 권한 상태 추적 변수
        }
    };

    startMedia();

    // 컴포넌트 언마운트 시, 모든 미디어 트랙을 중지
    return () => {
        const tracks = videoRef.current?.srcObject?.getTracks();
        tracks && tracks.forEach((track) => track.stop());
    };
    }, []);

    // JSX를 반환하여 UI 렌더링
    return (
        <div className={styles["PrepareWebContainer"]}>
        <div className={styles["PrepareWeb-Container"]}>
            <div className={styles["PrepareWeb-Header"]}>
            <h1>
                {isWebcamStarted
                ? "다음을 눌러주세요."
                : "마이크,캠을 준비중입니다."}
            </h1>
            {/* "다음" 버튼에 클릭 이벤트 핸들러 연결 */}
            <button className={styles["button1"]} onClick={handleNextButtonClick} disabled={!hasMediaAccess}>
                다음
            </button>
            </div>
            <div className={styles["WebCam-Container"]}>
            {/* 비디오 컴포넌트, 자동재생 설정 */}
            <video className={styles["WebCam"]} ref={videoRef} autoPlay playsInline />
            </div>
            <div className={styles["VolumeBarContainer"]}>
            <div className={styles["Bars"]}>
                {/* 볼륨 바 생성, 오디오 볼륨에 따라 스타일 변화 */}
                {[...Array(10)].map((_, index) => (
                <div
                    key={Symbol(index).toString()}
                    className={`${styles["Bar"]} ${
                    audioVolume > index * 10
                        ? styles["BarFilled"]
                        : styles["BarEmpty"]
                    }`}
                />
                ))}
            </div>
            </div>
            {isWebcamStarted && questionCount === null && (
            <div className={styles["QuestionCountSelection"]}>
                <p>진행할 질문 개수를 선택해주세요:</p>
                <div>
                {/* 질문 개수 선택 버튼 */}
                <button className={styles.button} onClick={() => setQuestionCount(3)}>3</button>
                <button className={styles.button2} onClick={() => setQuestionCount(5)}>5</button>
                <button className={styles.button2} onClick={() => setQuestionCount(7)}>7</button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}