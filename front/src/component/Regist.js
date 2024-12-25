// Regist.js

import styles from './Regist.module.css'
export default function Regist() {

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const id = e.target.id.value;
        const pw = e.target.pw.value;
        const pwCheck = e.target.pwCheck.value;
        const name = e.target.name.value;
        const phoneNumber = e.target.phoneNumber.value;
        const gender = e.target.gender.value;

        fetch('https://0d6d-220-68-223-111.ngrok-free.app/regist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id, pw, pwCheck, name, phoneNumber, gender
            }),
        })
            .then(response => response.json()) // 서버에서 응답 데이터를 JSON 형태로 변환
            .then(data => {
                console.log("Server response:", data);
                if (data.isSuccess) {
                    alert("회원가입 완료");
                    window.location.href = '/Login';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Error sending data to server:", error);
            });
    };

    return (
        <div className={styles["RegistApp"]}>
            <div className={styles['RegistPage']}>
                <div className={styles['RegistContents']}>
                    <h1>회원가입</h1>
                    <div className={styles['RegistElement']}>
                        <form onSubmit={onSubmitHandler}>
                            <div className={styles["TextBox"]}>
                                <input className={styles['Styled_Input']}
                                    placeholder="가입할 아이디 입력하세요 (영어, 숫자 특수문자)"
                                    type='text'
                                    id='id'
                                    name='id'
                                    minLength={6}
                                    onKeyUp={(e) => {
                                        let val = e.target.value;

                                        // 첫 번째 문자가 영어인지 확인
                                        if (val.length === 1 && !(/[a-zA-Z]/).test(val)) {
                                            e.target.value = '';
                                            return;
                                        }

                                        // 숫자, 영어, 특수 문자만 허용
                                        const pattern = /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/;
                                        if (!pattern.test(val)) {
                                            e.target.value = val.slice(0, -1); // 마지막 문자 제거
                                        }
                                    }}
                                    required
                                />
                            </div >
                            <div className={styles["TextBox"]}>
                                <input className={styles['Styled_Input']}
                                    type='password'
                                    id='pw'
                                    name='pw'
                                    minLength={8}
                                    required
                                    placeholder="비밀번호를 입력하세요 (8자리 이상)"
                                />
                            </div>
                            <div className={styles["TextBox"]}>
                                <input className={styles['Styled_Input']}
                                    type='password'
                                    id='pwCheck'
                                    name='pwCheck'
                                    minLength={8}
                                    required
                                    placeholder="비밀번호를 재입력하세요"
                                />
                            </div>
                            <div className={styles["TextBox"]}>
                                <input className={styles['Styled_Input']}
                                    type='text'
                                    id='name'
                                    name='name'
                                    required
                                    placeholder="성함을 입력하세요"
                                />
                            </div>
                            <div className={styles["TextBox"]}>
                                <input className={styles['Styled_Input']}
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="핸드폰번호를 입력하세요"
                                    pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                                    minLength={14}
                                    maxLength={14}
                                    required
                                    onKeyUp={(e) => {
                                        // 사용자가 숫자나 백스페이스, 딜리트 키를 입력하는 경우에만 실행
                                        if ((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'Delete') {
                                            let val = e.target.value.replace(/-/g, ''); // 기존에 있는 '-' 제거
                                            if (val.length > 3 && val.length <= 7) {
                                                val = `${val.slice(0, 3)}-${val.slice(3)}`;
                                            } else if (val.length > 7) {
                                                val = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
                                            }
                                            e.target.value = val;
                                        }
                                    }}
                                />
                            </div>
                            <div className={styles["Registgender-container"]}>
                                <div className={styles["Registgender-options"]}>
                                    <input
                                        type="radio"
                                        id="male"
                                        name="gender"
                                        value="male"
                                        defaultChecked
                                    />
                                    <label htmlFor="male">남성</label>
                                    <input
                                        type="radio"
                                        id="female"
                                        name="gender"
                                        value="female"
                                    />
                                    <label htmlFor="female">여성</label>
                                </div>
                            </div>

                            <button className={styles['RegistButton']} type="submit">회원가입</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}