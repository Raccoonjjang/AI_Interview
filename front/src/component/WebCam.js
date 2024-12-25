//#region 새로운 코드

// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom'; //PrepareWeb.js 코드에서 보내주는 질문 개수를 받기 위해 사용
// import { useNavigate } from 'react-router-dom';

// import styles from './WebCam.module.css';
// import Question from './Question.js';
// let QuestNum = 0;
// sessionStorage.setItem('formattedDate',null)

// export default function WebCam() {

//   //PrepareWeb.js 코드에서 보내주는 질문 개수를 받기 위해 사용
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const questionCount = queryParams.get('questionCount'); // PrepareWeb.js에서 questionCount 값을 가져옴

//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const [recording, setRecording] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [formattedDate, setFormattedDate] = useState(getFormattedDate());
//   const [timeLeft, setTimeLeft] = useState(1); //처음 대기 시간
//   const navigate = useNavigate();
//   function getFormattedDate() {
//     const now = Date.now();
//     const date = new Date(now);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
//     return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
//   }

//   let timeoutId;  // 타임아웃을 저장하기 위한 변수 추가

//   const stopWebcam = async () => {
//     if (!mediaRecorderRef.current) return;

//     try {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//       sessionStorage.setItem('QuestNum',QuestNum)
//       setShowModal(true)
//       if (timeLeft <= 9) {
//         // 현재 시간 기준으로 5초 뒤에 함수 실행
//         const now = Date.now();
//         const fiveSecondsLater = now + 8500; //대기 시간
//         // 기존 타임아웃을 취소하고 새로운 타임아웃을 설정
//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(startWebcamAfterDelay, fiveSecondsLater - now);
//       }
//     } catch (error) {
//       console.log('녹화 중지 중 오류 발생:', error);
//     }
//   };

//   const startWebcamAfterDelay = () => {
//     setTimeLeft(10); //진행 시간
//     setShowModal(false)
//     startWebcam();
//     console.log('5초끝');
//   };

//   function useTimer(initialTime, onTimeUp = () => {}) {
//     useEffect(() => {
//       const timer = setInterval(() => {
//         setTimeLeft((prevTime) => {
//           if (prevTime > 0 && recording) {
//             return prevTime - 1;
//           } else if (prevTime === 0) {
//             onTimeUp();
//             clearInterval(timer);
//             return 0;
//           }
//           return prevTime;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           );

//     return timeLeft;
//   }

//   const startWebcam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

//       let value = sessionStorage.getItem("formattedDate")
//       document.body.style.backdropFilter = 'none';
//       if (videoRef.current) {

//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//         if (!recording) {
//           mediaRecorderRef.current = new MediaRecorder(stream);
//           mediaRecorderRef.current.ondataavailable = handleDataAvailable;
//           mediaRecorderRef.current.start();
//           QuestNum = QuestNum + 1;

//           //console.log(`PrepareWeb.js에서 선택한 질문 개수 : ${questionCount}`); //

//           if (QuestNum >= 8) {
//             console.log(value);
//             //fetch 추가필요 (리포트 전 음성, 비디오 분석하는 fetch)
//             navigate('/Report', { state: { formattedDate: value } });
//             return;
//           }
//           if (value === "null"){
//             sessionStorage.setItem('formattedDate',formattedDate)
//             value = formattedDate
//           }
//           setRecording(true);
//           console.log('Recording has started.');
//         }
//       }
//     } catch (error) {
//       console.error('Error accessing webcam:', error);
//     }
//   };

//   const handleDataAvailable = async (event) => {
//     console.log('Data available:', event.data);

//     let value = sessionStorage.getItem("formattedDate");
//     const userId = sessionStorage.getItem('userId');
//     const filename = `${userId}${value}${QuestNum}.mp4`;
//     const formData = new FormData();

