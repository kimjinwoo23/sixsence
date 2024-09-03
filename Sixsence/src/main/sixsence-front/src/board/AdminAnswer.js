import React,{useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import '../css/AdminAnswer.css';

const AdminAnswer = () => {
   const { oboNo } = useParams();
   const [obo, setObo] = useState(null);
   const [oboAnswer, setOboAnswer] = useState('');
   const [isAnswering, setIsAnswering] = useState(false);  // 답변 작성 모드 확인
   const navigate = useNavigate();

   //특정 1:1문의 리스트 불러오기
   useEffect(() => {
    axios.get(`/api/oboList/${oboNo}`)
    .then(response => {
      setObo(response.data);
    })
    .catch(e=> alert("불러오는데 문제가 발생했습니다."));
   } ,[oboNo]);

   //특정문의 답변 보내기
   const handleAnswerSubmit = () => {
     const answerData = {
       ...obo,  // 기존 문의 데이터
       oboAnswer: oboAnswer,  // 답변 내용
       oboStatus: 'y'  // 상태를 'y'로 변경
     };

     axios.post("/api/registerAnswer", answerData)
     .then(response => {
       alert("답변이 등록되었습니다.");
       navigate("/AdminObo");  // 답변 등록 후 목록으로 이동
     })
     .catch(error => {
       alert("답변 등록이 실패했습니다.");
       console.error("에러발생", error);
     });
   };
   
  //문의 삭제하기
   const oboDelete = () => {
    axios.delete(`/api/obo/${oboNo}`)
    .then(() => {
      alert("삭제되었습니다");
      navigate("/AdminObo"); 
    })
    .catch(error => {
      console.error("삭제하는데 문제가 발생했습니다.", error);
      alert("삭제에 실패했습니다.");
    });
  };
   
   return(
    <div className="admin-answer-container">
    {obo ? (
      <>
        <p>작성자: {obo.memberName}</p>
        <p>제목: {obo.oboTitle}</p>
        <p>내용: {obo.oboContent}</p>
        {isAnswering ? (
          <>
            <textarea
              type="text" 
              value={oboAnswer} 
              onChange={(e) => setOboAnswer(e.target.value)}
              placeholder="문의내용 답변작성" 
            />
            <button  onClick={handleAnswerSubmit}>답변 제출</button>
            <button size="large" onClick={() => navigate("/AdminObo")}>돌아가기</button>
            
          </>
        ) : (
          <button onClick={() => setIsAnswering(true)}>답변하기</button>
          
        )}
        <button onClick={oboDelete}>삭제하기</button>
      </>
    ) : (
      <p>로딩 중...</p>
    )}
  </div>
   )
};

export default AdminAnswer;
