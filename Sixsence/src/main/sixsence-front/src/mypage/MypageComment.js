import React, { useEffect, useState } from "react";
import "./MypageCss.css";
import axios from "axios";
import loadingIcon from "./images/loadingIcon.gif";
import chicken1 from "./images/chicken1icon.png";
import { FaRegStar, FaStar } from "react-icons/fa";
import MypageModal from "./MypageModal";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MypageComment = () => {
  const loginMemeber = JSON.parse(localStorage.getItem("loginMember"));
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelList, setCancelList] = useState("");

  useEffect(() => {
    getCommentList();
  }, []);

  const getCommentList = () => {
    setLoading(true);

    axios
      .get("/getCommentListMypage", {
        params: { memberNo: loginMemeber.memberNo },
      })
      .then((response) => {
        setCommentList(response.data);
        setTimeout(function () {
          setLoading(false);
        }, 1000);
      });
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
      axios.delete("/deleteCommentMypage", { params: { coid: input } });

      setTimeout(function () {
        getCommentList();
      }, 1000);
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
    <div className="contentMainContainer">
      {commentList === null || commentList.length === 0 ? (
        <div className="outBox">
          <div className="inBox">
            <img src={chicken1} alt="닭1" />
            <p>작성한 한줄평이 없습니다.</p>
          </div>
        </div>
      ) : (
        <div className="contentMainContainer">
          {commentList.map((list) => (
            <div key={list.coid} className="commentBox">
              <div className="area1">
                <img src={`.${list.movieImage}`} />
              </div>
              <div className="area2">
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((value) =>
                    value <= list.score ? (
                      <FaStar key={value} size={30} className="star selected" />
                    ) : (
                      <FaRegStar key={value} size={30} className="star" />
                    )
                  )}
                </div>
                <p>{list.text}</p>
              </div>
              <div className="area3">
                <button
                  className="commentBtn"
                  onClick={(e) => openModal(list.coid)}
                >
                  삭제하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <MypageModal
        modalOpen={modalOpen}
        cancelList={cancelList}
        handleButtonClick={handleButtonClick}
        handleComment={"comment"}
      />
    </div>
  );
};

export default MypageComment;