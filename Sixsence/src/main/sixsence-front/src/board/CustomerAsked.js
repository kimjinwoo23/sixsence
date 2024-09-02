import React, { useState, useRef } from 'react';
import '../css/CustomerAsked.css';
import BoardNavBar from './BoardNavBar';



const CustomerAsked = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const answerRef = useRef(null);

  const questionClick = (index) => {
    const isSameQuestion = currentQuestion === index;
    setCurrentQuestion(isSameQuestion ? null : index);

    if(!isSameQuestion && answerRef.current) {
      setTimeout(() => {
        answerRef.current.scrollIntoView({behavior:'smooth'});
      },100);
    }
    console.log("자주묻는질문",index);
  };

  const questions = [
    { question: '1. 영화 상영 시간은 어떻게 확인하나요?', answer: '영화 상영 시간은 영화관 웹사이트나 모바일 앱에서 확인할 수 있습니다.' },
    { question: '2. 영화 예매는 어떻게 하나요?', answer: '영화 예매는 영화관 웹사이트, 모바일 앱, 현장 예매기에서 할 수 있습니다.' },
    { question: '3. 인터넷 예매시 부분환불/교환 가능한가요?', answer: '인터넷 예매시에는 예매매수의 전체환불 및 교환만 가능합니다.' },
    { question: '4. 국가유공자 혜택은 어떻게 되나요?', answer: '현장에서 [국가유공자증]을 소지한 본인 외 동반1인까지 우대발권 가능합니다.' },
    { question: '5. 아이디를 바꾸고 싶은데 수정할 수 있나요?', answer: '회원가입시 입력한 아이디는 변경이 불가하며, 탈퇴 후 재가입을 통해 아이디로 지정할 수 있습니다..' },
    { question: '6. 외부음식 반입이 가능한가요?', answer: '상영관 내 외부 음식 반입은 가능하나 영화 관람 시 다른 고객님께 방해가 되지 않은 품목에 한하여 반입이 가능합니다.' },
    { question: '7. 예매한 티켓은 어떻게 취소하나요?', answer: '예매한 티켓은 영화 상영 시작 전까지 웹사이트나 모바일 앱에서 취소할 수 있습니다.' },
    { question: '8. 할인 혜택은 어떤 것들이 있나요?', answer: '영화관마다 다르지만, 회원 할인, 신용카드 할인, 포인트 적립 등의 혜택이 있습니다.' },
    { question: '9. 상영 중인 영화 목록은 어디서 볼 수 있나요?', answer: '상영 중인 영화 목록은 영화관 웹사이트나 모바일 앱에서 확인할 수 있습니다.' },
    { question: '10. 영화관에서 먹을 수 있는 음식은 무엇이 있나요?', answer: '팝콘, 나초, 핫도그 등 다양한 스낵과 음료를 판매합니다.' },
    { question: '11. 좌석은 어떻게 선택하나요?', answer: '영화 예매 시 좌석을 선택할 수 있으며, 영화관 입장 시 좌석표를 확인할 수 있습니다.' },
    { question: '12. 영화 상영 시간 전에 입장할 수 있나요?', answer: '네, 영화 상영 시간 30분 전부터 입장이 가능합니다.' },
    { question: '13. 예매한 티켓을 분실했을 경우 어떻게 하나요?', answer: '모바일 티켓은 앱에서 다시 확인할 수 있으며, 현장 예매 티켓은 영화관에 문의하세요.' },
    { question: '14. 장애인 할인 혜택은 어떻게 받나요?', answer: '장애인 증명서를 지참하여 영화관에서 할인 혜택을 받을 수 있습니다.' },
    { question: '15. 단체 예매는 어떻게 하나요?', answer: '단체 예매는 영화관 웹사이트나 고객센터를 통해 예약할 수 있습니다.' },
    { question: '16. 영화를 찍거나 녹음하면 어떻게 되나요?', answer: '영화를 찍거나 녹음하는 것은 법적으로 금지되어 있으며, 적발 시 법적 처벌을 받을 수 있습니다.' },
  ];
  
  return (
    <div className="faq-container">
       <BoardNavBar />
      <h2 className="faq-title">자주 묻는 질문</h2>
      <div className="questions-grid">
        {questions.map((q, index) => (
          <div
            key={index}
            className={`question-box ${currentQuestion === index ? 'active' : ''}`}
            onClick={() => questionClick(index)}>
            {q.question}
          </div>
        ))}
      </div>
      {currentQuestion !== null && (
        <div className="answer-container" ref={answerRef}>
          <h3 className="question-title">{questions[currentQuestion].question}</h3>
          <p className="answer-text">{questions[currentQuestion].answer}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerAsked;
