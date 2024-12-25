//NewReport.js
import styles from './Report.module.css';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import kyungji from '../Asset/Image/kyungji.jpg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useParams } from 'react-router-dom';

import { Link } from "react-router-dom";
export default function Report() {
    const [voiceData, setVoiceData] = useState({
        PITCH: "Medium Volatility",
        SPEED: 39,
        DICTION: "Good",
        CONTINUERS: 48.48,
        SILENCE: 100,
        SIMILARITY: 12.12
    });
    const getNumericalVoiceData = useCallback(() => {
        return [
            voiceData.SPEED,
            voiceData.CONTINUERS,
            voiceData.SILENCE,
            voiceData.SIMILARITY
        ];
    }, [voiceData]); // Dependencies of the function

    
    function parseDateString(dateString) {
        const date = new Date(dateString);
      
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
      
        let year = parts.find(part => part.type === 'year').value;
        let month = parts.find(part => part.type === 'month').value;
        let day = parts.find(part => part.type === 'day').value;
        let hour = parts.find(part => part.type === 'hour').value;
        let minute = parts.find(part => part.type === 'minute').value;
        let second = parts.find(part => part.type === 'second').value;
        
        if (hour === '24') {
            hour = '00';
        }
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    function parseDateString2(dateString) {
        const date = new Date(dateString);
      
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
      
        let year = parts.find(part => part.type === 'year').value;
        let month = parts.find(part => part.type === 'month').value;
        let day = parts.find(part => part.type === 'day').value;
        let hour = parts.find(part => part.type === 'hour').value;
        let minute = parts.find(part => part.type === 'minute').value;
        let second = parts.find(part => part.type === 'second').value;
        
        if (hour === '24') {
            hour = '00';
        }
        return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
    }
    const dateString = useParams();
    
    const videoId = parseDateString(dateString.videoId);
    
    const videoId2 = parseDateString2(dateString.videoId);
    const userId = sessionStorage.getItem('userId');
    let value = sessionStorage.getItem("formattedDate")
    
    const [QuestNum, setQuestNum] = useState(0);
    // const videoRef = useRef();
    const videoRefs = Array.from({ length: QuestNum }, () => React.createRef());
    const questArray = new Array(QuestNum);

    const [userName, setUserName] = useState("");

    const [eyedata, setEyedata] = useState([30, 25, 20, 25]);
    const [emotionData, setEmotionData] = useState([30, 25, 20, 25]);
    const [headPositionData, setHeadPositionData] = useState([30, 25, 20]);



    const chartRefHead = useRef(null);
    const chartRefVoice = useRef(null);

    

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        // 페이지가 로드될 때 서버에 데이터 요청
        fetch('https://0d6d-220-68-223-111.ngrok-free.app/Report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                videoId
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'success') {
                    setQuestNum(data.qnum);
                    setEyedata([data.userData.s_center, data.userData.s_left, data.userData.s_right, data.userData.blink]);
                    setEmotionData([data.userData.happy, data.userData.sad, data.userData.surprise, data.userData.neutral]);
                    setHeadPositionData([data.userData.s_center, data.userData.s_left, data.userData.s_right]);
                    setUserName(data.userData.NAME);


                    // 이 부분을 객체로 수정
                    setVoiceData({
                        PITCH: data.userData.pitch,
                        SPEED: data.userData.speed,
                        DICTION: data.userData.diction,
                        CONTINUERS: data.userData.continuers,
                        SILENCE: data.userData.silence,
                        SIMILARITY: data.userData.similarity
                    });
                    setIsLoading(false);  // 로딩 상태 변경
                } else {
                    console.error("Server returned an error:", data.message);
                    setIsLoading(false);  // 에러 발생 시 로딩 상태 변경
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setIsLoading(false);  // 에러 발생 시 로딩 상태 변경
            });
    }, [userId]);

    useEffect(() => {
        for (let i = 1; i <= QuestNum; i++) {

            // 페이지가 로드될 때 서버에 데이터 요청
            fetch('https://0d6d-220-68-223-111.ngrok-free.app/videoreport', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    videoId2,
                    i,
                }),
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    console.log("a");
                    return res.blob();
                })
                .then((blob) => {
                    // videoRef.current.src = URL.createObjectURL(blob);
                    videoRefs[i - 1].current.src = URL.createObjectURL(blob);
                    console.log("b");
                    let asd = videoRefs[i - 1].current.src;
                    console.log(asd);
                })
                .catch((error) => {
                    console.log("c");
                    console.error('Error fetching video:', error);
                });
        }
    },);

    useEffect(() => {
        for (let i = 1; i <= QuestNum; i++) {

            // 페이지가 로드될 때 서버에 데이터 요청
            fetch('https://0d6d-220-68-223-111.ngrok-free.app/videoreportSec', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    videoId,
                    i,
                }),
            })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json(); // JSON 형식으로 응답 받기
            })
            .then((data) => {
                questArray.push(data.Sec)
                console.log(questArray)
                
            })
            .catch((error) => {
                console.error('Error fetching video:', error);
            });
        }
    },);



    // -----------------------------------차트 생성 부분-------------------------
    //머리 회전그래프
    useEffect(() => {
        if (!isLoading && chartRefHead.current) {
            const donutChartHead = new Chart(chartRefHead.current, {
                type: 'doughnut',
                data: {
                    labels: ['중앙', '좌로 치우침', '우로 치우침'],
                    datasets: [{
                        data: headPositionData,
                        backgroundColor: ['#00CCCC', '#0066CC', '#9999cc'],
                        hoverOffset: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            });
            return () => {
                donutChartHead.destroy();
            };
        }
    }, [headPositionData, isLoading]);

    //음성 radar 데이터 
    useEffect(() => {
        if (!isLoading && chartRefVoice.current) {

            const radarChartVoiceData = getNumericalVoiceData();

            const RadarChartVoice = new Chart(chartRefVoice.current, {
                type: 'radar',
                data: {
                    labels: ['빠르기', '연속성', '침묵횟수', '정확도'],
                    datasets: [{
                        data: radarChartVoiceData,
                        borderWidth: 2,
                    }]
                },

                options: {
                    scales: {
                        r: {
                            ticks: {
                                color: 'black',
                                font: {
                                    size: 14,
                                },
                                beginAtZero: true,
                                max: 100,

                            },
                            angleLines: {
                                display: true
                            },
                            pointLabels: {
                                display: true,
                                font: {
                                    size: 17,
                                    weight: '700',
                                    family: 'Pretendard',
                                },

                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                            //position: 'bottom'
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
            });
            return () => {
                RadarChartVoice.destroy();
            };
        }
    }, [getNumericalVoiceData, isLoading]);
    //------------------------------------------------------
    //판별 함수

    function score(num) {
        if (num >= 70) {
            return '평균 이상';
        }
        else if (num <= 55) {
            return '평균 이하';
        }
        else { return '평균' };
    }
    //---------------------------------------
    //탭 구현
    const voiceScore = score(voiceData.SIMILARITY);
    const eyeScore = score(eyedata.reduce((a, b) => a + b) / eyedata.length); // 평균 시야 점수
    const emotionScore = score(emotionData.reduce((a, b) => a + b) / emotionData.length); // 평균 표정 점수
    const data = [
        {
            id: 0,
            title: "음성분석 결과",
            description: (
                <div>
                    <p>음성 분석에서 {userName}님은 {voiceData.DICTION} 에 해당하는 발음과 {voiceData.SPEED}만큼의 빠르기를 보였습니다.</p>
                    <p> 연속성과 침묵, 유사도 점수는 각각 {voiceData.CONTINUERS}, {voiceData.SILENCE}, {voiceData.SIMILARITY}로 나타났습니다. </p>
                    <p>전반적으로 {voiceScore}인 음성 분석 결과를 보여주었습니다.</p>
                </div >
            ),
        },
        {
            id: 1,
            title: "시야분석 결과",
            description: (
                <div>
                    <p>{userName}님의 시야 분석에서는 중앙, 왼쪽, 오른쪽 시야와 깜빡임 횟수가 각각 {eyedata[0]}%, {eyedata[1]}%, {eyedata[2]}%, {eyedata[3]}회로 나타났습니다.</p>
                    <p>이는 {eyeScore}의 집중력과 주의 분산을 나타내는 지표가 될 수 있습니다.</p>
                </div>
            ),
        },
        {
            id: 2,
            title: "표정분석 결과",
            description: (
                <div>
                    <p> 웃음: {emotionData[0]}, 슬픔: {emotionData[1]}, 놀람: {emotionData[2]}, 무표정: {emotionData[3]}</p>
                </div>
            ),
        }
    ];



    //--------------------------------------------------------------------------
    // 여기에 각 섹션에 해당하는 컴포넌트를 만듭니다.
    function Header() {
        return (
            <div className={styles['header-section']}>
                <h2>AI 면접 검사 결과</h2>
            </div>);
    }
    // 왼쪽 판넬 섹션 컴포넌트
    function LeftPanel() {
        const happyPercentage = emotionData[0];
        const sadPercentage = emotionData[1];
        const surprisePercentage = emotionData[2];
        const neutralPercentage = emotionData[3];

        const s_centerPercentage = eyedata[0];
        const s_rightPercentage = eyedata[1];
        const s_leftPercentage = eyedata[2];
        const blinkPercentage = eyedata[3];

        return (
            <div className={styles['left-panel']}>
                {/* 기존의 map 함수를 사용한 ProgressCircle 렌더링 코드 */}
                {/* 아래는 CircularProgressbar 컴포넌트의 올바른 사용 예시입니다. */}
                <div className={styles['UserData']}>
                </div>

                <h3 className={styles['circle-title']}>시야분석</h3>
                <div className={styles['charts-flex-container-line']}>
                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={s_centerPercentage}
                                text={`${s_centerPercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(62, 152, 199, ${s_centerPercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;중앙</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={s_rightPercentage}
                                text={`${s_rightPercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(62, 152, 199, ${s_rightPercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;오른쪽</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={s_leftPercentage}
                                text={`${s_leftPercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(62, 152, 199, ${s_leftPercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;왼쪽</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={blinkPercentage}
                                text={`${blinkPercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(62, 152, 199, ${blinkPercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;깜빡임</div> {/* Add this line */}
                    </div>
                </div>
                <div className={styles['gradient-line']}></div>

                <h3 className={styles['circle-title']}>표정분석</h3>
                <div className={styles['charts-flex-container-line']}>
                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={happyPercentage}
                                text={`${happyPercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(00, 204, 204, ${happyPercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;행복</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={sadPercentage}
                                text={`${sadPercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'round',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(00, 204, 204, ${sadPercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;슬픔</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={surprisePercentage}
                                text={`${surprisePercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(00, 204, 204, ${surprisePercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;놀라움</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                            <CircularProgressbar
                                value={neutralPercentage}
                                text={`${neutralPercentage}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: `rgba(00, 204, 204, ${neutralPercentage / 100})`,
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;평범</div> {/* Add this line */}
                    </div>
                </div>
                <div className={styles['gradient-line']}></div>
                <h3 className={styles['circle-title']}>머리위치분석</h3>
                <div className={styles['chart-container']}>
                    <canvas ref={chartRefHead} aria-label="머리 위치 분석"></canvas>
                </div>
                <div className={styles['gradient-line']}></div>
            </div>
        );
    }
    // 가운데 판넬 섹션 컴포넌트
    function CenterPanel() {
        return (
            <div className={styles['center-panel']}>
                <Link to="/Charts">
                    <h> 차트로 비교 </h>
                </Link>
                
                <Link to="/AverReport">
                    <h> 평균값으로 비교 </h>
                </Link>
            </div>
        );
    }
    // 오른쪽 판넬 섹션 컴포넌트
    function RightPanel() {
        const voiceScore = score(voiceData.SIMILARITY);
        const eyeScore = score(eyedata.reduce((a, b) => a + b) / eyedata.length); // 평균 시야 점수
        const emotionScore = score(emotionData.reduce((a, b) => a + b) / emotionData.length); // 평균 표정 점수

        const [index, setIndex] = useState(data[0].id); //탭 인덱스

        return (
            <div className={styles['right-panel']}>
                <div className={styles['voice-result']}>
                    <p><h3>음성 데이터 결과</h3></p>
                    <br></br>
                    <div>
                        <p>
                            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>목소리 톤:</span> {voiceData.PITCH}
                        </p>
                        <p>
                            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>발음:</span> {voiceData.DICTION}
                        </p>

                    </div>
                </div>
                <div className={styles['gradient-line']}></div>

                <h3 className={styles['radar-title']}>음성 분석</h3>
                <div className={styles['radarchart-container']}>
                    <canvas ref={chartRefVoice} aria-label="음성분석"></canvas>
                </div>
                <div className={styles['gradient-line']}></div>

                <div className={styles['result']}>

                    <div className={styles['result-title']}>
                        <h3>응시자 역량 분석</h3>
                    </div>

                    <section className={styles.tabContainer}>
                        <ul className={styles.tabMenu}>
                            {data.map(item => (
                                <li
                                    key={item.id}
                                    className={index === item.id ? styles.active : null}
                                    onClick={() => setIndex(item.id)}
                                >
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                        {data.filter(item => index === item.id).map(item => (
                            <div key={item.id} className={styles.tabContent}>
                                {item.description}
                            </div>
                        ))}
                    </section>
                    <div className={styles['gradient-line']}></div>
                </div>

            </div>
        );
    }
    // 가운데 판넬 섹션 컴포넌트
    function VideoPanel() {
        const handleSeek = (index, seconds) => {
            // Your seek logic using videoRefs[index]
            videoRefs[index].current.currentTime = seconds;
        };
                return (
            <div className={styles['video-panel']}>
            <h1 >영상 피드백</h1>
            <div className={styles['video']}>
                {videoRefs.map((videoRef, i) => (
                    <div className={styles['video-set']} key={i}>
                        <h2>Video {i + 1}</h2>
                        <div className={styles['video-container']}>
                        <video ref={videoRef} controls width="600" height="400"></video>
                        </div>
                        <button className={styles['video-button']} onClick={() => handleSeek(i, questArray[i+3])}>흔들린 시선으로 이동하기</button>
                    </div>
                ))}
            </div>
            
            </div>
        );
    }
    
    // 밑에 판넬 컴포넌트
    function Footer() {

        return <div className={styles['footer-section']}>
            {

            }
        </div>;
    }
    // JSX 렌더링 부분.
    return (
        <div className={styles['App']}>
            <div className={styles['ReportReport']}>
                <Header />
                <div className={styles['main-section']}>
                    <LeftPanel />
                    <CenterPanel />
                    <RightPanel />
                </div>
                <Footer />
            </div>
            <VideoPanel />
        </div>
    );
}