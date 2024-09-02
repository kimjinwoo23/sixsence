import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LoginContext from "../login/LoginContext";
import "../css/NoticeView.css";

const NoticeView = () => {
  const { loginMember } = useContext(LoginContext);  // 로그인 정보 가져오기
  const { postNo } = useParams(); 
  const [post, setPost] = useState(null); // 게시글 데이터를 저장할 상태 변수
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [editPost, setEditPost] = useState({
    postTitle:"",
    postContent:"",
    postCreateDate:"",
    postCount:""
  });

  // 수정하기 버튼을 눌렀는지 안 눌렀는지 체크하는 상태 변수
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get(`/api/board/${postNo}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.log("에러가발생했어요", error);
      });
  }, [postNo]);

  if (!post) {
    return <div>Loading...<img src="/board_image/b_image.jpg"/></div>;
 }

  // 관리자 권한 확인 
  const isAdmin = loginMember && loginMember.memberNo === 1;

  // 관리자가 수정한 내용을 서버에 보내기
  const handleSaveChanges = () => {
    axios.put(`/api/boardEdit/${postNo}`, editPost)
      .then(response => {
        setPost(response.data); // DB에 저장된 내용을 다시 가져오기
        setIsEditing(false); // 수정 모드 종료
        navigate('/CustomerBoard'); // 수정 완료 후 다시 NoticeView로 이동 (추가된 부분)
      })
      .catch(error => {
        console.error("수정하는 데 문제가 발생했습니다.", error);
      });
  };

  // 공지사항 삭제하기
   const noticeDelete = () => {
    axios.delete(`/api/post/${postNo}`)
    .then(() => {
      alert("삭제가 완료되었습니다.");
      navigate("/CustomerBoard")
    })
    .catch(error => {
      console.error("삭제했는데 문제가 발생했습니다.", error);
      alert("삭제에 실패했습니다.");
    });
   };

  return (
    <div className="post-container mt-4">
      {isEditing ? (
        // 수정 모드일 때 표시할 폼
        <div className="post-edit-container">
          <p>제목:{post.postTitle}</p>
          <p>내용:{post.postContent}</p>
          <input 
            type="text" 
            name="postTitle" 
            value={editPost.postTitle}
            onChange={(e) => setEditPost({...editPost, postTitle: e.target.value})} 
            placeholder="공지사항제목"
          />
          <textarea 
            name="postContent" 
            value={editPost.postContent}
            onChange={(e) => setEditPost({...editPost, postContent: e.target.value})} 
            placeholder="공지사항내용"
          />
          <button onClick={handleSaveChanges}>수정완료</button>
        </div>
 ) : (
  // 수정 모드가 아닐 때 표시할 내용
  <div>
    <h2>{post.postTitle}</h2>
    <p>{post.postContent}</p>
    <p><strong>작성일:</strong> {post.postCreateDate}</p>
    <p className="post-count"><strong>조회수:</strong> {post.postCount}</p>
    <button size="large" onClick={() => navigate("/CustomerBoard")}>돌아가기</button>
    {/* 관리자일 경우 수정하기 버튼 표시 */}
    {isAdmin && (
      <button onClick={() => setIsEditing(true)}>수정하기</button>
    )}
    {isAdmin && (
      <button onClick={noticeDelete}>삭제하기</button>
    )}
  </div>
)}
</div>
);
};

export default NoticeView;