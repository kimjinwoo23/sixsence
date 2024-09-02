import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import "./css/MainNavbar.css"; // 새로운 스타일 시트
import LoginContext from '../login/LoginContext';
function MainNavbar() {
  const { loginMember, setLoginMember } = useContext(LoginContext);
  const handleLogout = () => {
    setLoginMember(null);
    localStorage.removeItem('loginMember');
  };
  return (
    <div className="main-navbar">
      <header className="nav-header">
        <ul className="nav-links">
          {!loginMember ? (
            <>
              <li><Link to="/memberLogin" className="nav-link special-link">로그인</Link></li>
              <li><Link to="/memberSignUp" className="nav-link special-link">회원가입</Link></li>
            </>
          ) : (
            <div className='main-li-box'>
              <li>환영합니다. {loginMember.memberName}님</li>
              <li><Link to="/" onClick={handleLogout} className="nav-link special-link">로그아웃</Link></li>
              <li><Link to="/mypagemain" className="nav-link special-link">마이페이지</Link></li>
            </div>
          )}
        </ul>
      </header>
      <nav className="main-nav">
        <Link to="/Moviechart" className="nav-link">영화</Link>
        <Link to="/Movieboard-app" className="nav-link">예매</Link>
        <div className="nav-brand">
          <Link to="/" className="nav-link">Sixsence</Link>
        </div>
        <Link to="/store" className="nav-link">스토어</Link>
        <Link to="/CustomerBoard" className="nav-link">고객센터</Link>
      </nav>
    </div>
  );
}
export default MainNavbar;