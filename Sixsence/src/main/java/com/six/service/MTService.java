package com.six.service;

import java.util.List;
import java.util.Map;

import com.six.dto.Movie;
import com.six.dto.Moviepay;

public interface MTService {
	List<Moviepay> insertMT();
	void insertMT(Moviepay moviepay);

	//포인트 조회
	int getUserPoints(String userId);

	// 영화 가져오기
	List<Movie> getAllMovies();

	// 영화 params 로 예매된 좌석 가져오기
	List<String> movieSeat(Map<String, Object> params);

	void payCount(int memberNo ,  int remainPoints);

	Movie getMovieById(int movieNo);



}