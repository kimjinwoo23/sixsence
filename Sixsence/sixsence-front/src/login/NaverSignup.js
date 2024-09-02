import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // 버튼 클릭 없이 위치 설정
import LoginContext from './LoginContext';
import { useNavigate } from 'react-router-dom';
import AddressSearch from "./AddressSearch";
import "../css/NaverTable.css";
/* 
useLocation: URL 의 정보를 포함한 객체이다.
             경로, hash, 문자열 값 등을 가지고 온 객체이다.
*/

export function NaverSignup() {
    const [userInfo, setUserInfo] = useState(null);
    /***** 2024-08-12 비밀번호 값 설정 추가 *****/
    const [memberId, setMemberId] = useState("");
    const [memberPw, setMemberPw] = useState("");
    const [memberPwCheck, setMemberPwCheck] = useState("");
    const [memberBirth, setMemberBirth] = useState("");
    const [memberAge, setMemberAge] = useState("");
    const [memberGender, setMemberGender] = useState("");
    const [memberAddress, setMemberAddress] = useState("");

    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const {loginMember} = useContext(LoginContext);

    // 정규식
    const idRegex = /^[a-zA-Z0-9]{8,15}$/ 
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,15}$/;
    const consonantVowelRegex = /^[ㄱ-ㅎㅏ-ㅣ]+$/;  
    const birthRegex = /^\d{6}-[1-4]$/;

    // ID 중복 검사 변수
    const [memberIdValidation, setMemberIdValidation] = useState(false);
    // useNavigate 훅 호출
    const navigate = useNavigate(); 

    // 주소 핸들러
    const handleAddressChange = (address) => {
      setMemberAddress(address);
    };

    // 비밀번호 입력시 <p> 태그 활용하기 위해서 
    const isPasswordValid = passwordRegex.test(memberPw) && passwordRegex.test(memberPwCheck);
    const arePasswordsMatching = memberPw === memberPwCheck;
    const isInputFilled = memberPw && memberPwCheck;


  //---------------------------------------------주민번호 날짜 관련 정규식 부가적인 요소------------------------------------------------
// 날짜 유효성 검사 함수
const isDateValid = (birthDate) => {
  const [datePart, genderPart] = birthDate.split('-');
  
  // 날짜 부분이 올바른지 확인
  if (datePart.length !== 6 || !/^\d{6}$/.test(datePart) || !/^[1-4]$/.test(genderPart)) {
      return false;
  }
  
  // 연도, 월, 일 추출
  const yy = parseInt(datePart.slice(0, 2), 10);
  const mm = parseInt(datePart.slice(2, 4), 10);
  const dd = parseInt(datePart.slice(4, 6), 10);
  
  // YY를 YYYY로 변환
  const year = yy >= 0 && yy <= 99 ? (yy < 30 ? 2000 + yy : 1900 + yy) : yy;
  
  // 월과 일 유효성 검사
  if (mm < 1 || mm > 12) return false; // 월이 1~12 사이인지 확인
  
  // 월에 따라 일자 유효성 검사
  const daysInMonth = new Date(year, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) return false; // 일자가 월의 일수 범위 내인지 확인
  
  return true;
};
// ----------------------------------------------------------------------------------------------------------------------------------------

  //*************************************** 나이 계산 함수 *******************************************
const calculateAge = (birthDate) => {
  const [year, month, day] = [birthDate.slice(0, 4), birthDate.slice(4, 6), birthDate.slice(6, 8)];
  const birthYear = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  return age;
};

