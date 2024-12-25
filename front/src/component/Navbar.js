import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import LogoImage from '../Asset/Image/Logo.png';

export default function Navbar() {
  https://0d6d-220-68-223-111.ngrok-free.app
  return (
    <div className={styles['White-nav']}>
      <Link to="/">
        <img className={styles.Logo} src={LogoImage} alt="Logo" />
      </Link>
      <div className={styles['Text-nav-container']}>
        <h4>
          <Link to="/login">Login</Link>
        </h4>
        <h4>
          <Link to="/regist">Regist</Link>
        </h4>
      </div>
    </div>
  );
}