import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import LoginContext from './LoginContext';
import NaverApi from './NaverApi';
import GoogleLogin from './GoogleLogin';

const Login = () => {
  const { loginMember, setLoginMember } = useContext(LoginContext);
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [saveId, setSaveId] = useState(false); // 아이디 저장 상태 기본값 : false 이벤트 발생시 값이 : true
  const navigate = useNavigate(); // useNavigate 훅 호출
  
  // 페이지 로드 시 저장된 아이디를 불러오기
  useEffect(() => { // 로그아웃이후 오거나 로그인을 클릭해서 오거나 최초실행
                // 아이디 저장(체크박스)을 해제하고 들어왔다면 localStorage.removeItem('savedId');
    const savedId = localStorage.getItem('savedId'); // localStorage에 saveId 넣어주고 
    if (savedId) {  //-> saveId 가 전에 입력한 아이디값 가지고 있음
      setMemberId(savedId); // 인풋에 saveId가 들어가있으면 바로 입력된 상태로 보여진다.
      setSaveId(true);
    }
  }, []);

  // 로그인 버튼
  const loginButton = () => {
    
    fetch("/member-Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ memberId, memberPw })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if(data.loginMember) {
        setLoginMember(data.loginMember);
        console.log('setLoginMember : ' , data.loginMember);
        localStorage.setItem('loginMember', JSON.stringify(data.loginMember));
        
        if (saveId) { // 컨트롤러 들렀다 반환 받을 때 체크박스를 선택하여 save가 true라면 
          localStorage.setItem('savedId', memberId); // localStorage 에 key "saveId"  , value memberId 로 값을 넣어주겠다.
        } else {
          localStorage.removeItem('savedId'); // 체크박스 해제상태라면 saveId(체크박스) 의 상태를 초기화하겠다. false가 되겠지
        }
        navigate('/'); //login redirect

      } else {
        alert('로그인에 실패하셨습니다.');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      alert('로그인 요청 중 오류가 발생했습니다.');
    });
  };

  return (
    <div className="login-container">
      {/* loginMember 값이 null 비로그인 View */}
      {!loginMember && (
        <>
          <div className="title">
            <h1>아이디와 비밀번호를 입력해주세요.</h1>
            <h6>로그인 하시면 다양한 혜택을 받으실 수 있습니다.</h6>
          </div>

          <div className="input-value">
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="아이디를 입력해주세요."
            />
          </div>

          <div className="input-value">
            <input
              type="password"
              value={memberPw}
              onChange={(e) => setMemberPw(e.target.value)}
              placeholder="비밀번호를 입력해주세요."
            />
          </div>

          <div className="input-save">
            <span>
              <input
                type="checkbox"
                checked={saveId} // 기본값 value 처럼 보면 된다.
                onChange={e => setSaveId(e.target.checked)} // 행동이 일어나면 setSaveId 값 넣어줌
              /> 
              <label>아이디 저장</label>
            </span>
          </div>

          <div className="input-value">
            <button onClick={loginButton} className="btn btn-dark">로그인</button>
          </div>

          <div className="input-value">
            <NaverApi />
            
          </div>

          <div className="input-value">
            <GoogleLogin/>
          </div>

          <div className='List'>
            <a href="/memberIdFind">아이디 찾기</a> 
            <p> | </p> 
            <a href="/passwordFind"> 비밀번호 찾기</a> 
            <p> | </p> 
            <a href="/registerCheck"> 회원가입</a>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;