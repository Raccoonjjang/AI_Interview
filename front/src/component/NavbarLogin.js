import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoImage from '../Asset/Image/Logo.png';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const name = sessionStorage.getItem('userId')
    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        window.location.href = '/';
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = (event) => {
        // Check if the clicked area is outside the dropdown
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', closeDropdown);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        };
    }, []);

    return (
        <div className={styles['White-nav']}>
            <Link to="/">
                <img className={styles.Logo} src={LogoImage} alt="Logo" />
            </Link>
            <div className={styles['Text-nav-container']}>
                <h4 onClick={toggleDropdown}>{name} ▼</h4>
                {isDropdownOpen && (
                    <div className={styles['dropdown-menu']} ref={dropdownRef}>
                        <h5><a href="/mypage">My Page</a></h5>
                        <h5><a href="/myaccount">My Account</a></h5>
                        <h5 onClick={handleLogout}>Logout</h5>
                    </div>
                )}
            </div>
        </div>
    );
}