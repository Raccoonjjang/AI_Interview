//MyPs.js


import React, { useEffect, useState } from 'react';
import styles from './MyPs.module.css';

export default function MyPs() {
  const [userData, setUserData] = useState(null);
  const [growth, setGrowth] = useState('');
  const [personality, setPersonality] = useState('');
  const [schoolLife, setSchoolLife] = useState('');
  const [motivation, setMotivation] = useState('');
  const [grade, setGrade] = useState('');
  const [department, setDepartment] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      fetch(`https://0d6d-220-68-223-111.ngrok-free.app/MyPs/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Server response:", data);
          if (data.message === 'success') {
            
            setUserData(data.userData);
            // 가져온 데이터로 입력 폼 채우기
            setGrowth(data.userData.growth || '');
            setPersonality(data.userData.personality || '');
            setSchoolLife(data.userData.schoolLife || '');
            setMotivation(data.userData.motivation || '');
            setGrade(data.userData.grade || '');
            setDepartment(data.userData.department || '');
            setName(data.userData.name || '');
            
            console.log("성장과정",growth)
          } else {
            // 에러 처리
          }
        })
        .catch(error => {
          console.error("Error sending data to server:", error);
        });
    }
  }, []);
  const onSubmitHandler = (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem('userId');
    const requestBody = {
        userId,
        growth,
        personality,
        schoolLife,
        motivation,
        grade,
        department,
        name,
    };
    console.log(requestBody);
    
    setTimeout(() => {
        alert("저장 성공");
        window.location.href = '/';
    }, 20000); // 20초를 밀리초 단위로 표현합니다.
    // fetch('https://0d6d-220-68-223-111.ngrok-free.app/MyPs', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }, 
    //   body: JSON.stringify(requestBody)
    // }).then(response => response.json())
    //   .then(data => {
    //     console.log("Server response:", data);
    //     if (data.message === 'success') {
    //       console.log(data.userData)
    //       const grow = data.userData;
    //       alert("저장 성공",grow);
    //       window.location.href = '/';
    //     } else {
    //       alert("저장 실패");
    //     }
    //   })
    //   .catch(error => {
    //     console.error("Error sending data to server:", error);
    //   });
  };

  return (
    <div className={styles.App}>
      <div className={styles.PsContents}>
        <h1>자기소개서</h1>
        <div className={styles.Element}>
          <form onSubmit={onSubmitHandler}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>학년</div>
            <input className={styles.input_Box} type='text' required id='grade' name='grade' value={grade} onChange={(e) => setGrade(e.target.value)}/>
            <div>학과</div>
            <input className={styles.input_Box} type='text' required id='department' name='department' value={department} onChange={(e) => setDepartment(e.target.value)}/>
            <div>이름</div>
            <input className={styles.input_Box} type='text' required id='name' name='name' value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
            <ul className={styles.InputElement}>
              <li>
                <div className={styles.labelBox}>성장과정</div>
                <textarea className={styles.textareaBox} required id='growth' name='growth' value={growth} onChange={(e) => setGrowth(e.target.value)} />
              </li>
              <li>
                <div className={styles.labelBox}>성격의 장단점</div>
                <textarea className={styles.textareaBox} required id='personality' name='personality' value={personality} onChange={(e) => setPersonality(e.target.value)} />
              </li>
              <li>
                <div className={styles.labelBox}>학교 생활</div>
                <textarea className={styles.textareaBox} required id='schoolLife' name='schoolLife' value={schoolLife} onChange={(e) => setSchoolLife(e.target.value)} />
              </li>
              <li>
                <div className={styles.labelBox}>지원 동기 및 입사 후 포부</div>
                <textarea className={styles.textareaBox} required id='motivation' name='motivation' value={motivation} onChange={(e) => setMotivation(e.target.value)} />
              </li>
            </ul>
            <div>
              <button className={styles.SaveButton} type="submit" disabled={!growth || !personality || !schoolLife || !motivation || !grade || !department || !name}>저장하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}