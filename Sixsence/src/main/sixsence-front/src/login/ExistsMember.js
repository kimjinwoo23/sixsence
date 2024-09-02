import LoginContext from './LoginContext';
import React, { useContext } from 'react';
import { Link } from "react-router-dom";


const ExistsMember = () => {

    

    return (
        <div className='grop'>

        <div className='input-value'>
        <h1>회원가입</h1>
        </div>

        <div className='login-container'>

        <div className="input-value">
        <h3>{}님! 이미 회원으로 등록되어 있습니다.</h3>
        </div>

        <div className="input-value">
        <h5>회원아이디({})로 로그인 하시거나 아이디 찾기를 진행해 주세요.</h5>
        </div>

        <div className="input-value">
        <Link to="/member-login"><button className='btn btn-dark'>로그인</button></Link>
        </div>

        <div className="input-value">
        <Link to="/mamberId-find"><button>아이디 찾기</button></Link>
        </div>
          
        </div>

        </div>
    )
}
export default ExistsMember;