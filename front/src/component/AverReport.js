//AverReport.js
import styles from './AverReport.module.css';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import kyungji from '../Asset/Image/kyungji.jpg';
import {Flat, Heat, Nested} from '@alptugidin/react-circular-progress-bar'


export default function AverReport() {
    const [AvervoiceData, setAverVoiceData] = useState([10,10,10,10,10,10]);
    const [CurrentvoiceData, setCurrentVoiceData] = useState([10,10,10,10,10,10]);


    const userId = sessionStorage.getItem('userId');
    const [averageValue, setAverageValue] = useState(20);  // 평균값의 기본값으로 초기화
    const [currentValue, setCurrentValue] = useState(50);  // 현재값의 기본값으로 초기화


    const [userName, setUserName] = useState("");

    const [Avereyedata, setAverEyedata] = useState([30, 25, 20, 25]);
    const [AveremotionData, setAverEmotionData] = useState([30, 25, 20, 25]);
    const [AverheadPositionData, setAverHeadPositionData] = useState([30, 25, 20]);

    
    const [Currenteyedata, setCurrentEyedata] = useState([30, 25, 20, 25]);
    const [CurrentemotionData, setCurrentEmotionData] = useState([30, 25, 20, 25]);
    const [CurrentrheadPositionData, setCurrentHeadPositionData] = useState([30, 25, 20]);


    const [isLoading, setIsLoading] = useState(true);

    console.log(userId);

    useEffect(() => {

        const date = sessionStorage.getItem('formattedDate');
        console.log(date)
        // 페이지가 로드될 때 서버에 데이터 요청
        fetch('https://0d6d-220-68-223-111.ngrok-free.app/AverReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                date
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'success') {
                    const userData1 = data.userData1;
                    const userData2 = data.userData2;
            
                    // userData1 및 userData2를 사용한 처리
                    console.log('첫 번째 쿼리 결과:', userData1);
                    console.log('두 번째 쿼리 결과:', userData2);
                    // 쿼리 결과에서 값을 추출하여 상태를 업데이트합니다.
                    setAverageValue(userData1.averageValue);  // 평균 데이터
                    setCurrentValue(userData2.currentValue);  // 현재 데이터

                    //평균 데이터
                    setAverEyedata([data.userData1.s_center, data.userData1.s_left, data.userData1.s_right, data.userData1.blink]);
                    setAverEmotionData([data.userData1.happy, data.userData1.sad, data.userData1.surprise, data.userData1.neutral]);
                    setAverHeadPositionData([data.userData1.h_center, data.userData1.h_left, data.userData1.h_right]);
                    
                    //현재 데이터
                    setCurrentEyedata([data.userData2.s_center, data.userData2.s_left, data.userData2.s_right, data.userData2.blink]);
                    setCurrentEmotionData([data.userData2.happy, data.userData2.sad, data.userData2.surprise, data.userData2.neutral]);
                    setCurrentHeadPositionData([data.userData2.h_center, data.userData2.h_left, data.userData2.h_right]);
                    
                    setUserName(data.userData1.NAME);

                    // 이 부분을 객체로 수정
                    setAverVoiceData([
                        data.userData1.pitch,
                        data.userData1.speed,
                        data.userData1.diction,
                        data.userData1.continuers,
                        data.userData1.silence,
                        data.userData1.similarity
                    ]);

                    setCurrentVoiceData([
                        data.userData2.pitch,
                        data.userData2.speed,
                        data.userData2.diction,
                        data.userData2.continuers,
                        data.userData2.silence,
                        data.userData2.similarity
                    ]);
                    console.log(AvervoiceData);
                    console.log(CurrentvoiceData);
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
    const voiceScore = score(AvervoiceData.SIMILARITY);
    const eyeScore = score(Avereyedata.reduce((a, b) => a + b) / Avereyedata.length); // 평균 시야 점수
    const emotionScore = score(AveremotionData.reduce((a, b) => a + b) / AveremotionData.length); // 평균 표정 점수
    const data = [
        {
            id: 0,
            title: "음성분석 결과",
            description: (
                <div>
                    <p>음성 분석에서 {userName}님은 {AvervoiceData.DICTION} 발음과 {AvervoiceData.SPEED}의 빠르기를 보였습니다.</p>
                    <p> 연속성과 침묵, 유사도 점수는 각각 {AvervoiceData.CONTINUERS}, {AvervoiceData.SILENCE}, {AvervoiceData.SIMILARITY}로 나타났습니다. </p>
                    <p>전반적으로 {voiceScore}인 음성 분석 결과를 보여주었습니다.</p>
                </div>
            ),
        },
        {
            id: 1,
            title: "시야분석 결과",
            description: (
                <div>
                    <p>{userName}님의 시야 분석에서는 중앙, 왼쪽, 오른쪽 시야와 깜빡임 횟수가 각각 {Avereyedata[0]}%, {Avereyedata[1]}%, {Avereyedata[2]}%, {Avereyedata[3]}회로 나타났습니다.</p>
                    <p>이는 {eyeScore}의 집중력과 주의 분산을 나타내는 지표가 될 수 있습니다.</p>
                </div>
            ),
        },
        {
            id: 2,
            title: "표정분석 결과",
            description: (
                <div>
                    <p> 웃음: {AveremotionData[0]}, 슬픔: {AveremotionData[1]}, 놀람: {AveremotionData[2]}, 무표정: {AveremotionData[3]}</p>
                </div>
            ),
        }
    ];



    //--------------------------------------------------------------------------
    // 여기에 각 섹션에 해당하는 컴포넌트를 만듭니다.
    function Header() {
        return (
            <div className={styles['header-section']}>
                <h2>AI 면접 검사 결과(평균)</h2>
            </div>);
    }
    // 왼쪽 판넬 섹션 컴포넌트
    function LeftPanel() {

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
                            <Nested
                                circles={[
                                        { text: '현재' ,value: Currenteyedata[0], color: '#0ea5e9'},
                                        { text: '평균' ,value: Avereyedata[0], color: '#fde047'},
                                        
                                ]}
                                sx={{
                                        bgColor: '#cbd5e1',
                                        fontWeight: 'bolder',
                                    
                                }}
                                />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;중앙</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: Currenteyedata[2], color: '#0ea5e9'},
                                    { text: '평균' ,value: Avereyedata[2], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;오른쪽</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: Currenteyedata[1], color: '#0ea5e9'},
                                    { text: '평균' ,value: Avereyedata[1], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;왼쪽</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: Currenteyedata[3], color: '#0ea5e9'},
                                    { text: '평균' ,value: Avereyedata[3], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;깜빡임</div> {/* Add this line */}
                    </div>
                </div>
                <div>
                            <p>중앙의 평균적인값은 {Avereyedata[0]} 이며, 현재 값은 {Currenteyedata[0]} 입니다.</p>
                            <p>오른쪽의 평균적인값은 {Avereyedata[2]} 이며, 현재 값은 {Currenteyedata[2]} 입니다.</p>
                            <p>왼쪽의 평균적인값은 {Avereyedata[1]} 이며, 현재 값은 {Currenteyedata[1]} 입니다.</p>
                            <p>깜빡임의 평균적인값은 {Avereyedata[3]} 이며, 현재 값은 {Currenteyedata[3]} 입니다.</p>
                </div>
                <div className={styles['gradient-line']}></div>

                <h3 className={styles['circle-title']}>표정분석</h3>
                <div className={styles['charts-flex-container-line']}>
                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentemotionData[0], color: '#0ea5e9'},
                                    { text: '평균' ,value: AveremotionData[0], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;행복</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentemotionData[1], color: '#0ea5e9'},
                                    { text: '평균' ,value: AveremotionData[1], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;슬픔</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentemotionData[2], color: '#0ea5e9'},
                                    { text: '평균' ,value: AveremotionData[2], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;놀라움</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentemotionData[3], color: '#0ea5e9'},
                                    { text: '평균' ,value: AveremotionData[3], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;평범</div> {/* Add this line */}
                    </div>
                </div>
                <div>
                            <p>평균 행복 표정은 {AveremotionData[0]}이고, 현재 값은 {CurrentemotionData[0]}입니다.</p>
                            <p>평균 슬픔 표정은 {AveremotionData[1]}이고, 현재 값은 {CurrentemotionData[1]}입니다.</p>
                            <p>평균 놀라움 표정은 {AveremotionData[2]}이고, 현재 값은 {CurrentemotionData[2]}입니다.</p>
                            <p>평균 무표정은 {AveremotionData[3]}이고, 현재 값은 {CurrentemotionData[3]}입니다.</p>
                </div>
                <div className={styles['gradient-line']}></div>
            </div>
        );
    }
    // 가운데 판넬 섹션 컴포넌트
    function CenterPanel() {
        return (
            <div className={styles['center-panel']}>
            </div>
        );
    }
    // 오른쪽 판넬 섹션 컴포넌트
    function RightPanel() {

        return (
            <div className={styles['right-panel']}>
                                
                <h3 className={styles['circle-title']}>머리위치분석</h3>
                <div className={styles['chart-container']}>
                <div className={styles['charts-flex-container-line']}>
                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentrheadPositionData[0], color: '#0ea5e9'},
                                    { text: '평균' ,value: AverheadPositionData[0], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;중앙</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentrheadPositionData[2], color: '#0ea5e9'},
                                    { text: '평균' ,value: AverheadPositionData[2], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;오른쪽</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentrheadPositionData[1], color: '#0ea5e9'},
                                    { text: '평균' ,value: AverheadPositionData[1], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;왼쪽</div> {/* Add this line */}
                    </div>
                </div>
                </div>
                <div>
                            <p>중앙의 평균 값은 {AverheadPositionData[0]}이고, 현재 값은 {CurrentrheadPositionData[0]}입니다.</p>
                            <p>오른쪽의 평균 값은 {AverheadPositionData[2]}이고, 현재 값은 {CurrentrheadPositionData[2]}입니다.</p>
                            <p>왼쪽의 평균 값은 {AverheadPositionData[1]}이고, 현재 값은 {CurrentrheadPositionData[1]}입니다.</p>
                </div>
                <div className={styles['gradient-line']}></div>
                <br></br>
                <h3 className={styles['circle-title']}>음성 분석</h3>
                <div className={styles['charts-flex-container-line']}>
                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentvoiceData[1], color: '#0ea5e9'},
                                    { text: '평균' ,value: AvervoiceData[1], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;빠르기</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentvoiceData[5], color: '#0ea5e9'},
                                    { text: '평균' ,value: AvervoiceData[5], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;정확도</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentvoiceData[4], color: '#0ea5e9'},
                                    { text: '평균' ,value: AvervoiceData[4], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;침묵횟수</div> {/* Add this line */}
                    </div>

                    <div>
                        <div className={styles['circle-container']}>
                        <Nested
                            circles={[
                                    { text: '현재' ,value: CurrentvoiceData[3], color: '#0ea5e9'},
                                    { text: '평균' ,value: AvervoiceData[3], color: '#fde047'},
                                    
                            ]}
                            sx={{
                                    bgColor: '#cbd5e1',
                                    fontWeight: 'bolder',
                                
                            }}
                            />
                        </div>
                        <div className={styles['circle-label-happy']}>&emsp;&emsp;&emsp;연속성</div> {/* Add this line */}
                    </div>
                </div>
                    <div className={styles['Average_Result']}> 
                        <div>
                            <p>평균 빠르기 값은 {AvervoiceData[1]}이고, 현재 값은 {CurrentvoiceData[1]}입니다.</p>
                            <p>평균 지속성 값은 {AvervoiceData[3]}이고, 현재 값은 {CurrentvoiceData[3]}입니다.</p>
                            <p>평균 침묵 횟수는 {AvervoiceData[4]}이고, 현재 값은 {CurrentvoiceData[4]}입니다.</p>
                            <p>평균 유사도 값은 {AvervoiceData[5]}이고, 현재 값은 {CurrentvoiceData[5]}입니다.</p>
                        </div>
                    
                    </div>
                    <div className={styles['gradient-line']}></div>
                </div>
        );
    }
    
    // 밑에 판넬 컴포넌트
    function Footer() {

        return <div className={styles['footer-section']}>
            {
                <div></div>
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
        </div>
    );
}