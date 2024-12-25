import React, { useEffect, useState } from 'react';
import styles from './Question.module.css';

const Question = () => {
  const storedValue = sessionStorage.getItem('values');
  
  let [values, setValues] = useState([]);
  const QuNum = sessionStorage.getItem('QuestNum');
  const userId = sessionStorage.getItem('userId');
  if (storedValue && JSON.parse(storedValue).length > 0) {
    values = JSON.parse(sessionStorage.getItem('values'));
  }

  const fetchData = async (userId, QuNum, date) => {
    //const endpoint = QuNum == '1' ? 'defaultquestion' : 'question';
    console.log("가나다라마바사");
    const response = await fetch(`https://0d6d-220-68-223-111.ngrok-free.app/defaultquestion/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        QuNum,
        date
      }),
    });

    const data = await response.json();
    console.log(data.message)
    if (data.message === 'defaultquestion'){
      
      console.log("question 실행")
      setValues(prevValues => [...prevValues, [data.Question[0].QUESTION]]);
      sessionStorage.setItem('values', JSON.stringify(values));

      // 새롭게 추가된 코드(TTS처리)
      let tts_test = data.Question[0].QUESTION;
      const msg = new SpeechSynthesisUtterance(tts_test);
      msg.lang = 'ko-KR';
      msg.rate = 3.0; // 말하는 속도 조절
      window.speechSynthesis.speak(msg);

      console.log(data.Question);
    } else {
      console.error('Error fetching data from server:', data.error);
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const QuNum = sessionStorage.getItem('QuestNum');
    const date = sessionStorage.getItem('formattedDate');
    if (userId) {
      console.log(userId,QuNum,date);
      fetchData(userId, QuNum, date);
    }
  } ,[userId]);

  return (
    <div className={styles.modalContent2}>
    {values.map((value, index) => (
        <div key={index}>
          <p>{value}</p>
        </div>
      ))}
      
    </div>
  );
};

export default Question;