import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MypageCss.css";
import dog from "./images/buyDog.png";
import alpaca from "./images/alpacaIcon.png";
import loadingIcon from "./images/loadingIcon.gif";
import MypageModal from "./MypageModal";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MypageBought = () => {
  const loginMemeber = JSON.parse(localStorage.getItem("loginMember"));

  const [boughtList, setboughtList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [itempayList, setItempayList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelList, setCancelList] = useState('');

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

    getItempayList();
    getMovieList();
    getboughtList();
  }, []);

  const getItempayList = () => {
    axios.get("/getItempayList?memberNo="+loginMemeber.memberNo)
    .then(result => {
        setItempayList(result.data);
    })
  }

  const getMovieList = () => {
    axios.get("/getMovieAll").then((result) => {
      setMovieList(result.data.result);
    });
  };

  const getboughtList = () => {
    setLoading(true);

    axios
      .get("/getMovieList", {
        params: { memberNo: loginMemeber.memberNo }, 
      })
      .then((result) => {
        setboughtList(result.data.result);
        setTimeout(function () {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log("에러 발생 : ", err);
      });
  };

  const boughtFilter = () => {
    const listFilter = boughtList.filter(
      (list) =>
        list.moviepayRefund === "N" &&
        (currentDate > list.moviepayViewdate
          ? true
          : currentDate === list.moviepayViewdate
          ? currentTime > list.moviepayViewtime
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
      axios.put("/cancelItempay?itempayNo=" + input);

      setTimeout(function () {
        getItempayList();
        getboughtList();
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
    <div className="boughtContainer">
      {/* 영화 구매 내역 */}
      <div className="contentContainer">
        <h2>영화 구매 내역</h2>
        {boughtList === null || boughtFilter().length === 0 ? (
          <div className="outBox">
            <div className="inBox">
              <img src={dog} alt="강아지" />
              <p>구매 내역이 존재하지 않습니다.</p>
            </div>
          </div>
        ) : (
          <div className="boughtListBox">
            {boughtFilter().map((listAfter) => (
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
                  <div className="titlediv">
                    <b className="listTitle">
                      {movieList[listAfter.movieNo - 1].movieTitle}
                    </b>
                  </div>
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
                  <b>총 가격 &nbsp;:&nbsp;</b><br/>
                  {listAfter.moviepayAdult * 100 +
                    listAfter.moviepayChild * 100}{" "}
                  원
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 상품 구매 내역 */}
      <div className="contentContainer">
        <h2>상품 구매 내역</h2>
        {itempayList === null || itempayList.length === 0 ? (
          <div className="outBox">
            <div className="inBox">
              <img src={alpaca} alt="알파카" />
              <p>구매 내역이 존재하지 않습니다.</p>
            </div>
          </div>
        ) : (
          <div className="boughtListBox">
            {itempayList.map((item) => (
              <div key={item.itempayNo} className="listBox">
                <div className="area1">
                  <small>영수증번호</small> <br />
                  {item.itempayReceipt} <br />
                  <small>{`(${item.itempayDate})`}</small>
                </div>
                <div className="area2">
                  <img
                    src={item.itemImage}
                    alt="상품이미지"
                  />
                </div>
                <div className="area3">
                  <div className="titlediv">
                    <b className="listTitle">
                      {item.itemName}
                    </b>
                  </div>
                  <b>구매자 &nbsp;:&nbsp;</b> {item.itempayBuyer} <br />
                  <b>이메일 &nbsp;:&nbsp;</b> {item.itempayEmail} <br />
                  <b>수량 &nbsp;:&nbsp;</b> {item.itempayCount}<br />
                </div>
                <div className="area4">
                  <b>총 가격 &nbsp;:&nbsp;</b><br/>{item.itempayPrice * item.itempayCount}{" "}원
                  <button className="mypageBtn" onClick={e => openModal(item.itempayNo)}>구매 취소</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <MypageModal
      modalOpen={modalOpen}
      cancelList={cancelList}
      handleButtonClick={handleButtonClick}
      handleComment={"item"}
      />
    </div>
  );
};

export default MypageBought;
