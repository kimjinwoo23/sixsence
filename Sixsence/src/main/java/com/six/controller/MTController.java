package com.six.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.six.dto.Movie;
import com.six.dto.Moviepay;
import com.six.service.MTServicelmpl;

@RestController
@RequestMapping("/moviepay")
public class MTController {

	@Autowired
	private MTServicelmpl mtservicelmpl;

	// 결제정보 DB insert
	@PostMapping("/insert")
	public ResponseEntity<String> insertMT(@RequestBody Moviepay moviepay) {
		mtservicelmpl.insertMT(moviepay);
		return ResponseEntity.ok("response");
	}

	// 유저id를 통해 포인트 출력
	@GetMapping("/points/{userId}")
	public ResponseEntity<Integer> getUserPoints(@PathVariable("userId") String userId) {
		int points = mtservicelmpl.getUserPoints(userId);
		return ResponseEntity.ok(points);
	}

	// 영화 목록 출력
	@GetMapping("/movies")
	public ResponseEntity<List<Movie>> getAllMovies() {
		List<Movie> movies = mtservicelmpl.getAllMovies();
		return ResponseEntity.ok(movies);
	}

	// 예매된 좌석 정보 가져오기
	@GetMapping("/movieSeat/{movieNo}")
	public ResponseEntity<List<String>> movieSeat(
			@PathVariable("movieNo") int movieNo,
			@RequestParam("viewDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate viewDate,
			@RequestParam("time") @DateTimeFormat(pattern = "HH:mm:ss") LocalTime time) {

		Map<String, Object> params = new HashMap<>();
		params.put("movieNo", movieNo);
		params.put("viewDate", viewDate);
		params.put("time", time);

		List<String> movieSeat = mtservicelmpl.movieSeat(params);
		return ResponseEntity.ok(movieSeat);
	}

	// 결제 완료 시 그 회원의 결제 회수 증가 및 회원 등급
	@PostMapping("/updatepayCount")
	public ResponseEntity<String> payCount(@RequestBody Map<String, Integer> request) {
		int memberNo = request.get("memberNo");
		int remainPoints = request.get("remainPoints");
		// 포인트 업데이트 결제 횟수 등급 포인트 업데이트
		mtservicelmpl.payCount(memberNo, remainPoints);

		return ResponseEntity.ok("Member pay count and grade and point ok");
	}


}