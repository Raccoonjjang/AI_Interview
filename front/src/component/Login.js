/* Login.js */

import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Login() {
  const [userData, setUserData] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const id = e.target.id.value;
    console.log(id);
    const pw = e.target.pw.value;

    fetch("https://0d6d-220-68-223-111.ngrok-free.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        pw,
      }),
    })
      .then((response) => response.json()) // 서버에서 응답 데이터를 JSON 형태로 변환
      .then((data) => {
        console.log("Server response:", data);
        if (data.message === "success") {
          setUserData(data.userData);
        } else {
          alert("로그인 실패");
        }
      })
      .catch((error) => {
        console.error("Error sending data to server:", error);
      });
  };

  useEffect(() => {
    if (userData) {
      // userData 상태가 변경될 때만 실행
      sessionStorage.setItem("userId", userData.ID);
      sessionStorage.setItem("userName", userData.NAME);
      alert("로그인 성공");
      window.location.href = "/";
    }
  }, [userData]);

  // 입력 필드 값이 변경될 때마다 상태 업데이트
  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handlePwChange = (e) => {
    setPw(e.target.value);
  };

  // 아이디 또는 비밀번호가 비어있을 때 버튼 비활성화
  const isButtonDisabled = id === "" || pw === "";

  return (
    <div className={styles["LoginApp"]}>
      <div className={styles["LoginPage"]}>
        <div className={styles["LoginContents"]}>
          <h1>로그인</h1>
          <form onSubmit={onSubmitHandler}>
            <div className={styles["TextBox"]}>
              <input
                type="text"
                required
                id="id"
                name="id"
                value={id}
                onChange={handleIdChange}
                placeholder="아이디 입력하세요"
                className={styles["Styled_Input1"]}
              />
            </div>
            <div className={styles["TextBox"]}>
              <input
                type="password"
                required
                id="pw"
                name="pw"
                value={pw}
                onChange={handlePwChange}
                placeholder="비밀번호를 입력하세요"
                className={styles["Styled_Input1"]}
              />
            </div>
            <div>
              <button
                className={styles["LoginButton"]}
                type="submit"
                disabled={isButtonDisabled}
              >
                로그인
              </button>
            </div>
            <p>
              계정이 없으신가요?{" "}
              <Link to="/Regist">
                <button className={styles["RegistButton"]}>회원가입</button>{" "}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}