//     formData.append('video', event.data, filename);
//     formData.append('userId', userId);
//     formData.append('qnum', QuestNum);
//     formData.append('filetime', value);
//     try {
//       // 수정 필요 (질문 생성 관련 fetch)
//       // 비디오 업로드 성공 후 질문 생성 요청
//       console.log("makeQuestionResponse 실행 전")
//       const makeQuestionResponse = await fetch('https://0d6d-220-68-223-111.ngrok-free.app/MakeQuestion', {
//         method: 'POST',
//         body: formData,
//       });

//       // 비디오 업로드 요청
//       console.log("쓰바 웹캠 라우터 호출한다");
//       const uploadResponse = await fetch('https://0d6d-220-68-223-111.ngrok-free.app/WebCam', {
//         method: 'POST',
//         body: formData,
//       });

//       const responseData = await uploadResponse.json();
//       const questionResponseData = await makeQuestionResponse.json();
//       console.log('Upload response:', responseData);
//       console.log('MakeQuestion response:', questionResponseData);

//     } catch (error) {
//       console.log('Error processing request:', error);
//     }
//   };

//   useEffect(() => {
//     console.log("이거실행되면 어떻게되나요?")

//     videoRef.current.style.width = '100%';
//     videoRef.current.style.height = '400px';
//     videoRef.current.style.objectFit = 'cover';
//     videoRef.current.style.border = '2px solid black'; // 이 부분을 추가하여 border를 설정합니다.
//     setFormattedDate(getFormattedDate());

//     //setShowModal(true)
//   }, [recording]);

//   useTimer(5, stopWebcam);

//   return (
//     <div>
//       <div className={styles['App-header']}>
//         <h1 className={styles.MyText}>AI 모의면접</h1>
//       </div>

//       <div className={styles.CamPage}>
//         <video ref={videoRef} autoPlay playsInline />

//         <div className={styles.Text}>
//           <h2>남은 시간: {timeLeft}초</h2>
//         </div>
//         <button onClick={startWebcam} disabled={recording || timeLeft === 0} className={styles.actionButton}>면접 시작</button>

//         <button onClick={stopWebcam} disabled={!recording || timeLeft === 0} className={styles.actionButton}>화장실 가기</button>
//       </div>
//       <div className={styles.modalContainer2}>
//       {showModal && (
//             <div onClick={(e) => {
//               }}>
//               <Question formattedDate={formattedDate}/>
//               <div className={styles.videoContainer}/>
//             </div>
//           )}
//           </div>
//     </div>
//   );
// }

//#endregion 새로운 코드

// #region 새로운 코드

// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom'; //PrepareWeb.js 코드에서 보내주는 질문 개수를 받기 위해 사용
// import { useNavigate } from 'react-router-dom';

// import styles from './WebCam.module.css';
// import Question from './Question.js';
// let QuestNum = 0;
// sessionStorage.setItem('formattedDate',null)

// export default function WebCam() {

//   //PrepareWeb.js 코드에서 보내주는 질문 개수를 받기 위해 사용
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const questionCount = queryParams.get('questionCount'); // PrepareWeb.js에서 questionCount 값을 가져옴

//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const [recording, setRecording] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [formattedDate, setFormattedDate] = useState(getFormattedDate());
//   const [timeLeft, setTimeLeft] = useState(1); //처음 대기 시간
//   const navigate = useNavigate();
//   function getFormattedDate() {
//     const now = Date.now();
//     const date = new Date(now);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
//     return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
//   }

//   let timeoutId;  // 타임아웃을 저장하기 위한 변수 추가

//   const stopWebcam = async () => {
//     if (!mediaRecorderRef.current) return;

//     try {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//       sessionStorage.setItem('QuestNum',QuestNum)
//       setShowModal(true)
//       if (timeLeft <= 9) {
//         // 현재 시간 기준으로 5초 뒤에 함수 실행
//         const now = Date.now();
//         const fiveSecondsLater = now + 8500; //대기 시간
//         // 기존 타임아웃을 취소하고 새로운 타임아웃을 설정
//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(startWebcamAfterDelay, fiveSecondsLater - now);
//       }
//     } catch (error) {
//       console.log('녹화 중지 중 오류 발생:', error);
//     }
//   };

