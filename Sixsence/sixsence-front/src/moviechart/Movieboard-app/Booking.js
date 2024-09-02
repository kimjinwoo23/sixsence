import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import LoginContext from "../../login/LoginContext";
import "./Booking.css";

const Booking = () => {
  const { loginMember, setLoginMember } = useContext(LoginContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("movieId");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [tempSelectedSeats, setTempSelectedSeats] = useState([]);
  const [selectedandSeat, setSelectedandSeat] = useState([]);
  const [numPeople, setNumPeople] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [adultTickets, setAdultTickets] = useState(null);
  const [childTickets, setChildTickets] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(0);
  const [usingPoints, setUsingPoints] = useState(false);
  const [userPoints, setUserPoints] = useState("0");
  const navigate = useNavigate();
  const Pointsheld = loginMember ? loginMember.memberPoint : 0;
  const [movieNo, setMovieNo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginin, setLoginIn] = useState(false);

  // 로그인 상태를 확인하여 loginin 설정
  useEffect(() => {
    if (loginMember && loginMember.memberNo) {
      setLoginIn(true);  // 로그인 되어 있는 경우
    } else {
      setLoginIn(false); // 로그인 되어 있지 않은 경우
    }
  }, [loginMember]);

  const openModal = () => {
    setTempSelectedSeats([...selectedSeat]);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const movieTitle = selectedMovie ? selectedMovie.movieTitle : "영화 제목 없음";

  const MTDate = new Date();
  const MTHours = MTDate.getHours();
  const MTMinutes = MTDate.getMinutes();

  const isTimePassed = (hour, minute) => {
    if (!selectedDate) return false;
    if (
      selectedDate.getFullYear() === MTDate.getFullYear() &&
      selectedDate.getMonth() === MTDate.getMonth() &&
      selectedDate.getDate() === MTDate.getDate()
    ) {
      return hour < MTHours || (hour === MTHours && minute < MTMinutes);
    }
    return false;
  };

  const handleTimeChange = (time) => {
    if (selectedDate) {
      const [hour, minute, second] = time.split(":").map(Number);
      if (isTimePassed(hour, minute)) {
        alert("이미 지난 시간은 선택할 수 없습니다.");
        return;
      }
    }
    setSelectedTime((prevTime) => (prevTime === time ? null : time));
  };

  const handleSeatClick = (seat) => {
    if (tempSelectedSeats.includes(seat)) {
      setTempSelectedSeats(tempSelectedSeats.filter((s) => s !== seat));
    } else if (tempSelectedSeats.length < adultTickets + childTickets) {
      setTempSelectedSeats([...tempSelectedSeats, seat]);
    }
  };

  const confirmSeatSelection = () => {
    setSelectedSeat(tempSelectedSeats);
    closeModal();
  };

  const resetbutton = () => {
    setSelectedMovie(null);
    setSelectedRegion(null);
    setSelectedSeat([]);
    setSelectedTime(null);
    setSelectedDate(new Date());
    setNumPeople(1);
    setAdultTickets(0);
    setChildTickets(0);
    setUsePoints(0);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setMovieNo(movie.movieNo);
    setSelectedTime(null);
  };

  const getPosterPath = (movie) => {
    return `${process.env.PUBLIC_URL}${movie.movieImage.replace("./", "/")}`;
  };

  const PointUseTotalPrice = () => {
    const totalPrice = adultTickets * 100 + childTickets * 100;
    const finalPrice = usingPoints ? totalPrice - usePoints : totalPrice;
    return finalPrice > 0 ? finalPrice : 0;
  };

  const UsePoints = () => {
    setUsingPoints(!usingPoints);
    if (!usingPoints) {
      setUsePoints(0);
    }
  };

  const UsePointChange = (e) => {
    const value = parseInt(e.target.value);
    const totalPrice = adultTickets * 100 + childTickets * 100;

    if (!isNaN(value)) {
      if (value > totalPrice) {
        setUsePoints(totalPrice);
      } else if (value >= 0 && value <= Pointsheld) {
        setUsePoints(value);
      }
    }
  };

  const Accumulate = () => {
    if (usingPoints) {
      return 0;
    }
    return Math.floor((adultTickets * 100 + childTickets * 100) * 0.1);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(prevRegion => prevRegion === region ? null : region);
  };

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 6);

  const handleDateChange = (date) => {
    if (date >= today && date <= maxDate) {
      setSelectedDate(date);
      setSelectedTime(null);
    } else {
      console.error("잘못된 날짜 선택");
    }
  };

  const calendar = ({ date, view }) => {
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 6);

    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    return (
      view === "month" &&
      (date < today.setHours(0, 0, 0, 0) ||
        date > maxDate ||
        date > lastDayOfMonth)
    );
  };

  const handleAdultTickets = (e) => {
    const value = parseInt(e.target.value);
    if (
      !isNaN(value) &&
      value >= 0 &&
      value <= 4 &&
      value + childTickets <= 4
    ) {
      setAdultTickets(value);
      setSelectedSeat([]);
    }
  };

  const handleChildTickets = (e) => {
    const value = parseInt(e.target.value);
    if (
      !isNaN(value) &&
      value >= 0 &&
      value <= 4 &&
      value + adultTickets <= 4
    ) {
      setChildTickets(value);
      setSelectedSeat([]);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:666/moviepay/movies"
        );
        setMovies(response.data);
        if (movieId) {
          const movie = response.data.find(
            (m) => m.movieNo === parseInt(movieId)
          );
          setSelectedMovie(movie);
        }
      } catch (err) {
        console.error("Error loading movie data: ", err);
      }
    };
    fetchMovies();
  }, [movieId]);

  useEffect(() => {
    const fetchAndSetSeats = async () => {
      if (movieNo && selectedTime && selectedDate) {
        const formattedDate = selectedDate
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/. /g, "-")
          .replace(".", "");

        try {
          const fetchURL = `http://localhost:666/moviepay/movieSeat/${movieNo}?viewDate=${formattedDate}&time=${selectedTime}`;
          const response = await fetch(fetchURL);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const parseData = data[0]
            ? data[0].split(",").map((seat) => seat.trim())
            : [];

          setSelectedandSeat(parseData);
        } catch (error) {
          console.error("좌석 에러 :", error);
        }
      } else {
        console.error("값이 누락되었습니다");
      }
    };

    fetchAndSetSeats();
  }, [movieNo, selectedTime, selectedDate]);

  const handleConfirmPayment = () => {
    // 로그인 상태를 loginin 대신 loginMember로 확인
    if (!loginMember || !loginMember.memberNo) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/MemberLogin");
      return;
    }

    if (
      !selectedMovie ||
      !selectedRegion ||
      !selectedDate ||
      !selectedTime ||
      (adultTickets === 0 && childTickets === 0) ||
      selectedSeat.length === 0
    ) {
      alert("모든 항목을 선택해야 결제 페이지로 넘어갑니다.");
      return;
    }

    const selectedDateString = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    const finalPrice = adultTickets * 100 + childTickets * 100 - usePoints;
    const accumulatedPoints = usingPoints
      ? 0
      : Math.floor((adultTickets * 100 + childTickets * 100) * 0.1);

    const newTotalPoints =
      Number(loginMember.memberPoint) - usePoints + Number(accumulatedPoints);

    const updatedLoginmember = {
      ...loginMember,
      memberPoint: newTotalPoints,
    };

    setLoginMember(updatedLoginmember);
    setUserPoints(newTotalPoints);
    localStorage.setItem("loginMember", JSON.stringify(updatedLoginmember));

    alert(`결제 페이지로 넘어갑니다.`);
    resetbutton();

    navigate("/payment/checkout", {
      state: {
        productName: `${
          selectedMovie.movieTitle
        } / ${movieNo} / ${selectedRegion} / ${selectedDate} / ${selectedTime} / ${selectedSeat.join(
          ", "
        )}`,
        movieTitle,
        finalPrice,
        adultTickets,
        childTickets,
        selectedSeat: selectedSeat.join(", "),
        selectedDate: selectedDateString,
        selectedTime,
        selectedRegion,
        usePoints,
        accumulatedPoints,
        memberNo: loginMember.memberNo,
        movieNo: movieNo,
        memberGrade: loginMember.memberGrade,
        memberPayCount: loginMember.memberPayCount,
        Pointsheld: newTotalPoints,
      },
    });
  };

  return (
    <div className="booking">
      <div className="movie-list">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-item"
            onClick={() => handleMovieClick(movie)}
          >
            <img src={getPosterPath(movie)} alt={movie.movieTitle} />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
      <div className="content">
        <div className="resetbutton">
          <button onClick={resetbutton}>예매 다시하기</button>
        </div>
        <div className="MTheader">
          {selectedMovie ? (
            <>
              <div className="movie-info">
                <img src={getPosterPath(selectedMovie)} alt="Movie Poster" />
                <div className="movie-details">
                  <p>영화 : {selectedMovie.movieTitle}</p>
                  <p>영화관 : {selectedRegion}</p>
                  <p>
                    관람일시 :{" "}
                    {selectedDate
                      ? selectedDate.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "long",
                        })
                      : "날짜를 선택하세요"}
                  </p>
                  <p>상영시간 : {selectedTime}</p>
                  <p>
                    선택좌석 :{" "}
                    {selectedSeat.length > 0 ? selectedSeat.join(", ") : "없음"}
                  </p>
                </div>
              </div>
              <div className="total-price">
                <div className="infobutton">
                  <p>총 결제금액: {PointUseTotalPrice()} 원</p>
                  <p>
                    포인트 사용 여부 :
                    <input
                      type="checkbox"
                      checked={usingPoints}
                      onChange={UsePoints}
                    />
                    <p>보유 포인트 : {Pointsheld} 점 </p>
                  </p>
                  {usingPoints && (
                    <p>
                      사용할 포인트 :
                      <input
                        type="number"
                        value={usePoints}
                        onChange={UsePointChange}
                      />
                    </p>
                  )}
                  <p>적립될 포인트 : {Accumulate()}점</p>
                  <button
                    className="confirm-button"
                    onClick={handleConfirmPayment}
                  >
                    결제
                  </button>
                </div>
              </div>
              <div>
                <p>
                  <strong>
                    ※ 포인트를 사용해 예매 할 경우
                    <br />
                    포인트는 따로 적립되지 않습니다.
                  </strong>
                </p>
                <p>
                  <strong>※ 관람일 선택은 오늘 날짜 포함 7일 입니다.</strong>
                </p>
              </div>
            </>
          ) : (
            <div className="default-movie-info">
              <img
                src={process.env.PUBLIC_URL + "/movieimages/select_movie1.jpg"}
                alt="Default"
              />
              <p>선택한 영화가 없습니다.</p>
            </div>
          )}
        </div>
        <div className="steps-row">
          <div className="step">
            <p>STEP1: 영화관 선택</p>
            <button
              className={`step-button ${
                selectedRegion === "강남" ? "selected" : "fail"
              }`}
              onClick={() => handleRegionChange("강남")}
            >
              강남
            </button>
            <button
              className={`step-button ${
                selectedRegion === "역삼" ? "selected" : "fail"
              }`}
              onClick={() => handleRegionChange("역삼")}
            >
              역삼
            </button>
          </div>
          <div className="step">
            <p>STEP2: 관람일 선택</p>
            <Calendar
              className="mtcalendar"
              onChange={handleDateChange}
              value={selectedDate || new Date()}
              locale="ko-KR"
              minDate={today}
              maxDate={maxDate}
              tileDisabled={calendar}
              showNeighboringMonth={false}
            />
          </div>
          <div className="step">
            <p>STEP3: 관람시간 선택</p>
            <button
              className={`step-button ${selectedTime === '10:40:00' ? 'selected' : 'fail'}`}
              onClick={() => handleTimeChange("10:40:00")}
            >
              10:40
            </button>
            <button
              className={`step-button ${selectedTime === '13:45:00' ? 'selected' : 'fail'}`}
              onClick={() => handleTimeChange("13:45:00")}
            >
              13:45
            </button>
            <button
              className={`step-button ${selectedTime === '17:00:00' ? 'selected' : 'fail'}`}
              onClick={() => handleTimeChange("17:00:00")}
            >
              17:00
            </button>
            <button
              className={`step-button ${selectedTime === '19:40:00' ? 'selected' : 'fail'}`}
              onClick={() => handleTimeChange("19:40:00")}
            >
              19:40
            </button>
            <button
              className={`step-button ${selectedTime === '22:20:00' ? 'selected' : 'fail'}`}
              onClick={() => handleTimeChange("22:20:00")}
            >
              22:20
            </button>
          </div>
          <div className="step">
            <p>STEP4: 좌석 및 잔여석 확인</p>
            <div className="seat-selection">
              <label>
                일반 (100원)
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={adultTickets}
                  onChange={handleAdultTickets}
                />
                <br />
              </label>
              <label>
                청소년 (100원)
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={childTickets}
                  onChange={handleChildTickets}
                />
              </label>
              <button className="step-button" onClick={openModal}>
                좌석 선택하기
              </button>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              <div className="screen">
                <p className="moviescreen">SCREEN</p>
                <div className="seats">
                  {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => {
                        const seat = `${row}${col}`;
                        return (
                          <button
                            key={seat}
                            className={`seat ${
                              tempSelectedSeats.includes(seat) ? "selected" : ""
                            } ${
                              selectedandSeat.includes(seat) ? "booked" : ""
                            }`}
                            onClick={() => handleSeatClick(seat)}
                            disabled={selectedandSeat.includes(seat)}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <button className="confirm-button" onClick={confirmSeatSelection}>
                선택 완료
              </button>
            </div>
          </div>
        )}

        <div className="notice">
          <p>예매 시 주의사항</p>
          <dl>
            <dt>1. 홈페이지 예매 후 영화별 실수관번호 발행될 수 있습니다.</dt>
            <dt>
              2. 영화 예매는 관람일 전날 취소 시 수수료 없이 취소 가능합니다.
            </dt>
            <dt>3. 상영관 입장은 상영시간 10분 전부터 가능합니다.</dt>
            <dt>4. 할인혜택은 중복적용이 불가합니다.</dt>
            <dt>5. 좌석은 한 계정당 총 4자리만 예매 가능합니다.</dt>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Booking;
