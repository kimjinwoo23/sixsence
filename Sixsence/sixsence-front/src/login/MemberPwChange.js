import { useNavigate, useLocation  } from "react-router-dom";
import React, {useState} from "react";


const MemberPwChange = () => {

    const location = useLocation();
    const data = location.state?.data;  // 전달된 상태를 가져옵니다.

    const [memberPw, setMemberPw] = useState("");
    const [memberPwCheck, setMemberPwCheck] = useState("");
    const [change, setChange] = useState(false);
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,15}$/;
     // 비밀번호 입력시 <p> 태그 활용하기 위해서 
     const isPasswordValid = passwordRegex.test(memberPw) && passwordRegex.test(memberPwCheck);
     const arePasswordsMatching = memberPw === memberPwCheck;
     const isInputFilled = memberPw && memberPwCheck;
    
    
    
     // 비밀번호 변경 버튼
    const handlePasswordChange = () => {
        
        if (!memberPw || !memberPwCheck) {
            alert("비밀번호를 입력해 주세요.");
            return;
        }
        
        if(memberPw ==! memberPwCheck){
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }                             // location 으로 가져온 data에 data.status 입력하니까 success 나옴 맵을 통해서 ("memberEmail",email)을 로케이션 오기전에 생성하고 보내주니까 되네 ..!!
        console.log("data 정보확인 : " + data.memberEmail, "new password 정보확인 : " + memberPw + " : " + memberPwCheck);
        
        fetch("/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                memberEmail: data.memberEmail,
                memberPw: memberPw,
                memberPwCheck : memberPwCheck
            })
        })
        .then(response => {
            if (!response.ok) {
                // HTTP 응답이 성공적이지 않으면 오류를 발생시킵니다.
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                setChange(true);
            } else {
                alert("비밀번호가 일치하지 않습니다.");
            }
        })
        .catch(error => {
            console.error("Fetch에서 error 발생 :", error);
            alert("비밀번호 변경 중 오류가 발생했습니다. " + error.message);
        });
    }

    return (
        
        <div className='grop'>

        <div className='input-value'>
        <h1>비밀번호 변경</h1>
        </div>
        
        
           
       {!change ? (<div className='login-container'>
        <div className='input-value'> 
        <h6>고객님의 소중한 정보를 보호하기 위하여 새로운 비밀번호로 변경 후 서비스를 이용해 주세요.</h6>
        </div>
        
       {/*************************************************************************** 비밀번호 ********************************************************************************/ }
       <div className="input-value">
            <input type="password" value={memberPw} 
            onChange={e => setMemberPw(e.target.value)} placeholder="비밀번호를 입력해주세요." required/>
        </div>

        <div className="input-value">
            <input type="password" value={memberPwCheck} 
            onChange={e => setMemberPwCheck(e.target.value)} placeholder="비밀번호를 재 입력해주세요." required/>
        </div>
         
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

        <div className="input-value">
        <button className="btn btn-dark" onClick={handlePasswordChange }>비밀번호 변경</button>
        </div>
        
        </div>) : 
        (   
            <div>
                <div className='input-value'> 
                    <h6>고객님의 소중한 정보가 수정되었습니다. 서비스 이용에 감사드립니다.</h6>
                </div>
                
                <div className='input-value'>
                <h2>회원정보가 수정되었습니다.</h2>
                </div>

                <div className="input-value">
                <a href="/"><button className="btn btn-dark">메인으로 돌아가기</button></a>
               
                <a href="/mypageMain"><button className="btn btn-dark">마이페이지 이동</button></a>
                </div>

            </div>
        )}
                

        </div>
    )
}

export default MemberPwChange;