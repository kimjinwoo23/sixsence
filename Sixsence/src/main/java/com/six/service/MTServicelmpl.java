package com.six.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.six.dto.Movie;
import com.six.dto.Moviepay;
import com.six.mapper.MTmapper;

import jakarta.transaction.Transactional;

@Service
public class MTServicelmpl implements MTService{

	@Autowired
	MTmapper mtmapper;

	@Override
	public List<Moviepay> insertMT() {
		return mtmapper.insertMT();
	}

	@Override
	public int getUserPoints(String userId) {
		return mtmapper.getUserPoints(userId);
	}


	@Override
	public List<Movie> getAllMovies() {
		return mtmapper.getAllMovies();
	}

	@Override
	public List<String> movieSeat(Map<String, Object> params){
		return mtmapper.movieSeat(params);
	}

	@Override
	@Transactional // 트랜잭션 동시에 두 명 이상의 사용자가 동일한 좌석을 예약하려고할때 트랜잭션 충돌 발생하여 중복예약 방지
	public void insertMT(Moviepay moviepay) {
		// 영화 번호로 영화 정보 조회
		Movie movie = mtmapper.getMovieById(moviepay.getMovieNo());
		if(movie != null) {
			moviepay.setMovieTitle(movie.getMovieTitle()); // 영화 제목 설정
		}


		// 영화 번호와 시간으로 이미 예약된 좌석 조회
		Map<String, Object> params = new HashMap<>();
		params.put("movieNo", moviepay.getMovieNo());
		params.put("viewDate", moviepay.getMoviepayViewdate());
		params.put("time", moviepay.getMoviepayViewtime());

		List<String> bookedSeats = mtmapper.movieSeat(params);

		//이미 예약된 좌석 있는지 확인
		for (String seat : moviepay.getMoviepaySeat().split(",")) {
			if (bookedSeats.contains(seat.trim())) {
				throw new RuntimeException("이미 예약된 좌석입니다: " + seat);
			}
		}

		//중복이 없으면 예약 정보 저장
		mtmapper.insertMT(moviepay);

	}


	@Override
	public void payCount(int memberNo, int remainPoints) {
		Map<String,Object> params = new HashMap<>();
		params.put("memberNo", memberNo);
		params.put("remainPoints", remainPoints);
		mtmapper.payCount(params);
	}

	@Override
	public Movie getMovieById(int movieNo) {
		return mtmapper.getMovieById(movieNo);
	}





}