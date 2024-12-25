const fs = require('fs');
const https = require("https");

const options = {
  key: fs.readFileSync("./config/cert.key"),
  cert: fs.readFileSync("./config/cert.crt"),
};
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const PORT = 4000;
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const iconv = require('iconv-lite');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      //cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
      cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/models', express.static(path.join(__dirname, 'picture')));
function requireLogin(req, res, next) {
  // 예: 사용자가 로그인한 상태인지 확인하는 로직
  if (req.session.userId) { // 혹은 다른 세션 또는 토큰 기반의 로그인 확인 방법
      next(); // 다음 미들웨어로 이동
  } else {
      res.status(401).send('로그인이 필요합니다.'); // 401 Unauthorized 응답
  }
}

app.get('/', (req, res) => {
  res.send("open server!")
});

app.post('/regist', (req, res) => {
  let id = req.body.id;
  let pw = req.body.pw;
  let pwCheck = req.body.pwCheck
  const sendData = { isLogin: "" };
  connection.query('SELECT * FROM MEMBER WHERE id = ?', [id], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
    
    if (error) throw error;
    if (results.length <= 0 && pw == pwCheck) {         // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
      console.log(`Result :`, results);
      const hashedPassword = bcrypt.hashSync(pw, 10);
      let sql = 'INSERT INTO MEMBER VALUES (?, ?, ?, ?, ?)';
      let name = req.body.name;
      let phoneNumber = req.body.phoneNumber;
      let gender = req.body.gender;
      
      let params = [id, hashedPassword, name, phoneNumber, gender];

      connection.query(sql, params, (err, rows, fields) => {
        if (err) {
          console.error('MySQL INSERT Error:', err);
          res.status(500).json({ message: 'failure' }); // Internal Server Error 응답
        } else {
          console.log(`${id} ${pw} 등록 성공`);
          res.json({ isSuccess: true, message: 'success' }); // 수정된 부분
        }
      });
    } else if (pw != pwCheck) {
      sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다.";
      console.log({pw},{pwCheck})
      res.json({ isSuccess: false, message: sendData.isSuccess }); // 수정된 부분
    } else {
      sendData.isSuccess = "이미 존재하는 아이디 입니다!";
      res.json({ isSuccess: false, message: sendData.isSuccess }); // 수정된 부분
    }         
  });
  
});
app.get('/ThreeComponent', (req, res) => {
  res.sendFile(path.join(__dirname, 'models', 'scene.gltf'));
});
app.post('/Charts/:userId', (req, res) => {
  const { userId } = req.body;

  // RegistList 배열에서 id와 pw가 일치하는 회원을 찾습니다.
  connection.query('SELECT * FROM voice WHERE `mem_id` = ? order by desc', [userId], function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      
      console.log(`${userId} 로그인 성공`);
      const userData = results;
      console.log(userData);
      res.json({ message: 'success', userData }); // 추가된 부분
    }});
});
app.post('/login', (req, res) => {
  const { id, pw } = req.body;

  // RegistList 배열에서 id와 pw가 일치하는 회원을 찾습니다.
  connection.query('SELECT * FROM MEMBER WHERE ID = ?', [id], function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      
        bcrypt.compare(pw , results[0].PW, (err, result) => {
          if (result === true) {
            console.log(`${id} ${pw} 로그인 성공`);
            const userData = results[0];
            res.json({ message: 'success', userData }); // 추가된 부분
            console.log(userData);
          } else {
            console.log(`${id} ${pw} 로그인 실패`);
            res.json({ message: 'failure' });
          }
        });
      }
    });
});

