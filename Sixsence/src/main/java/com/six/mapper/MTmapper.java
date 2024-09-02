package com.six.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.six.dto.Movie;
import com.six.dto.Moviepay;

@Mapper
public interface MTmapper {
	List<Moviepay> insertMT();

	// 영화no로 예매된 좌석 정보 확인
	List<String> movieSeat(Map<String, Object> params);

	int getUserPoints(@Param("userId") String userId);

	void insertMT(Moviepay moviepay);

	List<Movie> getAllMovies();

	// 영화 번호로 영화 정보 가져오기
	Movie getMovieById(int movieNo);

	void payCount(Map<String, Object> params);




}