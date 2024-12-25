import styles from './MyEdit.module.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MyEdit() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log('userId:', userId);

    if (userId) {
      fetch(`https://0d6d-220-68-223-111.ngrok-free.app/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId
        }),
      })
        .then(response => response.json()) // 서버에서 응답 데이터를 JSON 형태로 변환
        .then(data => {
          console.log("Server response:", data);
          if (data.message === 'success') {
            setUserData(data.userData);
          } else {
          }
        })
        .catch(error => {
          console.error("Error sending data to server:", error);
        });
    }
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const id = userData.id;
    const password = e.target.newPw.value;
    const newPassword = e.target.confirmPw.value;

    fetch('https://0d6d-220-68-223-111.ngrok-free.app/mypage/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        password,
        newPassword
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Server response:", data);
        // 서버 응답에 따른 처리를 추가하세요.
        if (data.message === 'success') {
          alert('비밀번호가 성공적으로 변경되었습니다.');
        } else {
          alert('비밀번호 변경에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error("Error sending data to server:", error);
      });
  };

  const onFocusHandler = (e) => {
    // 플레이스홀더 텍스트 숨기기
    e.target.placeholder = '';
  };

  const onBlurHandler = (e) => {
    // 플레이스홀더 텍스트 다시 표시
    e.target.placeholder = e.target.name === 'newPw' ? '변경할 비밀번호를 입력하세요.' : '동일한 비밀번호를 입력하세요.';
  };

  return (
    <div className={styles['MyEditContainer']}>
      <div className={styles['EditCentered-box']}>
        <div className={styles['EditSmall-box']}>
          <div className={styles['MyEditText']}>
            <p><strong>＊회원정보는 개인정보처리방침에 따라 안전하게 보호되며, 회원님의 동의 없이 공개 또는 제 3 자에게 제공되지 않습니다.</strong></p>
            <p><strong>＊이름, 생년월일, 성별 정보는 본인확인을 통해 변경 할 수 있습니다.</strong></p>
            <p><strong>＊만 15세 미만은 본인인증이 불가합니다.</strong></p>
          </div>
        </div>
        <div>
          <h2 className={styles['MyEdit-h2']}><strong>필수정보</strong></h2>
        </div>
        {userData && (
          <div className={styles['MyEditElement']}>
            <form onSubmit={onSubmitHandler}>
              <ul className={styles['MyEditInputElement']}>
                <li>
                  <div className={styles['input_container']}>
                    <label htmlFor='name'>이름 </label>
                    <input type='text' id='name' name='name' value={userData.name} disabled className={styles['Styled_Input']} />
                  </div>
                </li>
                <li>
                  <div className={styles['input_container']}>
                    <label htmlFor='id'>아이디 </label>
                    <input type='text' id='id' name='id' value={userData.id} disabled className={styles['Styled_Input']} />
                  </div>
                </li>
                <li>
                  <div className={styles['input_container']}>
                    <label htmlFor='newPw'>기존 비밀번호</label>
                    <input type='password' required id='newPw' name='newPw' placeholder='기존 비밀번호를 입력하세요.' onFocus={onFocusHandler} onBlur={onBlurHandler} />
                  </div>
                </li>
                <li>
                  <div className={styles['input_container']}>
                    <label htmlFor='confirmPw'>비밀번호 변경</label>
                    <input type='password' required id='confirmPw' name='confirmPw' placeholder='변경할 비밀번호를 입력하세요.' onFocus={onFocusHandler} onBlur={onBlurHandler} />
                  </div>
                </li>
                <li>
                  <div className={styles['input_container']}>
                    <label htmlFor='phoneNumnber'>전화번호</label>
                    <input type='phoneNumnber' id='phoneNumnber' name='phoneNumnber' value={userData.phoneNumber} disabled className={styles['Styled_Input']} />
                  </div>
                </li>
                <li>
                  <div className={styles['input_container']}>
                    <label htmlFor='gender'>성별</label>
                    <input type='text' id='gender' name='gender' value={userData.gender} disabled className={styles['Styled_Input']} />
                  </div>
                </li>
              </ul>
              <div>
                <Link to="/mypage">
                  <button type="button" className={styles['Cancel-Button']}>취소</button>
                </Link>
                <button type="submit" className={styles['Modify-Complete-Button']}>수정완료</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}