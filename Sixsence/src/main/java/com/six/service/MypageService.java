package com.six.service;

import java.util.List;
import java.util.Map;

import com.six.dto.CommentMypage;
import com.six.dto.ItempayMypage;
import com.six.dto.Member;
import com.six.dto.Moviepay;
import com.six.dto.Obo;


public interface MypageService {
	
	Map<String, Object> getMovieList(int memberNo);
	
	Map<String, Object> getMovieAll();
	
	void cancelReservation(int moviepayNo);
	
	List<ItempayMypage> getItempayList(int memberNo);
	
	void cancelItempay(int itempayNo);
	
	void returnPointItem(ItempayMypage itempayMypage);

	List<ItempayMypage> getRefundItempayList(int memberNo);
	
	List<Moviepay> getRefundMovieList(int memberNo);
	
	void deleteAccount(int memberNo);
	
	List<Obo> getMemberObo(int memberNo);
	
	void deleteObo(int oboNo);
	
	void returnPoint(Moviepay moviepay);
	
	Member getLoginMember(int memberNo);
	
	void editMember(Member member);
	
	List<CommentMypage> getCommentMypage(int memberNo);
	
	void deleteComment(int coid);
}