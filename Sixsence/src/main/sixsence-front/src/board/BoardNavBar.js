import React, {useContext} from "react";
import {Link,useNavigate} from "react-router-dom";
import '../css/BoardNavBar.css';
import LoginContext from '../login/LoginContext'; // 로그인 정보를 가져오는 컨텍스트

const NavBar = () => {
  //관리자로그인
  const { loginMember } = useContext(LoginContext);  // 로그인 정보 가져오기
  
 
 //관리자가 로그인했을 때 1:1문의 클릭시 관리자페이지로 이동
 
  const navigate = useNavigate();

  
 
  return (
    <div>
      <header className="boardNavi-container">
        <h1>고객센터</h1>
      </header>
    
    <nav className="naven">
     
     <ul className="board-ul">
    {/*<li><Link to="/">Home</Link></li>*/}
    <li className="board-li"><Link to="/customerBoard">공지사항</Link></li>
    <li><Link to="/customerAsked">자주묻는질문</Link></li>
    <li><Link to="/CustomerObo">1:1문의</Link></li>
    <li><Link to="/customerPromise">이용약관</Link></li>
    
    

    </ul> 
    
    </nav>
    </div>
  );
};
export default NavBar;