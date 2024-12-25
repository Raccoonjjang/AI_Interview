import styles from "./Interview.module.css";
import InterviewImage1 from "../Asset/Image/InterviewImage1.jpg";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import WebCam from "./WebCam.js";
import PrepareWeb from "./PrepareWeb.js";
export default function Interview() {
  const videoRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const modalBackground = useRef();
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className={styles["InterviewContainer"]}>
      <div className={styles["InterviewHeader"]}>
        <h1>면접 연습</h1>
        <hr className={styles["Separator"]} />
        <div className={styles["ContentContainer"]}>
          <div className={styles["ContentListContainer"]}>
            <ul className={styles["ContentList"]}>
              <li className={styles["FirstItem"]}>
                자신의 면접 실력을 알고싶다면?
              </li>
              <li className={styles["SecondItem"]}>면접 연습</li>
            </ul>
          </div>
          <img
            className={styles["InterviewImage1"]}
            src={InterviewImage1}
            alt="InterviewImage1"
          />
          <div className={styles["Image1Text"]}>
            <li>면접 연습 & AI 분석 기능 제공</li>
            <li>종합 리포트 제공</li>
            <li>자기 소개서를 바탕으로 관련 질문 생성</li>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={styles.InterviewButton}
          >
            면접 시작하기
          </button>
          {showModal && (
            <div
              className={styles.modalContainer}
              ref={modalBackground}
              onClick={(e) => {
                if (e.target === modalBackground.current) {
                  handleCloseModal();
                }
              }}
            >
              <div className={styles.modalContent}>
                <PrepareWeb /> {/* Home.js의 내용을 여기에 포함시킵니다. */}
                {/* <div className={styles.videoContainer}>
                            <video ref={videoRef} autoPlay playsInline />
                            </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles["Last-Container"]}>
          <div className={styles["Last-content"]}>
            <div className={styles["Last-section-about"]}>
              <h2>About Us</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eu dapibus nisi, eu fermentum orci.
              </p>
            </div>
            <div className={styles["Last-section contact"]}>
              <h2>Contact Us</h2>
              <p>Email: info@example.com</p>
              <p>Phone: +123 456 7890</p>
            </div>
          </div>
          <div className={styles["Last-bottom"]}>
            <p>&copy; 2023 Your Website. All rights reserved.</p>
          </div>
      </div>
    </div>
  );
}