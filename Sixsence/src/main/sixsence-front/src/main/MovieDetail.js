import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegStar, FaStar } from "react-icons/fa";
import "./css/MovieDetail.css";
import LoginContext from '../login/LoginContext';

const MovieDetail = () => {
    const { movieNo } = useParams();
    const [moviedata, setMovieData] = useState(null);
    const [soname, setSoname] = useState("");  // 리뷰 작성자 이름
    const [review, setReview] = useState("");  // 리뷰 내용
    const [reviews, setReviews] = useState([]);  // 리뷰 목록
    const [rating, setRating] = useState(0);  // 별점
    const { loginMember } = useContext(LoginContext);  // 로그인된 사용자 정보
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/movie/selectMovie?movieNo=${movieNo}`)
            .then(response => {
                setMovieData(response.data[0]);
            })
            .catch(e => alert("불러오기 실패"));
    }, [movieNo]);

    useEffect(() => {
        axios.get(`/api/comment/movie/${movieNo}`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(e => alert("코멘트 불러오기 실패"));
    }, [movieNo]);

    // 리뷰 제출 처리
    const handleReviewSubmit = () => {
        if (!loginMember) {
            const shouldNavigate = window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
            if (shouldNavigate) {
                navigate('/memberLogin');
                return;
            } else {
                return;
            }
        }
        const newReview = {
            soname: loginMember.memberName || soname,
            text: review,
            rating: rating,
            memberNo: loginMember.memberNo
        };
        axios.post(`/api/comment/insert`, {
            movieNo: movieNo,
            text: newReview.text,
            score: newReview.rating,
            soname: newReview.soname,
            memberNo: newReview.memberNo
        })
        .then(response => {
            // 서버에서 새로운 리뷰 ID를 받아옵니다.
            const addedReview = {
                ...newReview,
                coid: response.data.coid  // 서버에서 받은 리뷰 ID
            };
            // 리뷰를 목록에 추가한 후 전체 리뷰 목록을 다시 불러옵니다.
            axios.get(`/api/comment/movie/${movieNo}`)
                .then(res => {
                    setReviews(res.data);
                })
                .catch(e => alert("코멘트 불러오기 실패"));
            setReview("");
            setRating(0);
        })
        .catch(e => alert("관람평 제출 실패"));
    };

    // 리뷰 삭제 처리
    const handleDeleteReview = (coid, reviewMemberNo) => {
        if (loginMember.memberNo !== reviewMemberNo) {
            alert("자신이 작성한 리뷰만 삭제할 수 있습니다.");
            return;
        }

        axios.delete(`/api/comment/delete?coid=${coid}`)
        
        .then(response => {
            console.log("Review deleted successfully");
            setReviews(prevReviews => prevReviews.filter(review => review.coid !== coid));
        })
        .catch(error => {
            console.error("Error deleting review:", error);
        });
    };

    // 별점 클릭 처리
    const handleRatingClick = (value) => {
        setRating(value);
    };

    useEffect(() => {
        if (loginMember) {
            setSoname(loginMember.memberName); // 로그인된 사용자의 이름으로 설정
        }
    }, [loginMember]);

    if (!moviedata) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className='detail-container'>
            <div className="movie-header">
                <img className='image' src={`.${moviedata.movieImage}`} alt={moviedata.movieTitle} />
                <div className="movie-infomation">
                    <h1 className='title'>{moviedata.movieTitle}</h1>
                    <div className='grade'>관람 등급: {moviedata.movieGrade}</div>
                    <div className='showtime'>상영 시간: {moviedata.movieShowtime}</div>
                    <div className='story'>스토리: {moviedata.movieStory}</div>
                    <a href={`/Movieboard-app?movieId=${movieNo}`} className="detail-button">예매하기</a>
                </div>
            </div>

            <div className='review-section'>
                <div className='star-rating'>
                    {[1, 2, 3, 4, 5].map(value => (
                        value <= rating ? 
                        <FaStar
                            key={value}
                            size={30}
                            className="star selected"
                            onClick={() => handleRatingClick(value)}
                        /> : 
                        <FaRegStar
                            key={value}
                            size={30}
                            className="star"
                            onClick={() => handleRatingClick(value)}
                        />
                    ))}
                </div>

                <div className='review-form'>
                    <input
                        type="text"
                        value={soname}
                        onChange={(e) => setSoname(e.target.value)}
                        placeholder="이름을 입력하세요"
                        className="soname-input"
                        disabled={!!loginMember}  // 로그인된 경우에는 입력 불가능하게 설정
                    />
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="관람평을 입력하세요"
                        className="review-textarea"
                    />
                    <button className="review-submit-button" onClick={handleReviewSubmit}>등록하기</button>
                </div>
            </div>
            <div className='reviews-list'>
                <h2>관람평</h2>
                {reviews.length === 0 ? (
                    <p>아직 작성된 관람평이 없습니다.</p>
                ) : (
                    <ul>
                        {reviews.map((rev, index) => (
                            <li key={index} className="review-item">
                                <strong>{rev.soname}:</strong> {rev.text} ({rev.score}점)
                                {loginMember && loginMember.memberNo === rev.memberNo && (
                                    <button 
                                        className="delete-button" 
                                        onClick={() => handleDeleteReview(rev.coid, rev.memberNo)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MovieDetail;