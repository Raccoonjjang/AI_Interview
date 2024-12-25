import './App.css';
import Navbar from "./component/Navbar"
import NavbarLogin from "./component/NavbarLogin"
import MyEdit from "./component/MyEdit"
import MyAccount from "./component/MyAccount"
import MyPage from "./component/MyPage"
import Home from "./component/Home"
import Regist from "./component/Regist"
import Login from "./component/Login"
import AverReport from './component/AverReport';
import WebCam from "./component/WebCam"
import Report from "./component/Report"
import Interview from "./component/Interview"
import PrepareWeb from "./component/PrepareWeb"
import MyPs from "./component/MyPs"
import Charts from "./component/Charts"
import { Navigate, BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  const userId = sessionStorage.getItem('userId');

  
  sessionStorage.setItem('userId', 'Ambient');
  const isLoggedIn = !!userId; // userId가 존재하면 로그인 상태로 간주합니다.


  return (
    <BrowserRouter>
      {isLoggedIn ? <NavbarLogin /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />

        {isLoggedIn ? (
          <Route path="/regist" element={<Navigate to="/" />} />
        ) : (
          <Route path="/regist" element={<Regist />} />
        )}

        {isLoggedIn ? (
          <Route path="/Login" element={<Navigate to="/" />} />
        ) : (
          <Route path="/Login" element={<Login />} />
        )}

        {isLoggedIn ? (
          <Route path="/WebCam" element={<WebCam />} />
        ) : (
          <Route path="/WebCam" element={<Navigate to="/Login" />} />
        )}

        {isLoggedIn ? (
          <Route path="/Report" element={<Report />} />
        ) : (
          <Route path="/Report" element={<Navigate to="/Login" />} />
        )}
        {isLoggedIn ? (
          <Route path="/AverReport" element={<AverReport />} />
        ) : (
          <Route path="/AverReport" element={<Navigate to="/Login" />} />
        )}
        {isLoggedIn ? (
          <Route path="/MyPage/MyPs" element={<MyPs />} />
        ) : (
          <Route path="/MyPage/MyPs" element={<Navigate to="/Login" />} />
        )}

        {isLoggedIn ? (
          <Route path="/MyPage/Edit" element={<MyEdit />} />
        ) : (
          <Route path="/MyPage/Edit" element={<Navigate to="/Login" />} />
        )}
        
        {isLoggedIn ? (
          <Route path="/MyPage" element={<MyPage />} />
        ) : (
          <Route path="/MyPage" element={<Navigate to="/Login" />} />
        )}

        {isLoggedIn ? (
          <Route path="/MyAccount" element={<MyAccount />} />
        ) : (
          <Route path="/MyAccount" element={<Navigate to="/Login" />} />
        )}

        {isLoggedIn ? (
          <Route path="/Interview" element={<Interview />} />
        ) : (
          <Route path="/Interview" element={<Navigate to="/Login" />} />
        )}

        {isLoggedIn ? (
          <Route path="/PrepareWeb" element={<PrepareWeb />} />
        ) : (
          <Route path="/PrepareWeb" element={<Navigate to="/Login" />} />
        )}
        {isLoggedIn ? (
          <Route path="/Report/:videoId" element={<Report />} />
        ) : (
          <Route path="/Report/:videoId" element={<Navigate to="/Login" />} />
        )}
        {isLoggedIn ? (
          <Route path="/Charts" element={<Charts />} />
        ) : (
          <Route path="/Charts" element={<Navigate to="/Login" />} />
        )}

      </Routes>
    </BrowserRouter>
  );
}

export default App;