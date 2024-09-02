import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MypageCss.css";
import crab from "./images/crab.png";
import rabbit from "./images/rabbit.png";
import loadingIcon from "./images/loadingIcon.gif";

const MypageRefund = () => {
    const loginMemeber = JSON.parse(localStorage.getItem("loginMember"));

    const [refundMovieList, setRefundMovieList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movieList, setMovieList] = useState([]);
    const [refundItempayList, setRefundItempayList] = useState([]);

  useEffect(() => {
    getRefundItempayList();
    getMovieList();
    getRefundMovieList();
  }, []);

  const getRefundItempayList = () => {
    axios.get("/getRefundItempayList?memberNo="+loginMemeber.memberNo)
    .then(result => {
        setRefundItempayList(result.data);
    })
  }

  const getMovieList = () => {
    axios.get("/getMovieAll").then((result) => {
      setMovieList(result.data.result);
    });
  };

  const getRefundMovieList = () => {
    setLoading(true);

    axios
      .get("/getRefundMovieList?memberNo="+loginMemeber.memberNo)
      .then((result) => {
        setRefundMovieList(result.data);
        setTimeout(function () {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log("에러 발생 : ", err);
      });
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
      {/* 영화 취소 내역 */}
      <div className="contentContainer">
        <h2>영화 취소 내역</h2>
        {refundMovieList === null || refundMovieList.length === 0 ? (
          <div className="outBox">
            <div className="inBox">
              <img src={rabbit} alt="강아지" />
              <p>구매 내역이 존재하지 않습니다.</p>
            </div>
          </div>
        ) : (
          <div className="boughtListBox">
            {refundMovieList.map((listAfter) => (
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
      {/* 상품 취소 내역 */}
      <div className="contentContainer">
        <h2>상품 취소 내역</h2>
        {refundItempayList === null || refundItempayList.length === 0 ? (
          <div className="outBox">
            <div className="inBox">
              <img src={crab} alt="알파카" />
              <p>구매 내역이 존재하지 않습니다.</p>
            </div>
          </div>
        ) : (
          <div className="boughtListBox">
            {refundItempayList.map((item) => (
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
                  <b>총 가격 &nbsp;:&nbsp;</b>{" "}{item.itempayPrice * item.itempayCount}{" "}원
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MypageRefund;