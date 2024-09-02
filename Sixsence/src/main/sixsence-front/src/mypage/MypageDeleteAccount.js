import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MypageModal from "./MypageModal";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import LoginContext from "../login/LoginContext";
import "./MypageCss.css";

Modal.setAppElement("#root");

const MypageDeleteAccount = () => {
  const loginMem = JSON.parse(localStorage.getItem("loginMember"));
  const [checkPw, setCheckPw] = useState(false);
  const [inputPw, setInputPw] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelList, setCancelList] = useState('');
  const navi = useNavigate();
  const {loginMember, setLoginMember} = useContext(LoginContext);

  const checkPwBtn = () => {
    if (inputPw === loginMem.memberPw) {
      setCheckPw(true);
    } else {
      alert("비밀번호가 일치하지 않습니다.\n다시 입력해주세요.");
      setInputPw("");
    }
  };

  const deleteBtn = (memberNo) => {
    axios.delete('/deleteAccount', {params: {memberNo : memberNo}})
    .then(result => {
        alert("그동안 이용해주셔서 감사합니다.");

        setLoginMember(null);
        localStorage.removeItem("loginMember");
        navi('/');
    })
    .catch(error => {
        alert("회원탈퇴 중 에러가 발생하여 실패하였습니다.");
    })
  };

  const openModal = (cancel) => {
    setModalOpen(true);
    setCancelList(cancel);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleButtonClick = (input) => {
    if (input !== "Cancel") {
      setTimeout(function () {
        deleteBtn(input);
      }, 500);
    }
    closeModal();
  };

  useEffect(() => {}, [checkPw]);

  return (
    <div className="contentMainContainer">
      <div className="outBox">
        <div className="inBox">
          {checkPw === false ? (
            <div className="checkPwBox">
              <p>
                개인 정보를 안전하게 보호하기위해 <br />
                비밀번호를한번 더 입력해주세요.
              </p>
              <input
                type="password"
                value={inputPw}
                placeholder="비밀번호 입력"
                onChange={(e) => setInputPw(e.target.value)}
              />
              <br />
              <button className="checkPwBtn" onClick={checkPwBtn}>
                확인
              </button>
            </div>
          ) : (
            <div className="delContentBox">
              <h5>Sixsence 회원탈퇴 안내사항을 반드시 확인해 주세요.</h5>
              <p>
                1. 회원탈퇴시 처리 내용 <br/>
                (1) 포인트 : 잔여 포인트는 소멸되며 환불되지 않습니다.<br />
                (2) 보유 정보 : 구매 정보는 삭제되지 않습니다. <br /><br />
                2. 회원탈퇴시 게시물 관리 회원탈퇴 후 당사 사이트에 입력하신 게시물<br/>
                및 댓글은 삭제되지 않으며, 회원정보 삭제로 인해 작성자 본인을 확인할<br/>
                수 없으므로 게시물 편집 및 삭제 처리가 원천적으로 불가능합니다.<br/> 
                게시물 삭제를 원하시는 경우에는 먼저 해당 게시물을 삭제하신 후,<br />
                탈퇴를 진행하시기 바랍니다.<br/><br/>
                3. 회원탈퇴 후 재가입규정 탈퇴 회원이 재가입하더라도<br/> 
                기존의 포인트는 이미 소멸되었으므로 현재의 포인트에 양도되지 않습니다.
              </p>
              <button className="delBtn" onClick={e => openModal(loginMem.memberNo)}>
                회원 탈퇴
              </button>
            </div>
          )}
        </div>
      </div>
      <MypageModal
        modalOpen={modalOpen}
        cancelList={cancelList}
        handleButtonClick={handleButtonClick}
        handleComment={"delAccount"}
      />
    </div>
  );
};

export default MypageDeleteAccount;