// -------------------------------------- 성별 추출 함수 ----------------------------------------------
const getGender = (genderCode) => {
  switch (genderCode) {
      case '1': case '3':
          return 'Male'; // 1900년대 남성 또는 2000년대 남성
      case '2': case '4':
          return 'Female'; // 1900년대 여성 또는 2000년대 여성
      default:
          return 'Unknown';
  }
};
   // 입력값 처리 함수
   const birthHandleChange = (e) => {
      let value = e.target.value;
      
      // 숫자만 허용
      value = value.replace(/[^\d]/g, '');
      
      // 하이픈 추가
      if (value.length > 6) {
          value = value.slice(0, 6) + '-' + value.slice(6, 7);
      }
      
      setMemberBirth(value);
      
      // 주민등록번호가 올바른 형식일 경우에만 나이와 성별 계산
      if (/^\d{6}-[1-4]$/.test(value)) {
          const [datePart, genderPart] = value.split('-');
          const yearPrefix = genderPart === '1' || genderPart === '2' ? '19' : '20';
          const fullDate = yearPrefix + datePart;
          const age = calculateAge(fullDate);
          const gender = getGender(genderPart);
          setMemberAge(age);
          setMemberGender(gender);
      } else {
          setMemberAge('');
          setMemberGender('');
      }
  };

  /* ----------------------------------아이디를 입력했을 때 그 값이 DB에 중복된 값이 없는지 미리 확인하고 true false 반환하여 중복 여부 확인 버튼에서 사용 ---------------------------------------------*/


  const memberIdCheck = (inputId) => {
    // inputId : 현재 입력한 ID 대입
      setMemberId(inputId);
    // 비동기로 아이디 중복 검사 수행
    fetch("/memberIdCheck?id=" + inputId,{
      method:"GET",
      headers : {"content-type":"application/json"},
    }) // url 주소로 이동할 때 inputId 값을 들고 가서 비교하겠다.
    .then(resp => resp.text())
    .then(result => {

      // 중복이 아닐 때 true, 중복이면 false
      if(Number(result) === 0) 
        setMemberIdValidation(true);
      else                     
      setMemberIdValidation(false);
    })
  } 
  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // ****************************************************************** 아이디 중복 검사 버튼 및 아이디 정규식 모음 ************************************************************************
  const duplicationIdCheck = () => { 
    if (!memberId.trim()) {
        alert("아이디를 입력해주세요.");
        return;
    } 
    if (consonantVowelRegex.test(memberId)) {
        alert("올바른 형식으로 입력해주세요.");
        setMemberIdValidation(false);
        return;
    }
    if(memberId.length < 8 || memberId.length > 15){
        alert("올바르지 않은 형식입니다.");
        return;
    }    
    if(memberIdValidation){
        alert("사용 가능한 아이디입니다.");
    } else {
        alert("중복 되는 아이디가 존재합니다.");
        return;
    }
    }
    // *******************************************************************************************************************************************************************************
    
    const MemberSignUpButton = () => {
        
      //아이디가 유효하지 않을 때 
      if(!memberIdValidation){
          alert("아이디 중복 검사를 확인 해주세요. ");
          return;
      }
      // 비밀번호 공백 불가
      if(!memberPw || !memberPwCheck){
          alert("비밀번호를 입력해주세요.");
          return;
      }
      // 비밀번호가 불일치
      if(memberPw !== memberPwCheck){
          alert("비밀번호가 일치하지 않습니다.");
          return;
      }
      // 비밀번호 정규식
      if(!passwordRegex.test(memberPw) || !passwordRegex.test(memberPwCheck)){
          alert("비밀번호를 올바른 형식으로 입력해주세요.");
          return;
      }
      // 주민번호 공백 불가
      if(!memberBirth.trim()){
          alert("생년월일을 입력해주세요.");
          return;
      }
      // 주민번호 정규식 
      if (!birthRegex.test(memberBirth)) {
          alert("생년월일 형식을 올바르게 입력해주세요. (oooooo-o)");
          return;
      }
     
      // **************************************************************   사용자 입력 정보의 집합   ***********************************************************************
      const memberInputInfo = {};
      memberInputInfo.memberId = memberId;
      memberInputInfo.memberPw = memberPw;
      memberInputInfo.memberPwCheck = memberPwCheck;
      memberInputInfo.memberName = userInfo.response.name;
      memberInputInfo.memberAge = memberAge;
      memberInputInfo.memberGender = memberGender;
      memberInputInfo.memberBirth = memberBirth;
      memberInputInfo.memberEmail = userInfo.response.email;
      memberInputInfo.memberAddress = memberAddress;
      memberInputInfo.memberPhone = userInfo.response.mobile;
      /*********************************************************************************************************************************************************************/

      // ****************************************************************** 회원 가입 INPUT 정보 Controller 로 보내는 Fetch ***********************************************************************      
      fetch("/memberSignUp", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(memberInputInfo)
    })
    .then(response => response.text())
    .then(result => {

        if(Number(result) > 0){
            alert("회원 가입이 완료되었습니다.");
            
            setMemberId("")
            setMemberPw("")
            setMemberPwCheck("")
            setMemberBirth("")
            setMemberAddress("")
           
            navigate('/'); 
        } else {
            alert("회원 가입이 실패하였습니다.");
        }
    })
}
// *************************************************************************************************************************************************************************************


    // 어떠한 동작(클릭 등) 이 없어도, UserInfo 페이지에 들어오면 자동으로 실행되는 효과
    useEffect(() => {
        // URLSearchParams: URL 에서 ? 뒤에 붙어있는 Key - Value 값을 가져온다.
        // String redirectUrl = "http://localhost:3000/userinfo?access_token=" + accessToken;
        // userinfo? 뒤에 붙어있는 access_token 에 있는 데이터를 포함한다.
        const a = new URLSearchParams(location.search);
        const accessToken = a.get('access_token');
        console.log("토큰 확인: " + accessToken);
        // URLSearchParams 로 가져온 수 많은 값 중에서, Key 명칭이 access_token 인 값만 가져오겠다는 의미의 코드이다.

        // get 을 이용하여 userinfo 정보 가져오기
        // Java 에서는 userinfo?access_token= 뒤에 + 를 붙여 변수를 사용했지만,
        // JS 에서는 `` 을 사용해서 const accessToken = a.get('access_token');

        // 만약, accessToken 값이 존재하면 axios 를 발동
        if(accessToken){
        axios.get(`/signup/naver?access_token=${accessToken}`)
        .then(response => { // .then((res) => { ◀ (res) 형식으로 ( ) 를 사용하여 res 를 막아버리면, => 이후로는 res 가 선언되지 않은,
            // 즉, 지역변수명이 되기 때문에 res 를 찾을 수 없게 된다.
            setUserInfo(response.data);
            setLoading(false);
        })
        .catch((err) => {
            alert(err, "정보를 정상적으로 가져오지 못했습니다.");
        })
    }

    }, [location.search]); // location.search 로 검색된 Key - Value 값 중, access_token(= 특정 값) 값을 가져오면 useEffect 를 사용하겠다는 의미의 코드이다.

    if(loading) {
        return <div>데이터 정보 가져오는 중...</div>
    }

    return (
        <div class="naver">
            
      <div className="table-naver-wrapper">
      <table className="table-naver">
        <thead>
          <tr>
            <th colSpan="2">회원 정보</th>
          </tr>
        </thead>
        <tbody>
         
          <tr>
            <td className="label-cell">이 메 일:</td>
            <td>
              <input type='email' value={userInfo.response.email} className="input-field" />
            </td>
          </tr>
          <tr>
            <td className="label-cell">닉네임:</td>
            <td>
              <input type='text' value={userInfo.response.nickname}  className="input-field" />
            </td>
          </tr>
          <tr>
            <td className="label-cell">이름:</td>
            <td>
              <input type='text' value={userInfo.response.name}  className="input-field" />
            </td>
          </tr>
         
          <tr>
            <td className="label-cell">프로필 이미지:</td>
            <td>
              <img src={userInfo.response.profile_image} alt="Profile" className="profile-image" />
            </td>
          </tr>
          <tr>
            <td className="label-cell">전화번호:</td>
            <td>
            <input type='text' value={userInfo.response.mobile}  className="input-field" />
            </td>
          </tr>
        </tbody>
      </table>
    </div> 

      <div className="login-naver">
          <h1>회원가입 필수정보</h1>
          {/*-------------------------------------------------------------------------- 아이디 --------------------------------------------------------------------------*/}
        
              <input  type="text" value={memberId} className= {memberIdValidation ? "" : "memberId-error"}  
              onChange={e => {memberIdCheck(e.target.value)}} placeholder="아이디를 입력해주세요." required/>
          
          {memberId && ( 
          idRegex.test(memberId) ? (
              <p style={{ color: "green", margin: "0", fontSize: "13px" }}>
                  올바른 형식입니다.
              </p>
          ) : (
              <p style={{ color: "red", margin: "0", fontSize: "13px" }}>
                  8 ~ 15 자 영문 또는 숫자를 입력해주세요.
              </p>
          )
          )}
        
          <button className="btna btn-dark" onClick={duplicationIdCheck}>아이디 중복 확인</button>
          {/*------------------------------------------------------------------------------------------------------------------------------------------------------------------*/}

          {/*************************************************************************** 비밀번호 ********************************************************************************/ }
          
              <input className='naver-input' type="password" value={memberPw} 
              onChange={e => setMemberPw(e.target.value)} placeholder="비밀번호를 입력해주세요." required/>
          

          
              <input className='naver-input' type="password" value={memberPwCheck} 
              onChange={e => setMemberPwCheck(e.target.value)} placeholder="비밀번호를 재 입력해주세요." required/>
          
          
          {isInputFilled && (
              <>
                  {isPasswordValid && arePasswordsMatching ? (
                      <p style={{ color: "green", margin: "0", fontSize: "13px" }}>비밀번호가 일치합니다.</p>
                  ) : (
                      <>
                          {!arePasswordsMatching && (
                              <p style={{ color: "red", margin: "0", fontSize: "13px" }}>비밀번호가 일치하지 않습니다.</p>
                          )}
                          {!isPasswordValid && (
                              <p style={{ color: "red", margin: "0", fontSize: "13px" }}>
                                  비밀번호는 10 ~ 15 자, 특수문자를 포함해야 합니다.
                              </p>
                          )}
                      </>
                  )}
              </>
          )}
          {/********************************************************************************************************************************************************************/ }


      {/* ******************************************************************** 주민번호 ************************************************************************** */}
              
              <input
                  className='naver-input'
                  type="text"
                  value={memberBirth}
                  onChange={birthHandleChange}
                  placeholder="주민번호 7자리를 입력해주세요 / (-) 자동 생성"
                  required
                  maxLength="8" // 하이픈 포함 최대 8자리
              />
              {memberBirth && (
                  <p style={{ color: (birthRegex.test(memberBirth) && isDateValid(memberBirth)) ? "green" : "red", margin: "0", fontSize: "13px" }}>
                      {birthRegex.test(memberBirth) && isDateValid(memberBirth) ? 
                          `올바른 형식입니다.` : 
                          "형식이 올바르지 않습니다."}
                  </p>
              )}
          
      {/* ****************************************************************************************************************************************************************** */}
              
      
      {/* ********************************************************************** 주소 ************************************************************************** */}

              <AddressSearch onAddressChange={handleAddressChange}/>
        
      {/* ******************************************************************************************************************************************************** */}

              <button type="submit" className="btna btn-dark" onClick={MemberSignUpButton}>회원가입</button>
          
          
          </div>


        </div>
    )
}
export default NaverSignup;