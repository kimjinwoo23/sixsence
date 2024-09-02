import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/CustomerObo.css';
import LoginContext from "../login/LoginContext";
import BoardNavBar from './BoardNavBar';

const CustomerObo = () => {
  const { loginMember } = useContext(LoginContext);  // 로그인 정보 가져오기
  const navigate = useNavigate();
  
  // 훅은 컴포넌트의 최상단에서 호출
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberNo, setMemberNo] = useState('');

  const [oboTitle, setOboTitle] = useState('');
  const [oboContent, setOboContent] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  const [movieType, setmovieType] = useState('gangnam');

  // 관리자 권한 확인 (member_no가 1인 경우)
  const isAdmin = loginMember && loginMember.memberNo === 1;

  // 로그인 멤버정보 가져오기
  useEffect(() => {
    if (loginMember) {
      setMemberNo(loginMember.memberNo);
      setMemberName(loginMember.memberName);
      setMemberPhone(loginMember.memberPhone);
      setMemberEmail(loginMember.memberEmail);
    }

    // 관리자인 경우 AdminObo 페이지로 이동시키기!
    if (isAdmin) {
      navigate('/AdminObo');
    }
  }, [loginMember, isAdmin, navigate]);

  // 관리자인 경우 이 컴포넌트는 렌더링되지 않음
  if (isAdmin) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 방지

    const inquiryData = {
      memberNo: memberNo,
      memberName: memberName,
      memberPhone: memberPhone,
      memberEmail: memberEmail,
      oboTitle: oboTitle,
      oboContent: oboContent,
      oboInquiryType: inquiryType,
      oboMovieType: movieType,
      oboAnswer: '',  // 기본값 설정
      oboStatus: 'n', // 기본값 설정
      oboCreateDate: new Date(),  
    };
    console.log("안녕하세요",inquiryData);
    axios.post("/api/submitInquiry", inquiryData)
      .then(response => {
        alert("문의가 제출되었습니다.");
        navigate("/CustomerBoard");
      })
      .catch(error => {
        alert("문의 제출이 실패되었습니다.");
        console.error("에러 발생", error);
      });
  };

  return (
    <div className="obo-container mt-4">
      <BoardNavBar />
      <h2 className="text-center mb-4">1:1 문의</h2>
      <form className="form-horizontal" onSubmit={handleSubmit}>
        {/* 문의 유형 선택 */}
        <div className="form-group row">
          <label htmlFor="inquiryType" className="col-sm-2 col-form-label">문의 유형</label>
          <div className="col-sm-10">
            <select className="form-control" id="inquiryType" value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}>
              <option value="general">일반 문의</option>
              <option value="technical">기술 문의</option>
              <option value="payment">결제 문의</option>
            </select>
          </div>
        </div>

        {/* 영화관 유형 선택 */}
        <div className="form-group row">
          <label htmlFor="movieType" className="col-sm-2 col-form-label">영화관 유형</label>
          <div className="col-sm-10">
            <select className="form-control" id="movieType" value={movieType}
              onChange={(e) => setmovieType(e.target.value)}>
              <option value="gangnam">강남</option>
              <option value="yeoksam">역삼</option>
            </select>
          </div>
        </div>

        {/* 회원 정보 */}
        <div className="form-group row">
          <label htmlFor="userName" className="col-sm-2 col-form-label">이름</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="userName"
              value={memberName} readOnly />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="userPhone" className="col-sm-2 col-form-label">연락처</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="userPhone"
              value={memberPhone} readOnly />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="userEmail" className="col-sm-2 col-form-label">이메일</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="userEmail"
              value={memberEmail} readOnly />
          </div>
        </div>

        {/* 문의 제목과 내용 */}
        <div className="form-group row">
          <label htmlFor="inquiryTitle" className="col-sm-2 col-form-label">제목</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inquiryTitle"
              value={oboTitle} onChange={(e) => setOboTitle(e.target.value)}
              placeholder="제목을 입력하세요" />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inquiryContent" className="col-sm-2 col-form-label">내용</label>
          <div className="col-sm-10">
            <textarea type="text" className="form-control" id="inquiryContent"
              value={oboContent} onChange={(e) => setOboContent(e.target.value)}
              placeholder="내용을 입력하세요" />
          </div>
        </div>

        <div className="col-sm-10 offset-sm-2">
          <button type="submit" className="obo-button">제출하기</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerObo;