app.post('/mypage/edit', (req, res) => {
  const id = req.body.id;
  const pw = req.body.password
  const newpw = req.body.newPassword
  console.log("zz");
  // RegistList 배열에서 id와 pw가 일치하는 회원을 찾습니다.
  connection.query('SELECT * FROM MEMBER WHERE ID = ?', [id], function (error, results, fields) {
    if (error) throw error;
    console.log(results[0].PW)
    if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      
        bcrypt.compare(pw , results[0].PW, (err, result) => {
          if (result === true) {
            console.log(`${id} ${newpw} 비밀번호 변경 성공`);
            const hashedPassword = bcrypt.hashSync(newpw, 10);
            let sql = "UPDATE member SET `PW` = ? WHERE (ID = ?)";
            
            let params = [hashedPassword, id];

            connection.query(sql, params, (err, rows, fields) => {
              if (err) {
                console.error('MySQL INSERT Error:', err);
                res.status(500).json({ message: 'failure' }); // Internal Server Error 응답
              } else {
                console.log(`${id} ${pw} 등록 성공`);
              }
            });
            res.json({ message: 'success', userId: id }); // 추가된 부분
          } else {
            console.log(`${id} ${newpw} 비밀번호 변경 실패`);
            res.json({ message: 'failure' });
          }
        });
      }
    });
});

//#endregion
//#region 질문 코드 -------------------------------------------------------------------


app.post('/defaultquestion/:userId', (req, res) => {
  const id = req.body.userId;
  const qnum = req.body.QuNum;
  const date = req.body.date;
  // RegistList 배열에서 id와 pw가 일치하는 회원을 찾습니다.
  connection.query('SELECT * FROM DEFAULTQUESTION WHERE `mem_id` = ?', [id], function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.
        console.log("----------------------------date----------------------------",date)
        console.log("---------------------------body---------------------------",req.body);
        if (qnum == 1){
          insertDefaultQuestionToQuestion(id, qnum, results, date);          
        }
        connection.query('SELECT QUESTION FROM QUESTION WHERE mem_id = ? AND date_log = ? AND QUESTION_NUMBER = ?', [id,date, qnum], function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.
              console.log("result0----------------------------------------------------------------------------\n\n ", results);
              res.json({ message: 'question', Question: results });
            } else {
              res.json({ message: 'failure'})
            }
          });
      } else {
        res.json({ message: 'failure'})
      }
    })
});

//#endregion 질문코드 -------------------------------------------------------------------
app.post('/Question', async (req, res) => {
  console.log("질문생성기 실행")
  const questScriptpath = 'C:\\Users\\user\\Desktop\\Que_make (2)\\Que_make\\Model_test_file\\Main.py'; 
  
  //const pythonAudio = spawn(pythonExecutable, [questScriptpath, parsedData]);
  const audioPath2 = 'C:\\Users\\user\\Desktop\\Ambient2024-01-16-15-01-09.wav'
  const pythonQuest = spawn(pythonExecutable, [questScriptpath, audioPath2]);
  

  pythonQuest.stdout.on('data', (data) => {
    const Question_data = iconv.decode(data, 'euc-kr');
    test_data = Question_data.toString().trim();
    console.log("파이썬 스폰", userId);
    if (test_data.startsWith('{') && test_data.endsWith('}')) {
          console.log("Json 출력 : ", Question_data);
          const result = JSON.parse(test_data);
          console.log(result.question);
          insertIntoDatabase_Question(userId, filetime, qnum, result.question);
        } else {
          //console.log('비JSON 출력:', Question_data);
        }
  });
          
})
app.post('/log/:userId', (req, res) => {
  console.log("밥은 먹고 다니냐")
  const { userId, questionCount, formattedDate } = req.body;
  console.log(userId,questionCount,formattedDate)
  const filename = `${userId}${formattedDate}`;
  insertIntoDatabase_Log(filename, formattedDate, userId, questionCount);
})

