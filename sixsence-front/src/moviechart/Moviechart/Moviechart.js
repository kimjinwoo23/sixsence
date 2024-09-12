import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Moviechart/Moviechart.css";

const MovieChart = () => {
  const [movieChart, setMovieChart] = useState([]);
  const [movieOption, setMovieOption] = useState("rating");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/moviepay/movies");
        setMovieChart(response.data);
      } catch (err) {
        console.error("Error loading movie data: ", err);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchMovies();
  }, []);

  const handleOption = (e) => {
    setMovieOption(e.target.value);
  };

  const sortedMovies = [...movieChart].sort((a, b) => {
    if (movieOption === "rating") {
      return b.vote_average - a.vote_average;
    } else if (movieOption === "alphabetical") {
      return a.movieTitle.localeCompare(b.movieTitle, "ko");
    }
    return 0;
  });

  return (
    <div>
      <div className="movie-options">
        <label>
          <input
            type="radio"
            value="alphabetical"
            checked={movieOption === "alphabetical"}
            onChange={handleOption}
          />
          가나다순
        </label>
        <label>
          <input
            type="radio"
            value="rating"
            checked={movieOption === "rating"}
            onChange={handleOption}
          />
          평점순
        </label>
      </div>

      <div className="moviechart-container">
        {sortedMovies.slice(0, 20).map((movie) => (
          <div key={movie.movieNo} className="moviechart-movies">
            <img src={movie.movieImage} alt={movie.movieTitle} />
            <h2>{movie.movieTitle}</h2>
            <p>평점 : {movie.movieScore}</p> {/* 영화 점수 표시 */}
            <p>상영 시간 : {movie.movieShowtime}</p> {/* 상영 시간 표시 */}
            <p>개봉일 : {movie.movieDate}</p> {/* 개봉일 표시 */}
            <a href={`/Movie/${movie.movieNo}`} className="btnone">
              상세보기
            </a>
            <a href={`/Movieboard-app?movieId=${movie.movieNo}`} className="btn">
              예매하기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieChart;
