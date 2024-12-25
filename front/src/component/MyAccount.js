/*MyAccount.js*/
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './MyAccount.module.css';


export default function MyAccount() {
  const [userData, setUserData] = useState(null); //사용자 데이터
  const [totalReports, settotalReports] = useState(null); // 총 리포트 개수
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // 검색어
  

  // SearchBar 컴포넌트로부터 받은 검색어 변경 사항을 처리하는 함수
  const handleSearchChange = (newSearchTerm) => {
    setDebouncedSearchTerm(newSearchTerm);
  };

  const handleReset = () => {
    setDebouncedSearchTerm(''); // 검색어 초기화
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log('userId:', userId);

    if (userId && !userData) {
      fetch(`https://0d6d-220-68-223-111.ngrok-free.app/user1/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Server response:", data);
          if (data.message === 'success') {
            console.log("1");
            setUserData(data.userData);
            settotalReports(data.totalReports);
          } else {
            // 처리할 오류가 있을 경우 여기에 추가
          }
        })
        .catch(error => {
          console.error("Error sending data to server:", error);
        });
    }
  }, [userData]);

  //날짜 출력 형식
  function formatDate(dateString) {
    const date = new Date(dateString);
  
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  
    let year = parts.find(part => part.type === 'year').value;
    let month = parts.find(part => part.type === 'month').value;
    let day = parts.find(part => part.type === 'day').value;
    let hour = parts.find(part => part.type === 'hour').value;
    let minute = parts.find(part => part.type === 'minute').value;
    let second = parts.find(part => part.type === 'second').value;

    if (hour === '24') {
      hour = '00';
    }
  
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

    // SearchBar 컴포넌트 정의
    function SearchBar({ onSearchChange,onReset  }) {
      const [searchTerm, setSearchTerm] = useState('');

      const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
      };

      const handleSearchClick = () => {
        onSearchChange(searchTerm);
      };

      const handleResetClick = () => {
        setSearchTerm('');
        onReset();
      };
    


    
      return (
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, display: 'flex', alignItems: 'center' }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-search"
          label="날짜"
          type="search"
          variant="standard"
          size="small"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleSearchClick}>
        검색
        </Button>
        <Button variant="contained" color="secondary" onClick={handleResetClick}>
        초기화
        </Button>
      </Box>
    );
  }

  //UserInfo 
    function UserInfoBox({ userKey, user }) {
    let statusText;
    if (userKey === 'checked') {
      statusText = user[userKey] ? '분석 완료' : '분석 중';
    }
  
    return (
      <div className={styles['Info-Box']}>
        <span className={styles.logo}>
          {userKey === 'DATE_LOG' ? '날짜' : userKey === 'vi_title' ? '제목' : userKey}
        </span>
        {userKey === 'DATE_LOG' ? (
          <Link to={`/Report/${user[userKey]}`}>{formatDate(user[userKey])}</Link>
        ) : (
          <span className={styles.value}>
            {userKey === 'checked' ? statusText : user[userKey]}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={styles['Report-Count']}>
    {totalReports !== null && (
      <p>리포트 총 개수 : {totalReports}개</p>
    )}
    <br></br>
    <div className={styles['Search']}>
      <SearchBar onSearchChange={handleSearchChange} onReset={handleReset} />
    </div> 
    
    <div className={styles['My-Account-Container']}>
      {userData && userData
        .filter(user => debouncedSearchTerm === '' || formatDate(user['DATE_LOG']).startsWith(debouncedSearchTerm))
        .map((user, userIndex) => (
            <div className={styles['User-Info']} key={userIndex}>
              <div className={styles['Info-Section']}>
                {Object.keys(user).map((key, index) => (
                  <UserInfoBox key={index} userKey={key} user={user} />
                ))}
              </div>

                    {user.additionalData && (
                        <div className={styles['info-section']}>
                            {/* 추가 데이터에 대한 스타일링이 필요한 경우 여기에 추가합니다. */}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
}