app.post('/Analyze_fetch', upload.single('video'), async (req, res) => {

  let audioResultData = ''; // 변수를 콜백 바깥에서 초기화
  console.log("\n\nAnalyze_fetch 실행 구간");
  const { userId, qnum , filetime} = req.body;
  const test = req.body.qnum;
  console.log(test);
  console.log(userId, filetime, qnum);
  const audioScriptPath = 'C:\\Users\\user\\Desktop\\Model_DIR\\Foder\\Com.py';

  for(let a = 1; a <= qnum; a++){
    console.log(`Analyze_fetch for문 a = ${a}, i = ${qnum}`);
    const videoPath = `C:\\Users\\user\\Desktop\\Pr_R4\\server\\uploads\\${userId}${filetime}${a}.wav`; // 영상 파일 경로를 설정해주세요
    console.log(videoPath);
    const pythonExecutable = 'python'; // 또는 'python3' 등으로 수정

    const pythonAudio = spawn(pythonExecutable, [audioScriptPath, videoPath, "나쁨"]);
    pythonAudio.stdout.on('data', (data) => {
      // audioResultData += data.toString();
      // const audioResultData = iconv.decode(data, 'euc-kr');
      const decodedData = iconv.decode(data, 'euc-kr');
      audioResultData += decodedData.toString(); // 초기화된 변수에 값을 누적
      test_data = audioResultData.toString().trim();
      if (test_data.startsWith('{') && test_data.endsWith('}')) {
        const result = JSON.parse(test_data);
        console.log(`test_data = ${test_data}`);
        insertIntoDatabase_Audio(filetime, result);
        insertIntoDatabase_Answer(userId,filetime,qnum,result.Speach_to_Text)
        } else {
          //console.log('비JSON 출력:', audioResultData);
        }
      });
    pythonAudio.stderr.on('data', (data) => {
      console.error('Audio script error:', data.toString());
    });
  }
  updateIntoDatabase_Checked(userId, filetime)
  console.log("Python 스폰 종료");
});//영상 분석 라우트


app.post('/MakeQuestion', upload.single('video'), async (req, res) => {

  console.log("/MakeQuestion 라우트");
  const videoPath = `C:\\Users\\user\\Desktop\\Pr_R4\\server\\uploads\\${req.file.filename}`;
  const audioPath = `C:\\Users\\user\\Desktop\\Pr_R4\\server\\uploads\\${req.file.filename.replace('.mp4', '.wav')}`; //실제로 사용할 경로

  try{
    const ffmpegCommand = spawn('ffmpeg', ['-i', videoPath, '-vn', '-acodec', 'pcm_s16le',  '-ar', '44100', '-ac', '2', audioPath]);
    ffmpegCommand.stderr.on('data', (data) => {
    });
  }catch{
    ffmpegCommand.on('close', (code) => {
      if (code !== 0) {
        console.error(`FFmpeg failed with code ${code}`);
        return res.status(500).json({ error: 'FFmpeg conversion failed' });
      }
    });
  }

  console.log("질문생성기 실행");
  const pythonExecutable = 'python'; // 또는 'python3' 등으로 수정
  const questScriptpath = 'C:\\Users\\user\\Desktop\\Que_make (2)\\Que_make\\Model_test_file\\Main.py'; 

  const audioPath2 = 'C:\\Users\\user\\Desktop\\test_WAV.wav'; //테스트용
  //console.log(`audioPath2 = ${audioPath2}, audioPath = ${audioPath}`);
  const pythonQuest = spawn(pythonExecutable, [questScriptpath, audioPath2]);
  try{
    pythonQuest.stdout.on('data', (data) => {
      const Question_data = iconv.decode(data, 'euc-kr');
      test_data = Question_data.toString().trim();  
      if (test_data.startsWith('{') && test_data.endsWith('}')) {
        console.log("Json 출력 : ", Question_data);
        const result = JSON.parse(test_data);
        console.log(`가나다라 ${result.question}`);
      }
    });
    pythonQuest.stderr.on('data', (data) => {
      console.error('question script error:', data.toString());
    });
  }
  catch{
    res.status(500).json({ error: 'Can`t make Question' });
  }
}); //질문 생성 라우트

//#endregion

//#endregion
app.post('/MyPs/:userId', (req, res) => {
  const userId = req.body.userId;
  const filePath = path.join(__dirname, 'user_data', `${userId}_MyPs.json`);
  // 파일이 존재하는지 확인
  if (fs.existsSync(filePath)) {
    // 파일 읽기
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const userData = JSON.parse(data);
        res.json({ message: 'success', userData });
      }
    });
  } else {
    // 파일이 없을 경우 404 에러 전송
    res.status(404).send('User data not found');
  }
});
//#region 새로운 w뺑이 MyPs
//서버 My.PS

