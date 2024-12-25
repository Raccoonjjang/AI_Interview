import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import MainImage from "../Asset/Image/image.png";
import AiImage from "../Asset/Image/ai2.png";
import TailQuestionImage from "../Asset/Image/tail_question2.png";

export default function Home() {

  return (
    <div className={styles["HomeApp"]}>
      <div className={styles["container"]}>
        <div className={styles["background_Maincolor"]}>
          <div className={styles["WebPadding"]}>
            <div className={styles["content"]}>
              <div className={styles["text"]}>
                <h1 className={`${styles["mainfont"]} ${styles["fontsize_50"]} `}>면접평가 AI<br />가장 강력한 솔루션</h1>
                <p className={`${styles["mainfont"]} ${styles["fontsize_25"]} `}>입사에 도움 될 수 있도록<br />맞춤 면접질문 시선분석 음성분석 등<br />서비스를 제공하는 모의면접 AI입니다.</p>
              </div>
              <img className={styles["HomeImage"]} src={AiImage} alt="AI 이미지" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["background_Whitecolor"]}>
          <div className={styles["WebPadding"]}>
            <h1 className={`${styles["mainfont"]} ${styles["fontsize_50"]} `}>강력해진 측정방법</h1>
            <p className={`${styles["mainfont"]} ${styles["fontsize_25"]} `}>자소서에서 작성한 글을 토대로 분석질문! <br />
              다양한 분석 방법을 통해 더욱 나은 솔루션!</p>
            <img className={styles["HomeImage2"]} src={MainImage} alt="MainImage" />
          </div>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["background_Lightgray"]}>
          <div className={styles["WebPadding"]}>
            <h1 className={`${styles["mainfont"]} ${styles["fontsize_50"]} `}>꼬리 질문</h1>
            <p className={`${styles["mainfont"]} ${styles["fontsize_25"]} `}>지원자가 답변한 내용을 이해하고 그에 대한 꼬리 질문을 통해 <br />
              지원자의 역량을 더욱 구체적으로 확인!</p>
            <img className={styles["HomeImage3"]} src={TailQuestionImage} alt="TailQuestionImage" />
          </div>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["background_Whitecolor"]}>
          <div className={styles["WebPadding"]}>
            <h1 className={`${styles["mainfont"]} ${styles["fontsize_50"]} `}>한눈에 보이는 면접결과</h1>
            <p className={`${styles["mainfont"]} ${styles["fontsize_25"]} `}>자신의 면접 역량을 한 눈에! <br />
              면접 피드백으로 자신의 문제점을 파악을 쉽게!</p>
            <img className={styles["HomeImage4"]} src={MainImage} alt="MainImage" />
          </div>
        </div>
      </div>

        <div className={styles["background_Lastapge"]}>
        <h1 className={`${styles["mainfont"]} ${styles["fontsize_50"]} `}>다양한 주제의 질문과 구조화 면접 형식을 통해 <br />
                        문제를 확인 할 수 있도록 영상을 제공해드립니다.</h1>
            <p className={`${styles["mainfont"]} ${styles["fontsize_25"]}  `}>학습된 AI가 지원자의 대변을 분석하여 <br />
                        개인에 맞는 다양한 질문을 제시하며,<br />
                        또한 얼굴표정과 말투 또는 시선처리 등을 분석하여 제공합니다.</p>
      <Link to="/Interview"><button className={styles["button"]}>체험 시작</button></Link>

      </div>
      <footer>
                <div className={styles["footer-content"]}>
                    <div className={styles["footer-section-about"]}>
                        <h2>About Us</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Nullam eu dapibus nisi, eu fermentum orci.
                        </p>
                    </div>
                    <div className={styles["footer-section contact"]}>
                        <h2>Contact Us</h2>
                        <p>Email: info@example.com</p>
                        <p>Phone: +123 456 7890</p>
                    </div>
                </div>
                <div className={styles["footer-bottom"]}>
                    <p>&copy; 2023 Your Website. All rights reserved.</p>~
                </div>
            </footer>
    </div>
  );
}