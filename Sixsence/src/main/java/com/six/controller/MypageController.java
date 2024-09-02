package com.six.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.CommentMypage;
import com.six.dto.ItempayMypage;
import com.six.dto.Member;
import com.six.dto.Moviepay;
import com.six.dto.Obo;
import com.six.service.MypageService;

@RestController
public class MypageController {
	@Autowired
	private MypageService mypageService;
	
	@GetMapping("/getMovieList")
	public Map<String, Object> getMovieList(@RequestParam("memberNo") int memberNo) {
		return mypageService.getMovieList(memberNo);
	}
	
	@GetMapping("/getMovieAll")
	public Map<String, Object> getMovieAll() {
		return mypageService.getMovieAll();
	}
	
	@PutMapping("/cancelReservation")
	public void cancelReservation(@RequestParam("moviepayNo") int moviepayNo) {
		mypageService.cancelReservation(moviepayNo);
	}
	
	@PutMapping("/returnPoint")
	public void returnPoint(@RequestBody Moviepay moviepay) {
		mypageService.returnPoint(moviepay);
	}
	
	@GetMapping("/getItempayList")
	public ResponseEntity<List<ItempayMypage>> getItempayList(@RequestParam("memberNo") int memberNo) {
		return ResponseEntity.ok(mypageService.getItempayList(memberNo));
	}
	
	@PutMapping("/cancelItempay")
	public void cancelItempay(@RequestParam("itempayNo") int itempayNo) {
		mypageService.cancelItempay(itempayNo);
	}
	
	@PutMapping("/returnPointItem")
	public void returnPointItem(@RequestBody ItempayMypage itempayMypage) {
		mypageService.returnPointItem(itempayMypage);
	}
	
	@GetMapping("/getRefundItempayList")
	public ResponseEntity<List<ItempayMypage>> getRefundItempayList (@RequestParam("memberNo") int memberNo) {
		return ResponseEntity.ok(mypageService.getRefundItempayList(memberNo));
	}
	
	@GetMapping("/getRefundMovieList")
	public ResponseEntity<List<Moviepay>> getRefundMovieList (@RequestParam("memberNo") int memberNo) {
		return ResponseEntity.ok(mypageService.getRefundMovieList(memberNo));
	}
	
	@DeleteMapping("/deleteAccount")
	public void deleteAccount(@RequestParam("memberNo") int memberNo) {
		mypageService.deleteAccount(memberNo);
	}
	
	@GetMapping("/getMemberObo")
	public ResponseEntity<List<Obo>> getMemberObo (@RequestParam("memberNo") int memberNo) {
		return ResponseEntity.ok(mypageService.getMemberObo(memberNo));
	}
	
	@DeleteMapping("/deleteObo")
	public void deleteObo(@RequestParam("oboNo") int oboNo) {
		mypageService.deleteObo(oboNo);
	}
	
	@GetMapping("/getLoginMember")
	public Member getLoginMember(@RequestParam("memberNo") int memberNo) {
		return mypageService.getLoginMember(memberNo);
	}
	
	@PutMapping("/editMember")
	public void editMember(@RequestBody Member member) {
		mypageService.editMember(member);
	}
	
	@GetMapping("/getCommentListMypage")
	public ResponseEntity<List<CommentMypage>> getCommentMypage(@RequestParam("memberNo") int memberNo) {
		return ResponseEntity.ok(mypageService.getCommentMypage(memberNo));
	}
	
	@DeleteMapping("/deleteCommentMypage")
	public void deleteComment(@RequestParam("coid") int coid) {
		mypageService.deleteComment(coid);
	}
}