app.post('/MyPs', (req, res) => {
  const { userId, growth, personality, schoolLife, motivation, grade, department, name } = req.body;

  const filePath = path.join(__dirname, 'user_data', `${userId}_MyPs.json`);
  const dataToSave = { userId, growth, personality, schoolLife, motivation, grade, department, name };
  console.log("MyPs 이거 실행됩니까?")
  fs.writeFile(filePath, JSON.stringify(dataToSave), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.json({ message: 'error' });
    } else {
      const test_dir = 'C:\\Users\\user\\Desktop\\Pr_R4\\server\\user_data\\tesk_MyPs.json';
      const questScriptpath = 'C:\\Users\\user\\Desktop\\Que_make (2)\\Que_make\\Model_test_file\\Main.py'; 
      const pythonProcess = spawn('python', [questScriptpath, test_dir]);
      console.log("stdout 전")

      pythonProcess.stdout.on('data', (data) => {
        console.log("stdout 후")
        const Question_data = iconv.decode(data, 'euc-kr');
        test_data = Question_data.toString().trim();
        if (test_data.startsWith('{') && test_data.endsWith('}')) {
              const result = JSON.parse(test_data);
              insertIntoDatabase_DFQT(userId, result);
            } else {
              console.log('비JSON 출력:', Question_data);
            }
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.json({ message: 'success'});
      });
      console.log('File written successfully');
    }
  });
});//MyPs 

//#endregion

//#region 시작 레코딩

app.post('/startRecording/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userFilePath = path.join(__dirname, 'user_data', `${userId}_MyPs.json`);
  console.log(userFilePath);

  try {
    // 파일 읽기
    // const fileData = await fs.readFile(userFilePath, 'utf-8');
    // const parsedData = JSON.parse(fileData);

    const pythonExecutable = 'python'; // 또는 'python3' 등으로 수정

    const questScriptpath = 'C:\\Users\\user\\Desktop\\Que_make (2)\\Que_make\\Model_test_file\\Main.py';
    const pythonAudio = spawn(pythonExecutable, [questScriptpath, userFilePath]);

    pythonAudio.stdout.on('data', (data) => {        
      const Question_data = iconv.decode(data, 'euc-kr');
      test_data = Question_data.toString().trim();
      console.log("파이썬 스폰", userId);
      if (test_data.startsWith('{') && test_data.endsWith('}')) {
            console.log("Json 출력 : ", Question_data);
            const result = JSON.parse(test_data);        
            console.log(result);
          } else {
            console.log('비JSON 출력:', Question_data);
          }
    });
    res.status(200).send('Recording started successfully.');
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).send('Internal Server Error');
  }
});

//#endregion



//#region DB 코드
function insertIntoDatabase_sibalzz() {
  const logQuery = "INSERT INTO question VALUES (?, ?, ?, ?)";
  const logValues = [
    'tesk',
    '2024-01-23-10-40-02',
    5,
    '다섯번째 질문입니다'
  ];

  connection.query(logQuery, logValues, (err, result) => {
    if (err) {
      console.error('오디오 데이터 삽입 실패:', err);
      // 오류 처리
    } else {
      console.log('오디오 데이터 삽입 성공:', result);
      // 성공 처리
    }
  });


}//Insert Log
function insertIntoDatabase_Log(filename, filetime, userId, qnum) {
  const logQuery = "INSERT INTO log (ID, DATE_LOG, vi_title, question_number) VALUES (?, ?, ?, ?)";
  console.log(userId,filetime,filename,qnum)
  const logValues = [
    userId,
    filetime,
    filename,
    qnum,
  ];

  connection.query(logQuery, logValues, (err, result) => {
    if (err) {
    } else {
    }
  });}//Insert Log

