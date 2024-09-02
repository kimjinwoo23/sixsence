import React from 'react';
import Modal from 'react-modal';
import "./MypageCss.css";

const MypageModal = ({ modalOpen, cancelList, handleButtonClick, handleComment }) => {
  const msg = () => {
    switch(handleComment) {
      case 'movie':
        return '예매를 정말 취소하시겠습니까?';
      case 'item':
        return '상품을 정말 취소하시겠습니까?';
      case 'delAccount':
        return '정말 회원 탈퇴하시겠습니까?';
      case 'obo':
        return '정말 삭제하시겠습니까?';
      case 'editMember':
        return '정말 수정하시겠습니까?';
    }
  }

  return (
    <Modal
      isOpen={modalOpen}
      contentLabel="Example Modal" 
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
        },
      }}
    >
      <h2>{msg()}</h2>
      <div className='modalBtn'>
        <button className='mypageModal' onClick={() => handleButtonClick(cancelList)}>확인</button>
        <button className='mypageModal' onClick={() => handleButtonClick("Cancel")}>취소</button>
      </div>
    </Modal>
  );
};

export default MypageModal;