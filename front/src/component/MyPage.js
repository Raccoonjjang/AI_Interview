// MyPage.js

import React, { useEffect, useState } from "react";
import styles from "./MyPage.module.css";
import { Link, useNavigate  } from "react-router-dom";

export default function MyPage() {
  const [userData, setUserData] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [pw, setPw] = useState("");
  const navigate = useNavigate ();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    console.log("userId:", userId);
    //const password = e.target.password.value;

    if (userId) {
      fetch(`https://0d6d-220-68-223-111.ngrok-free.app/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      })
        .then((response) => response.json()) // 서버에서 응답 데이터를 JSON 형태로 변환
        .then((data) => {
          console.log("Server response:", data);
          if (data.message === "success") {
            setUserData({
              ...data.userData,
              phoneNumber: maskPhoneNumber(data.userData.phoneNumber),
            });
          } else {
          }
        })
        .catch((error) => {
          console.error("Error sending data to server:", error);
        });
    }
  }, []);

  // 전화번호 가운데 자리를 ****로 변환하는 함수
  const maskPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      // 가운데 4자리를 ****로 변환
      return phoneNumber.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");
    }
    return phoneNumber;
  };

  const handleUpdateClick = () => {
    setModalOpen(true);
  };

  const handlePasswordChange = (e) => {
    setPw(e.target.value);
  };

  const handlePasswordSubmit = () => {
    if (!pw) {
    alert("비밀번호를 입력하세요.");
    return;
  }

  const userId = sessionStorage.getItem("userId");

  if (userId) {
    // Send the password to the server for verification
    fetch(`https://0d6d-220-68-223-111.ngrok-free.app/mypage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id : userId,
        pw : pw,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          // If the passwords match, close the modal and navigate to the edit page
          setModalOpen(false);
          navigate("/mypage/edit");
        } else {
          // If the passwords do not match, show an alert
          alert("비밀번호가 올바르지 않습니다.");
          setPw("");
        }
      })
      .catch((error) => {
        console.error("Error sending data to server:", error);
      });
  }
};

  return (
    <div className={styles.MyPageApp}>
      <div className={styles.MyPage}>
        <div className={styles.MyPageContents}>
          <h1>회원정보</h1>

            <button className={styles.UpdateButton} type="submit" onClick={handleUpdateClick}>
              수정
            </button>


          {/* 모달 */}
          {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>비밀번호 입력</h2>
                <input
                  type="password"
                  value={pw}
                  onChange={handlePasswordChange}
                  placeholder="비밀번호를 입력하세요"
                />
                <button className={styles["button1"]} onClick={handlePasswordSubmit}>확인</button>
                <button className={styles["button1"]} onClick={() => setModalOpen(false)}>취소</button>
              </div>
            </div>
          </div>
        )}

          <div className={styles.MyPage_P}>
            <p>
              <strong>
                민감한 정보보호를 위해 연락처 일부만 확인 가능하며,{" "}
              </strong>
            </p>
            <p>
              <strong>수정화면에서 정확한 연락처 확인이 가능합니다.</strong>
            </p>
            <div className={styles.MyPageElement}>
              {userData ? (
                <div className={styles.MyPageText}>
                  <li>
                    <label>아이디</label>
                    <input
                      defaultValue={userData.id}
                      className={styles.Styled_Input1}
                    />
                  </li>
                  <li>
                    <label>이름</label>
                    <input
                      defaultValue={userData.name}
                      className={styles.Styled_Input2}
                    />
                  </li>
                  <li>
                    <label>휴대폰 번호</label>
                    <input
                      defaultValue={userData.phoneNumber}
                      className={styles.Styled_Input3}
                    />
                  </li>
                  <li>
                    <label>성별</label>
                    <input
                      defaultValue={userData.gender}
                      className={styles.Styled_Input4}
                    />
                  </li>
                </div>
              ) : (
                <p>로딩 중...</p>
              )}
              <div>
                <Link to="/mypage/myps">
                  <button className={styles["ComponentButton"]} type="submit">
                    자기소개서
                  </button>
                </Link>
                {/* <Link to="/mypage/ps2">
                  <button className={styles["ResumeButton"]} type="submit">
                    이력서
                  </button>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}