function insertIntoDatabase_Audio(filetime, Audio_Json) {
  const audioQuery = "INSERT INTO voice (mem_id, PITCH, SPEED, DICTION, CONTINUERS, SILENCE, SIMILARITY,date_log) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const audioValues = [
    'Ambient', // 회원 ID (실제 구현에 따라 변경)
    Audio_Json.Pitch_Volatility,
    Audio_Json.Voice_Speed,
    Audio_Json.Prediction,
    Audio_Json.Filler_Count,
    Audio_Json.Silence_Count,
    Audio_Json.Total_Prediction,
    filetime
  ];

  connection.query(audioQuery, audioValues, (err, result) => {
    if (err) {
      console.error('오디오 데이터 삽입 실패:', err);
      // 오류 처리
    } else {
      console.log('오디오 데이터 삽입 성공:', result);
      // 성공 처리
    }
  });


}//Insert Voice
function updateIntoDatabase_Checked(userId, date) {
  const checkQuery = "UPDATE project.log set checked = true where mem_id = ? AND DATE_LOG = ?";
  const checkValues = [
    userId,
    date,
  ];

  connection.query(checkQuery, checkValues, (err, result) => {
    if (err) {
      // 오류 처리
    } else {
      // 성공 처리
    }
  });


}//Insert Checked
function insertIntoDatabase_Vision(filetime, Vision_Json) {

  // 비디오 데이터 저장
  const videoQuery = "INSERT INTO vision (mem_id, s_center, s_right, s_left, blink, happy, sad, surprise, neutral, h_center, h_right, h_left, date_log) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const videoValues = [
    'Ambient', // 회원 ID (실제 구현에 따라 변경)
    Vision_Json.gaze.center,
    Vision_Json.gaze.right,
    Vision_Json.gaze.left,
    Vision_Json.gaze.blink,
    Vision_Json.emotion.Happy,
    Vision_Json.emotion.Sad,
    Vision_Json.emotion.Surprise,
    Vision_Json.emotion.Neutral,
    Vision_Json.lean.lean_center,
    Vision_Json.lean.lean_right,
    Vision_Json.lean.lean_left,
    filetime
  ];

    // 비디오 데이터베이스 삽입
    connection.query(videoQuery, videoValues, (err, result) => {
      if (err) {
        console.error('비디오 데이터 삽입 실패:', err);
        // 오류 처리
      } else {
        console.log('비디오 데이터 삽입 성공:', result);
        // 성공 처리
      }
    });
}//Insert Vision
function insertIntoDatabase_Answer(mem_id,filetime, qnum, text) {
  const audioQuery = "INSERT INTO Answer VALUES (?, ?, ?, ?)";
  const audioValues = [
    mem_id,
    filetime,
    text,
    qnum
  ];

  connection.query(audioQuery, audioValues, (err, result) => {
    if (err) {
      console.error('오디오 데이터 삽입 실패:', err);
      // 오류 처리
    } else {
      console.log('오디오 데이터 삽입 성공:', result);
      // 성공 처리
    }
  });


}//Insert Voice
function insertIntoDatabase_DFQT(userId, results) {
  console.log("insertIntoDatabase_DFQT 시작점");
  const defaultQuestionQuery = "INSERT INTO defaultquestion (mem_id, growth, PERSONALITY, SCHOOLLIFE, MOTIVATION) VALUES (?, ?, ?, ?, ?);";
  const defaultQuestionValues = [
    userId,
    results.growth,
    results.personality,
    results.schoolLife,
    results.motivation,
  ];
  connection.query(defaultQuestionQuery, defaultQuestionValues, (err, result) => {
    if (err) {
      console.error('기본 질문 삽입 실패:', err);
    } else {
      console.log('기본 질문 삽입 성공:', result);
    }
  });
}

function insertIntoDatabase_Question(userId, filetime, qnum, results) {

  let newQnum = parseInt(qnum, 10);
  console.log("insertIntoDatabase_Question 시작점");
  console.log(results)
  const logQuery = "INSERT INTO question (mem_id, DATE_LOG, QUESTION_NUMBER, QUESTION) VALUES (?, ?, ?, ?);";
  console.log("=================================================================================")
  const logValues = [
    userId,
    filetime,
    newQnum+4,
    results    
  ];

  console.log(logValues, '\n\n');

  connection.query(logQuery, logValues, (err, result) => {
    if (err) {
      console.error('기본 질문 삽입 실패:', err);
      // 오류 처리
    } else {
      console.log('기본 질문 삽입 성공:', result);
      // 성공 처리
    }
  });
}//Insert Log