//   const startWebcamAfterDelay = () => {
//     setTimeLeft(10); //진행 시간
//     setShowModal(false)
//     startWebcam();
//     console.log('5초끝');
//   };

//   function useTimer(initialTime, onTimeUp = () => {}) {
//     useEffect(() => {
//       const timer = setInterval(() => {
//         setTimeLeft((prevTime) => {
//           if (prevTime > 0 && recording) {
//             return prevTime - 1;
//           } else if (prevTime === 0) {
//             onTimeUp();
//             clearInterval(timer);
//             return 0;
//           }
//           return prevTime;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           );

//     return timeLeft;
//   }

//   const startWebcam = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

//       let value = sessionStorage.getItem("formattedDate")
//       document.body.style.backdropFilter = 'none';
//       if (videoRef.current) {

//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//         if (!recording) {
//           mediaRecorderRef.current = new MediaRecorder(stream);
//           mediaRecorderRef.current.ondataavailable = handleDataAvailable;
//           mediaRecorderRef.current.start();
//           QuestNum = QuestNum + 1;

//           //console.log(`PrepareWeb.js에서 선택한 질문 개수 : ${questionCount}`); //

//           if (QuestNum >= 9) {
//             console.log("진입 전 전 전 전 전 전 전 전 전 전 전 전 전");
//             //새롭게 추가된 코드
//             let value = sessionStorage.getItem("formattedDate");
//             const userId = sessionStorage.getItem('userId');
//             const formData = new FormData();

//             formData.append('userId', userId);
//             formData.append('qnum', QuestNum);
//             formData.append('filetime', value);

//             console.log(`QuestNum : ${QuestNum}`);

//             //fetch 추가필요 (리포트 전 음성, 비디오 분석하는 fetch)
//             const analyzeResponse = await fetch('https://0d6d-220-68-223-111.ngrok-free.app/Analyze_fetch', {
//               //userID, QuestNum, filetime 전송 필요
//               method: 'POST',
//               body: formData
//             });

//             const analyzeResult = await analyzeResponse.json(); // 응답을 JSON으로 파싱
//             console.log(`analyzeResult = ${JSON.stringify(analyzeResult)}`);

//             navigate('/Report', { state: { formattedDate: value } });
//             return;
//           }
//           if (value === "null"){
//             sessionStorage.setItem('formattedDate',formattedDate)
//             value = formattedDate
//           }
//           setRecording(true);
//           console.log('Recording has started.');
//         }
//       }
//     } catch (error) {
//       console.error('Error accessing webcam:', error);
//     }
//   };

//   const handleDataAvailable = async (event) => {
//     console.log('Data available:', event.data);

//     let value = sessionStorage.getItem("formattedDate");
//     const userId = sessionStorage.getItem('userId');
//     const filename = `${userId}${value}${QuestNum}.mp4`;

//     const formData = new FormData();

//     formData.append('video', event.data, filename);
//     formData.append('userId', userId);
//     formData.append('QuNum', QuestNum);
//     formData.append('filetime', value);
//     try {
//       // 수정 필요 (질문 생성 관련 fetch)
//       // 비디오 업로드 성공 후 질문 생성 요청
//       console.log("makeQuestionResponse 실행 전")
//       const makeQuestionResponse = await fetch('https://0d6d-220-68-223-111.ngrok-free.app/MakeQuestion', {
//         method: 'POST',
//         body: formData,
//       });

//       const questionResponseData = await makeQuestionResponse.json();
//       console.log('MakeQuestion response:', questionResponseData);

//     } catch (error) {
//       console.log('Error processing request:', error);
//     }
//   };

//   useEffect(() => {
//     console.log("이거실행되면 어떻게되나요?")

//     videoRef.current.style.width = '100%';
//     videoRef.current.style.height = '400px';
//     videoRef.current.style.objectFit = 'cover';
//     videoRef.current.style.border = '2px solid black'; // 이 부분을 추가하여 border를 설정합니다.
//     setFormattedDate(getFormattedDate());

