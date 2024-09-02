import React, { useEffect, useState } from "react";
import axios from "axios";
import loadingIcon from "./images/loadingIcon.gif";
import chicken2 from "./images/chicken2icon.png";
import "./MypageCss.css";
import { useNavigate } from "react-router-dom";
import questionIcon from "./images/question.png";
import answerIcon from "./images/answer.png";
import MypageModal from "./MypageModal";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MypageObo = () => {
  const loginMember = JSON.parse(localStorage.getItem("loginMember"));
  const [oboList, setOboList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedObo, setSelectedObo] = useState(null);
  const navi = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelList, setCancelList] = useState("");

  useEffect(() => {
    getOboList();
  }, [selectedObo]);

  const getOboList = () => {
    axios
      .get("/getMemberObo", { params: { memberNo: loginMember.memberNo } })
      .then((response) => {
        setOboList(response.data);
        setTimeout(function () {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        alert(
          "1:1 문의 내역을 불러오던 중 에러가 발생했습니다.\n다시 시도해주세요."
        );
      });
  };

  const registObo = () => {
    navi("/CustomerObo");
  };

  const selectTitle = (obo) => {
    setSelectedObo(obo);
  };

  const goList = () => {
    navi(0);
  };

  const deleteObo = (obo) => {
    axios
      .delete("/deleteObo", { params: { oboNo: obo.oboNo } })
      .then((response) => alert("해당 문의 내역이 삭제되었습니다."))
      .catch((err) => alert("해당 문의 내역 삭제 중 문제가 발생했습니다."));

    setSelectedObo(null);

    setTimeout(function () {
      getOboList();
    }, 500);
  };

  const openModal = (obo) => {
    setModalOpen(true);
    setCancelList(obo);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleButtonClick = (obo) => {
    if (obo !== "Cancel") {
      deleteObo(obo);
    }
    closeModal();
  };

  if (loading) {
    return (
      <div className="contentMainContainer">
        <div className="outBox">
          <div className="inBox">
            <img src={loadingIcon} alt="로딩" />
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {selectedObo ? (
        <div className="contentMainContainer">
          <div className="oboDetailMainContainer">
            <div className="oboDetailheader">
              <p>
                {selectedObo.oboInquiryType === "general"
                  ? "일반"
                  : selectedObo.oboInquiryType === "technical"
                  ? "기술"
                  : "결제"}{" "}
                | {selectedObo.oboMovieType === "gangnam" ? "강남점" : "역삼점"}
              </p>
            </div>
            <div className="oboDetailBody">
              <div className="oboDetailBodyMain">
                <div className="oboDetailBodyTitle">
                  <img src={questionIcon} alt="질문" />
                  {selectedObo.oboTitle}
                </div>
                <div className="oboDetailBodyContent">
                  <pre>{selectedObo.oboContent}</pre>
                </div>
              </div>
              <div className="oboDetailBodySub">
                <div className="oboDetailBodyDate">
                  {selectedObo.oboCreateDate.replaceAll("-", ".")}
                </div>
                <div className="oboDetailBodyStatus">
                  <p>
                    {selectedObo.oboStatus === "n" ? "답변 대기중" : "답변완료"}
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div className="oboDetailAnswer">
              <div className="oboDetailAnswerImg">
                <img src={answerIcon} alt="답변" />
              </div>
              <div className="oboDetailAnswerText">
                <pre>
                  {selectedObo.oboAnswer
                    ? `${selectedObo.oboAnswer}`
                    : "현재 답변 대기 중인 상태이며,\n답변이 완료되면 상태가 답변 대기중에서 답변 완료로 변경되니 참고 부탁드립니다."}
                </pre>
              </div>
            </div>
          </div>
          <div className="oboDetailBtnBox">
            <button onClick={goList} className="oboBtn1">
              목록으로
            </button>
            <button onClick={(e) => openModal(selectedObo)}>삭제하기</button>
          </div>
        </div>
      ) : (
        <div className="contentMainContainer">
          {oboList === null || oboList.length === 0 ? (
            <div className="outBox">
              <div className="inBox">
                <img className="oboImg" src={chicken2} alt="닭2" />
                <p>1:1 문의 내역이 존재하지 않습니다.</p>
              </div>
            </div>
          ) : (
            <div className="oboListbox">
              <div className="oboCategory">
                <hr />
                <div className="oboCategoryBox">
                  <div className="oboCol1">
                    <b>
                      <p>번호</p>
                    </b>
                  </div>
                  <div className="oboCol2">
                    <b>
                      <p>유형</p>
                    </b>
                  </div>
                  <div className="oboCol3">
                    <b>
                      <p>영화관</p>
                    </b>
                  </div>
                  <div className="oboCol4Title">
                    <b>
                      <p>제목</p>
                    </b>
                  </div>
                  <div className="oboCol5">
                    <b>
                      <p>작성일</p>
                    </b>
                  </div>
                  <div className="oboCol6">
                    <b>
                      <p>상태</p>
                    </b>
                  </div>
                </div>
                <hr />
              </div>
              {oboList.map((list, index) => (
                <div key={list.oboNo}>
                  <div className="listBox">
                    <div className="oboCol1">{oboList.length - index}</div>
                    <div className="oboCol2">
                      {list.oboInquiryType === "general"
                        ? "일반"
                        : list.oboInquiryType === "technical"
                        ? "기술"
                        : "결제"}
                    </div>
                    <div className="oboCol3">
                      {list.oboMovieType === "gangnam" ? "강남점" : "역삼점"}
                    </div>
                    <div className="oboCol4" onClick={(e) => selectTitle(list)}>
                      {list.oboTitle}
                    </div>
                    <div className="oboCol5">
                      {list.oboCreateDate.replaceAll("-", ".")}
                    </div>
                    <div className="oboCol6">
                      {list.oboStatus === "n" ? "답변 대기중" : "답변완료"}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
          <button className="oboBtn" onClick={registObo}>
            문의 등록
          </button>
        </div>
      )}
      <MypageModal
        modalOpen={modalOpen}
        cancelList={cancelList}
        handleButtonClick={handleButtonClick}
        handleComment={"obo"}
      />
    </div>
  );
};

export default MypageObo;