function insertDefaultQuestionToQuestion(id, qnum, results, date){
  // results 배열에서 첫 번째 요소를 사용
  const firstResult = results[0];
  let qnum1 = 0;
  let newQnum = parseInt(qnum1, 10);
  const questions = [
    firstResult.growth,
    firstResult.PERSONALITY,
    firstResult.SCHOOLLIFE,
    firstResult.MOTIVATION,  
  ];
  console.log(newQnum);
  questions.forEach(question => {
    newQnum = newQnum + 1;
    const questionQuery = 'INSERT INTO Question (mem_id, DATE_LOG, QUESTION_NUMBER, QUESTION) VALUES (?, ?, ?, ?)';
    connection.query(questionQuery, [id, date, newQnum, question], (error, results) => {
      if (error) {
        console.error(`질문 '${question}' 삽입 실패:`, error);
      } else {
        console.log(`질문 '${question}' '${newQnum}' ${date} 삽입 성공:`);
        console.log(`질문 '${question}' '${newQnum}' ${date} 삽입 성공:`);
      }
    });
  });
};

//#endregion 거슬려요 DB 코드


app.post('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  // 사용자의 정보를 데이터베이스에서 조회
  connection.query('SELECT id, name, phoneNumber, gender FROM MEMBER WHERE ID = ?', [userId], function (error, results, fields) {
    if (error) {
      console.error('MySQL Query Error:', error);
      res.status(500).json({ message: 'failure' }); // Internal Server Error 응답
    } else {
      if (results.length > 0) {
        const userData = results[0];  
        res.json({ message: 'success', userData });
      } else {
        res.status(404).json({ message: 'User not found' }); // 사용자를 찾을 수 없을 때의 응답
      }
    }
  });
});

app.post('/user1/:userId', (req, res) => {
  const userId = req.params.userId;
  // 사용자의 정보를 데이터베이스에서 조회
  connection.query('SELECT id, name, phoneNumber, gender FROM MEMBER WHERE ID = ?', [userId], function (error, results, fields) {
    if (error) {
      console.error('MySQL Query Error:', error);
      res.status(500).json({ message: 'failure' }); // Internal Server Error 응답
    } else {
      if (results.length > 0) {
        connection.query('select vi_title,DATE_LOG,checked from log where id = ? order by date_log desc;', [userId], function (error, results, fields) {
          if (error) {
            console.error('MySQL Query Error:', error);
            res.status(500).json({ message: 'failure' }); // Internal Server Error 응답
          } else {
              const userData = results;  
              const totalReports = userData.length;

              res.json({ message: 'success', userData, totalReports});
          }});
      } else {
        res.status(404).json({ message: 'User not found' }); // 사용자를 찾을 수 없을 때의 응답
      }
    }
  });
});

app.get('/video', (req, res) => {
  const videoPath = "C:\\Users\\user\\Desktop\\Pr_R4\\server\\uploads\\tesk2024-01-16-09-29-58.mp4"; // 영상 파일 경로를 설정해주세요
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});
app.post('/report', (req, res) => {
  const { userId, videoId } = req.body;
  connection.query('select question_number from log where `id` = ? AND date_log = ?', [userId, videoId], function (error, results, fields){
    if (error) throw error;
    if (results.length > 0){
      
      const qnum = results[0].question_number;
      console.log(qnum);
    connection.query('select name, round(avg(vi.s_center),2) as s_center, round(avg(vi.s_left),2) as s_left, round(avg(vi.s_right),2) as s_right, round(avg(vi.blink),2) as blink, round(avg(vi.happy),2) as happy, round(avg(vi.sad),2) as sad, round(avg(vi.surprise),2) as surprise,round(avg(vi.neutral),2) as neutral,round(avg(vi.h_center),2) as h_center, round(avg(vi.h_right),2) as h_right ,round(avg(vi.h_left),2) as h_left,vo.pitch,round(avg(vo.speed),2) as speed ,vo.diction,round(avg(vo.continuers),2) as continuers, round(avg(vo.silence),2) as silence,round(avg(vo.similarity),2) as similarity, vi.date_log from member m inner join voice vo on m.id = vo.mem_id inner join vision vi on m.id= vi.mem_id where `id` = ? AND vo.date_log = ?'
    , [userId, videoId], function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      
      const userData = results[0];
      console.log(userData)
      res.json({ message: 'success', userData, qnum });
    }
  });
    }
  })
});