//     //setShowModal(true)
//   }, [recording]);

//   useTimer(5, stopWebcam);

//   return (
//     <div>
//       <div className={styles['App-header']}>
//         <h1 className={styles.MyText}>AI 모의면접</h1>
//       </div>

//       <div className={styles.CamPage}>
//         <video ref={videoRef} autoPlay playsInline />

//         <div className={styles.Text}>
//           <h2>남은 시간: {timeLeft}초</h2>
//         </div>
//         <button onClick={startWebcam} disabled={recording || timeLeft === 0} className={styles.actionButton}>면접 시작</button>

//         <button onClick={stopWebcam} disabled={!recording || timeLeft === 0} className={styles.actionButton}>화장실 가기</button>
//       </div>
//       <div className={styles.modalContainer2}>
//       {showModal && (
//             <div onClick={(e) => {
//               }}>
//               <Question formattedDate={formattedDate}/>
//               <div className={styles.videoContainer}/>
//             </div>
//           )}
//           </div>
//     </div>
//   );
// }

//#endregion 새로운 코드

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom'; //PrepareWeb.js 코드에서 보내주는 질문 개수를 받기 위해 사용
import { useNavigate } from 'react-router-dom';

import styles from './WebCam.module.css';
import Question from './Question.js';
let QuestNum = 0;
let QuestN = 0;
export default function WebCam() {
  //PrepareWeb.js 코드에서 보내주는 질문 개수를 받기 위해 사용
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const questionCount = queryParams.get('questionCount'); // PrepareWeb.js에서 questionCount 값을 가져옴

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); //처음 대기 시간
  const navigate = useNavigate();
  let timeoutId; // 타임아웃을 저장하기 위한 변수 추가

  const stopWebcam = async () => {
    if (!mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.stop();
      setRecording(false);
      sessionStorage.setItem('QuestNum', QuestNum);
      if (QuestNum >= 4) {
        //변경 : QuestNum >= 4    ->    QuestNum >= 3
        console.log('진입 전 전 전 전 전 전 전 전 전 전 전 전 전');
        //새롭게 추가된 코드
        let value = sessionStorage.getItem('formattedDate');
        const userId = sessionStorage.getItem('userId');
        const formData = new FormData();

        formData.append('userId', userId);
        formData.append('qnum', QuestNum);
        formData.append('filetime', value);

        console.log(`QuestNum : ${QuestNum}`);

        navigate('/MyAccount');
        //fetch 추가필요 (리포트 전 음성, 비디오 분석하는 fetch)
        const analyzeResponse = await fetch(
          'https://0d6d-220-68-223-111.ngrok-free.app/Analyze_fetch',
          {
            //userID, QuestNum, filetime 전송 필요
            method: 'POST',
            body: formData,
          }
        );

        const analyzeResult = await analyzeResponse.json(); // 응답을 JSON으로 파싱
        console.log(`analyzeResult = ${JSON.stringify(analyzeResult)}`);

        return;
      }
      setShowModal(true);
      if (timeLeft <= 9) {
        // 현재 시간 기준으로 5초 뒤에 함수 실행
        const now = Date.now();
        const fiveSecondsLater = now + 15000; //대기 시간
        // 기존 타임아웃을 취소하고 새로운 타임아웃을 설정
        clearTimeout(timeoutId);
        timeoutId = setTimeout(startWebcamAfterDelay, fiveSecondsLater - now);
      }
    } catch (error) {
      console.log('녹화 중지 중 오류 발생:', error);
    }
  };

  const startWebcamAfterDelay = () => {
    setTimeLeft(20); //진행 시간
    setShowModal(false);
    startWebcam();
    console.log('5초끝');
  };

  function useTimer(initialTime, onTimeUp = () => {}) {
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0 && recording) {
            return prevTime - 1;
          } else if (prevTime === 0) {
            onTimeUp();
            clearInterval(timer);
            return 0;
          }
          return prevTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    });

    return timeLeft;
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      document.body.style.backdropFilter = 'none';
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        if (!recording) {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = handleDataAvailable;
          mediaRecorderRef.current.start();
          QuestNum = QuestNum + 1;
          if (QuestNum > 1) {
            QuestN = QuestNum - 1;
          }
          //console.log(`PrepareWeb.js에서 선택한 질문 개수 : ${questionCount}`); //

          if (QuestNum >= 5) {
            //변경 : QuestNum >= 4    ->    QuestNum >= 3
            console.log('진입 전 전 전 전 전 전 전 전 전 전 전 전 전');
            //새롭게 추가된 코드
            let value = sessionStorage.getItem('formattedDate');
            const userId = sessionStorage.getItem('userId');
            const formData = new FormData();

            formData.append('userId', userId);
            formData.append('qnum', QuestNum);
            formData.append('filetime', value);

            console.log(`QuestNum : ${QuestNum}`);

            navigate('/MyAccount');
            //fetch 추가필요 (리포트 전 음성, 비디오 분석하는 fetch)
            const analyzeResponse = await fetch(
              'https://0d6d-220-68-223-111.ngrok-free.app/Analyze_fetch',
              {
                //userID, QuestNum, filetime 전송 필요
                method: 'POST',
                body: formData,
              }
            );

            const analyzeResult = await analyzeResponse.json(); // 응답을 JSON으로 파싱
            console.log(`analyzeResult = ${JSON.stringify(analyzeResult)}`);

            return;
          }
          setRecording(true);
          console.log('Recording has started.');
        }
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const handleDataAvailable = async (event) => {
    console.log('Data available:', event.data);

    let value = sessionStorage.getItem('formattedDate');
    const userId = sessionStorage.getItem('userId');
    const filename = `${userId}${value}${QuestNum - 1}.mp4`;

    const formData = new FormData();

    formData.append('video', event.data, filename);
    formData.append('userId', userId);
    formData.append('QuNum', QuestNum);
    formData.append('filetime', value);
    if (QuestNum > 1) {
      try {
        // 수정 필요 (질문 생성 관련 fetch)
        // 비디오 업로드 성공 후 질문 생성 요청
        console.log('makeQuestionResponse 실행 전');
        const makeQuestionResponse = await fetch(
          'https://0d6d-220-68-223-111.ngrok-free.app/MakeQuestion',
          {
            method: 'POST',
            body: formData,
          }
        );

        const questionResponseData = await makeQuestionResponse.json();
        console.log('MakeQuestion response:', questionResponseData);
      } catch (error) {
        console.log('Error processing request:', error);
      }
    }
  };

  useEffect(() => {
    console.log('이거실행되면 어떻게되나요?');

    videoRef.current.style.width = '100%';
    videoRef.current.style.height = '400px';
    videoRef.current.style.objectFit = 'cover';
    videoRef.current.style.border = '2px solid black'; // 이 부분을 추가하여 border를 설정합니다.

    //setShowModal(true)
  }, [recording]);

  useTimer(5, stopWebcam);

  return (
    <div>
      <div className={styles['App-header']}>
        <h1 className={styles.MyText}>AI 모의면접</h1>
      </div>

      <div className={styles.CamPage}>
        <video ref={videoRef} autoPlay playsInline />

        <div className={styles.Text}>
          <h2>남은 시간: {timeLeft}초</h2>
        </div>
        <button
          onClick={startWebcam}
          disabled={recording || timeLeft === 0}
          className={styles.actionButton}
        >
          면접 시작
        </button>
        <p>
          남은 질문 {QuestN} / {questionCount}
        </p>
      </div>
      <div className={styles.modalContainer2}>
        {showModal && (
          <div onClick={(e) => {}}>
            <Question />
            <div className={styles.videoContainer} />
          </div>
        )}
      </div>
    </div>
  );
}

//#endregion 새로운 코드
