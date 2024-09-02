import React, {useState} from "react";
import { Link } from "react-router-dom";

const MemberIdFind = () => {

    const [memberName, setMemberName] = useState("");
    const [memberBirth, setMemberBirth] = useState("");
    const [memberPhone, setMemberPhone] = useState("");

    const [change, setChange] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [inputType, setInputType] = useState("none");
    // 정규식 
    const nameRegex = /^[가-힣]{1,6}$|^[a-zA-Z\s\-]{5,15}$/;
    const birthRegex = /^\d{6}-[1-4]$/;
    const phoneRegex = /^(01[016789])[-\s]?\d{3,4}[-\s]?\d{4}$/;


        // 이름 핸들러
        const nameHandleChange = (e) => {
        const value = e.target.value;
        const firstChar = value.charAt(0);
        // 첫 번째 문자에 따라 입력 타입 설정
        if (/^[ㄱ-힇]$/.test(firstChar)) {
            setInputType("korean");
        } else if (/^[a-zA-Z]$/.test(firstChar)) {
            setInputType("english");
        }

        // 입력 타입에 맞게 값 필터링
        if (inputType === "korean" && /^[ㄱ-힣]*$/.test(value)) {
            setMemberName(value);
        } else if (inputType === "english" && /^[a-zA-Z]*$/.test(value)) {
            setMemberName(value);
        } else if (inputType === "none") {
            setMemberName(value);  // 입력 타입이 설정되지 않은 경우에는 입력을 허용합니다.
        }
    };

       // *****************************************전화번호 형식 ********************************************
       const formatPhoneNumber = (value) => {
        const cleanedPhone = value.replace(/\D/g, '');
        
        if (cleanedPhone.length <= 3) {
            return cleanedPhone;
        }
        if (cleanedPhone.length <= 7) {
            return `${cleanedPhone.slice(0, 3)}-${cleanedPhone.slice(3)}`;
        }
        return `${cleanedPhone.slice(0, 3)}-${cleanedPhone.slice(3, 7)}-${cleanedPhone.slice(7, 11)}`;
    };

    // 전화번호 핸들러
    const phoneHandleChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setMemberPhone(formattedPhoneNumber);
    };
    // *******************************************************************************************************

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
}

    const idFind = () => {

       

        // 정규식 이름 생년월일 전화번호 정의
        if (!nameRegex.test(memberName)) {
            alert("이름 형식을 올바르게 입력해주세요.");
            return;
        }
         // 주민번호 정규식 
         if (!birthRegex.test(memberBirth)) {
            alert("생년월일 형식을 올바르게 입력해주세요. (oooooo-o)");
            return;
        }
        // 전화번호 공백 불가
        if(!memberPhone){
            alert("전화번호를 입력해주세요.");
            return;
        }
        // 전화번호 정규식 
        if (!phoneRegex.test(memberPhone)) {
            alert("전화번호를 올바른 형식으로 입력해주세요.");
            return;
        }
        // 이름 공백 불가
        if(!memberName.trim()){
            alert("이름을 입력해주세요.");
            return;
        }
        // 이름 정규식 
        if (!nameRegex.test(memberName)) {
            alert("이름을 올바른 형식으로 입력해주세요.");
            return;
        }


        fetch("/memberId-Find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ memberName, memberBirth, memberPhone })
        })
        .then(response => {
            console.log(response);
            console.log("response : " , response.status);
            if (!response.ok) {
                throw new Error("서버 응답이 실패하였습니다.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // if (data && data.memberId) {
            if (data){
                setUserInfo(data);
                alert("입력하신 정보와 일치하는 아이디를 찾았습니다.");
                setChange(true);
            } else {
                alert("일치하는 정보가 없습니다.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("일치하는 정보가 없습니다.");
        });
    };


    return (
        <div className='grop'>
        {!change ? (
            <div className="title-box">

            <h1>아이디 찾기</h1>
           
            <h6>아이디가 기억나지 않으세요? 원하시는 방법을 선택해 아이디를  확인하실 수 있습니다.</h6>
           
            </div>
        ) : (
        <div>

        <div className='input-value'>
        <h1>아이디 확인</h1>
        </div>
        
        <div className='input-value'>
        <h6>입력하신 정보와 일치하는 아이디는 다음과 같습니다.</h6>
        </div>
        </div>
        )}
        

        {!change ? (
            <div className='login-container'>

            {/*-------------------------------------------------------------------------- 이름 --------------------------------------------------------------------------*/}
        <div className="input-value">
            <input type="text" value={memberName} 
            onChange={nameHandleChange} placeholder="이름을 입력해주세요." required/>
        </div>
        {memberName && (
        <p style={{
                color: nameRegex.test(memberName) ? "green" : "red",
                margin: "0",
                fontSize: "13px"}}>
                {inputType === "korean"
                    ? nameRegex.test(memberName)
                        ? "올바른 형식입니다."
                        : "한글 1 ~ 6 글자 입력해주세요. *) 자음, 모음만 사용할 수 없습니다."
                    : inputType === "english"
                    ? nameRegex.test(memberName)
                        ? "올바른 형식입니다."
                        : "영어 5 ~ 15 글자 입력해주세요."
                    : "언어: 한글 / 영어"}
        </p>
    )}
     {/*---------------------------------------------------------------------------------------------------------------------------------------------------------------*/}

            {/* ******************************************************************** 주민번호 ************************************************************************** */}
            <div>
            <input
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
        </div>
    {/* ****************************************************************************************************************************************************************** */}
            
            {/*----------------------------------------------------------------------------전화번호-----------------------------------------------------------------------------------------*/}
        <div className="input-value">
            <input type="text" value={memberPhone} 
            onChange={phoneHandleChange} 
            placeholder="전화번호를 입력해주세요." required
            />
        </div>
        {memberPhone && (
                <p
                    style={{
                        color: phoneRegex.test(memberPhone) ? "green" : "red",
                        margin: "0",
                        fontSize: "13px"
                    }}
                >
                    {phoneRegex.test(memberPhone)
                        ? "올바른 형식입니다."
                        : "전화번호 010-****-****"}
                </p>
            )}
    {/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
    
            <div className="input-value">
            <button className="btn btn-dark" onClick={idFind}>아이디 찾기</button>
            </div>
              
            </div>
    
        ) : (
            <div>
        <div className='login-container'>
        <h2>{userInfo.memberName} 님의 아이디는 {userInfo.memberId} 입니다.</h2>
        <div className="input-value">
       
        </div>

        <div className="input-value">
        <Link to="/memberLogin"><button className="btn btn-dark">로그인</button></Link>
        </div>

        <div className="input-value">
        <Link to="/passwordFind"><button className="btn btn-dark">비밀번호 찾기</button></Link>
        </div>
        
        </div>
        </div>
        )}
        
        </div>
    )
}

export default MemberIdFind;