app.post('/videoreport', (req, res) => {

  const { userId, value, i } = req.body;
 
  const videoPath = `C:\\0201project\\server\\uploads\\${userId}${value}${i}.mp4`; // 영상 파일 경로를 설정해주세요
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.post('/AverReport', (req, res) => {
  const { userId, date } = req.body;

  // 첫 번째 쿼리
  connection.query(
  'SELECT name, round(avg(vi.s_center),2) as s_center, round(avg(vi.s_left),2) as s_left, round(avg(vi.s_right),2) as s_right, round(avg(vi.blink),2) as blink, round(avg(vi.happy),2) as happy, round(avg(vi.sad),2) as sad, round(avg(vi.surprise),2) as surprise, round(avg(vi.neutral),2) as neutral, round(avg(vi.h_center),2) as h_center, round(avg(vi.h_right),2) as h_right ,round(avg(vi.h_left),2) as h_left, vo.pitch, round(avg(vo.speed),2) as speed, vo.diction, round(avg(vo.continuers),2) as continuers, round(avg(vo.silence),2) as silence, round(avg(vo.similarity),2) as similarity, vi.date_log FROM member m INNER JOIN voice vo ON m.id = vo.mem_id INNER JOIN vision vi ON m.id = vi.mem_id WHERE m.id = ?',
  [userId],
  function (error, results1, fields) {
      if (error) throw error;
      if (results1.length > 0) {
      const userData1 = results1[0];

      // 두 번째 쿼리
      connection.query(
          'SELECT name, round(vi.s_center,2) as s_center, round(vi.s_left,2) as s_left, round(avg(vi.s_right),2) as s_right, round(avg(vi.blink),2) as blink, round(avg(vi.happy),2) as happy, round(avg(vi.sad),2) as sad, round(avg(vi.surprise),2) as surprise, round(avg(vi.neutral),2) as neutral, round(avg(vi.h_center),2) as h_center, round(avg(vi.h_right),2) as h_right ,round(avg(vi.h_left),2) as h_left, vo.pitch, round(avg(vo.speed),2) as speed, vo.diction, round(avg(vo.continuers),2) as continuers, round(avg(vo.silence),2) as silence, round(avg(vo.similarity),2) as similarity, vi.date_log FROM member m INNER JOIN voice vo ON m.id = vo.mem_id INNER JOIN vision vi ON m.id = vi.mem_id WHERE m.id = ? AND vi.date_log = ? AND vo.date_log= ?',
          [userId, '2024-02-06 20:20:20','2024-02-06 20:20:20'],
          function (error, results2, fields) {

          if (error) throw error;
          if (results2.length > 0) {
              const userData2 = results2[0];

              // 두 개의 쿼리 결과를 하나의 객체로 합쳐서 클라이언트에게 응답
              const responseData = {
              message: 'success',
              userData1,
              userData2
              };
              res.json(responseData);
          } else {
              res.json({ message: 'success', userData1, userData2: null });
          }
          }
      );
      } else {
      res.json({ message: 'success', userData1: null, userData2: null });
      }
  }
  );
});

app.get('/privatePage', requireLogin, (req, res) => {
  res.send('이 페이지는 로그인 상태에서만 볼 수 있습니다.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

https.createServer(options, app).listen(5000, () => {
  console.log(`HTTPS server started on port 5000`);
});
//#endregion  