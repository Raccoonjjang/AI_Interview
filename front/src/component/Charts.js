import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from 'recharts';

export default function Charts() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
    
        if (userId) {
            fetch(`https://0d6d-220-68-223-111.ngrok-free.app/Charts/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId : "Ambient",
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "success" && data.userData) {
                        console.log(data.userData);
                        const formattedData = data.userData.map(item => ({
                            // date: item.date_log.split("T")[0], // 'YYYY-MM-DD' 형식으로 날짜 포매팅
                            date : parseDateString(item.date_log),
                            speed: item.SPEED,
                            similarity: item.SIMILARITY,
                            continuers: item.CONTINUERS,
                            silence: item.SILENCE, // 오타 수정: 'slience' -> 'silence'
                            diction: item.DICTION,
                            pitch : item.PITCH,
                        }));
                        setChartData(formattedData);
                    } else {
                        console.error("Failed to load chart data");
                    }
                })
                .catch((error) => {
                    console.error("Error sending data to server:", error);
                });
        }
    }, []);

    

function parseDateString(dateString) {
        const date = new Date(dateString);
    
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
        
        const year = parts.find(part => part.type === 'year').value;
        const month = parts.find(part => part.type === 'month').value;
        const day = parts.find(part => part.type === 'day').value;
        const hour = parts.find(part => part.type === 'hour').value;
        const minute = parts.find(part => part.type === 'minute').value;
        const second = parts.find(part => part.type === 'second').value;
        
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

    return (
        <ResponsiveContainer width="100%" height={900}>
            <LineChart
                data={chartData}
                margin={{
                  top: 100, // 상단 여백 증가
                  right: 30, // 우측 여백 증가
                  left: 20, // 좌측 여백 증가
                  bottom: 20 // 하단 여백 증가
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickCount={11} /> {/* 10의 배수로 Y 축의 눈금을 설정 */}
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="speed" stroke="#8884d8" name="속도" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="similarity" stroke="#734720" name="전체 발음 정확도" activeDot={{ r: 8 }}/>
                <Line type="monotone" dataKey="continuers" stroke="#1C23D9" name="전사 횟수" activeDot={{ r: 8 }}/>
                <Line type="monotone" dataKey="silence" stroke="#5A7302" name="침묵 횟수" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="diction" stroke="#04BF7B" name="발음 정확도" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="pitch" stroke="#2A3140" name="높낮이" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

