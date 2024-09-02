import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessed, setIsProcessed] = useState(false);
  const [requestData, setRequestData] = useState({});

  const {
    seat = "",
    region = "",
    amount = 0,
    selectedDate = "",
    selectedTime = "",
  } = location.state || {};

  useEffect(() => {
    const processPayment = async () => {
      console.log("Processing payment...");

      if (isProcessed) {
        console.log("Payment already processed.");
        return;
      }

      const payInfo = JSON.parse(localStorage.getItem("payInfo"));
      if (!payInfo) {
        console.error("결제 정보가 존재하지 않습니다.");
        navigate("/");
        return;
      }

      // 날짜를 대한민국 시간대 기준으로 변환 (YYYY-MM-DD)
      const formatViewDate = new Date(
        new Date(payInfo.selectedDate).getTime() -
          new Date(payInfo.selectedDate).getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      // 사용 포인트 계산
      const Pointsheld = Number(payInfo.Pointsheld);
      const usePoints = payInfo.usePoints > 0 ? Number(payInfo.usePoints) : 0;
      const accumulatedPoints = Number(payInfo.accumulatedPoints);

      const remainPoints =
        usePoints > 0
          ? Pointsheld - usePoints
          : Pointsheld + accumulatedPoints;

      const newRequestData = {
        moviepayAdult: payInfo.adultTickets,
        moviepayChild: payInfo.childTickets,
        moviepayAdultpay: payInfo.adultTickets * 100,
        moviepayChildpay: payInfo.childTickets * 100,
        moviepayPrice: payInfo.finalPrice,
        moviepaySeat: payInfo.selectedSeat,
        moviepayPaydate: new Date().toISOString().split("T")[0],
        moviepayPointUse: payInfo.usePoints > 0 ? "Y" : "N",
        moviepayPoint: payInfo.usePoints > 0 ? payInfo.usePoints : 0,
        moviepayViewdate: formatViewDate,
        moviepayViewtime: payInfo.selectedTime,
        movieNo: payInfo.movieNo,
        memberNo: payInfo.memberNo,
        moviepayRefund: "N",
        moviepayViewregion: payInfo.selectedRegion,
        memberGrade: payInfo.memberGrade,
        memberPayCount: payInfo.memberPayCount,
        accumulatedPoints: accumulatedPoints,
        remainPoints: remainPoints,
        movieTitle: payInfo.movieTitle || "정보 없음", // 영화 제목 추가
      };

      setRequestData(newRequestData);

      try {
        // 결제 정보 저장
        const response = await fetch("http://localhost:666/moviepay/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRequestData),
        });

        if (!response.ok) {
          const data = await response.text();
          throw new Error(data || "결제 처리 중 오류 발생");
        }

        // 회원 정보 업데이트
        const paycount = await fetch(
          "http://localhost:666/moviepay/updatepayCount",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              memberNo: payInfo.memberNo,
              remainPoints: remainPoints,
            }),
          }
        );

        if (!paycount.ok) {
          throw new Error("회원 정보 업데이트 실패");
        }

        // 결제 처리 완료 상태 저장
        localStorage.setItem("isConfirmed", "true");
        setIsProcessed(true);

        alert("예매 정보가 성공적으로 저장되었습니다.");

      } catch (error) {
        console.error("DB 저장 중 오류 발생:", error.message);
        alert(`결제가 실패하였습니다: ${error.message}`);
      } finally {
        localStorage.removeItem("payInfo");
      }
    };

    processPayment();
  }, [navigate, isProcessed]);

  return (
    <div style={{ width: "100%", height: "840px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="box_section" style={{ width: "600px", margin: "0 auto" }}>
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="Success"
        />
         <h2>결제를 완료했어요</h2>

         <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${requestData.moviepayPrice?.toLocaleString() || amount.toLocaleString()}원`}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>영화 이름</b>
          </div>
          <div className="p-grid-col text--right" id="movieName">
            {requestData.movieTitle || "정보 없음"} {/* movieTitle을 requestData에서 가져옵니다. */}
          </div>
        </div>
        

         <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>좌석</b>
          </div>
          <div className="p-grid-col text--right" id="seat">
            {requestData.moviepaySeat || seat || "정보 없음"}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>지역</b>
          </div>
          <div className="p-grid-col text--right" id="region">
            {requestData.moviepayViewregion || region || "정보 없음"}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>관람일</b>
          </div>
          <div className="p-grid-col text--right" id="viewDate">
            {requestData.moviepayViewdate || selectedDate || "정보 없음"}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>관람시간</b>
          </div>
          <div className="p-grid-col text--right" id="viewTime">
            {requestData.moviepayViewtime || selectedTime || "정보 없음"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
