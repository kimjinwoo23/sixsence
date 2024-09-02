import React, {useEffect, useState } from "react";
import axios from "axios";
import "./MypageCss.css";
import elephant from "./images/elephant64.png";
import loadingIcon from "./images/loadingIcon.gif";
import MypageModal from "./MypageModal";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MypageReservation = () => {
  const loginMemeber = JSON.parse(localStorage.getItem("loginMember"));

  const [reservationList, setReservationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelList, setCancelList] = useState("");

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formDate = `${year}-${month}-${day}`;
    const formTime = `${hours}:${minutes}:${seconds}`;
    setCurrentDate(formDate);
    setCurrentTime(formTime);

    getReservationList();
    getMovieList();
  }, []);

  const getMovieList = () => {
    axios.get("/getMovieAll").then((result) => {
      setMovieList(result.data.result);
    });
  };

  const getReservationList = () => {
    setLoading(true);

    axios
      .get("/getMovieList", {
        params: { memberNo: loginMemeber.memberNo },
      })
      .then((result) => {
        setReservationList(result.data.result);
        setTimeout(function () {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log("에러 발생 : ", err);
      });
  };

  const reservationFilter = () => {
    const listFilter = reservationList.filter(
      (list) =>
        list.moviepayRefund === "N" &&
        (currentDate < list.moviepayViewdate
          ? true
          : currentDate === list.moviepayViewdate
          ? currentTime < list.moviepayViewtime
            ? true
            : false
          : false)
    );
    return listFilter;
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
      axios.put("/cancelReservation?moviepayNo=" + input.moviepayNo);
      axios.put("/returnPoint", input);

      setTimeout(function () {
        axios
          .get("/getLoginMember", { params: { memberNo: input.memberNo } })
          .then((response) => {
            localStorage.setItem("loginMember", JSON.stringify(response.data));
            window.dispatchEvent(new Event("storageChange"));
          })
          .catch((err) => alert("회원정보 불러오던 중 에러 발생!"));

        getReservationList();
      }, 500);
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
      {reservationList === null || reservationFilter().length === 0 ? (
        <div className="outBox">
          <div className="inBox">
            <img src={elephant} alt="코끼리" />
            <p>예매 내역이 존재하지 않습니다.</p>
          </div>
        </div>
      ) : (
        <div className="reservationListBox">
          {reservationFilter().map((listAfter) => (
            <div key={listAfter.moviepayNo} className="listBox">
              <div className="area1">
                <small>결제번호</small> <br />
                {listAfter.moviepayNo} <br />
                <small>{`(${listAfter.moviepayPaydate})`}</small>
              </div>
              <div className="area2">
                <img
                  src={`.${movieList[listAfter.movieNo - 1].movieImage}`}
                  alt="영화포스터"
                />
              </div>
              <div className="area3">
                <b className="movieTitle">
                  {movieList[listAfter.movieNo - 1].movieTitle}
                </b>{" "}
                <br />
                <b>관람 극장 &nbsp;:&nbsp;</b> Sixsence&nbsp;
                {listAfter.moviepayViewregion}점 <br />
                <b>관람 일자 &nbsp;:&nbsp;</b>{" "}
                {listAfter.moviepayViewdate.replaceAll("-", ".")}&nbsp;
                {listAfter.moviepayViewtime.substring(0, 5)}
                <br />
                <b>관람 좌석 &nbsp;:&nbsp;</b> {listAfter.moviepaySeat}
                <br />
                <b>총 인원수 &nbsp;:&nbsp;</b>{" "}
                {listAfter.moviepayAdult + listAfter.moviepayChild}&nbsp;
                {`(성인 : ${listAfter.moviepayAdult}, 청소년 : ${listAfter.moviepayChild})`}
                <br />
              </div>
              <div className="area4">
                <b>총 가격 &nbsp;:&nbsp;</b>{" "}
                {listAfter.moviepayAdult * 100 + listAfter.moviepayChild * 100}{" "}
                원
                <button
                  className="mypageBtn"
                  onClick={(e) => openModal(listAfter)}
                >
                  예매 취소
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
        handleComment={"movie"}
      />
    </div>
  );
};

export default MypageReservation;
