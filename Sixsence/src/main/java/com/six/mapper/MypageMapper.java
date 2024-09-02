package com.six.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.six.dto.CommentMypage;
import com.six.dto.ItempayMypage;
import com.six.dto.Member;
import com.six.dto.Movie;
import com.six.dto.Moviepay;
import com.six.dto.Obo;

@Mapper
public interface MypageMapper {
	
	List<Moviepay> getMovieList(int memberNo);
	
	List<Movie> getMovieAll();
	
	void cancelReservation(int moviepayNo);
	
	void returnPointY(Moviepay moviepay);
	
	void returnPointN(Moviepay moviepay);

	List<ItempayMypage> getItempayList(int memberNo);

	void cancelItempay(int itempayNo);
	
	void returnPointYItem(ItempayMypage itempayMypage);
	
	void returnPointNItemNew(ItempayMypage itempayMypage);
	
	void returnPointNItemVip(ItempayMypage itempayMypage);

	List<ItempayMypage> getRefundItempayList(int memberNo);
	
	List<Moviepay> getRefundMovieList(int memberNo);
	
	void deleteAccount(int memberNo);
	
	List<Obo> getMemberObo(int memberNo);
	
	void deleteObo(int oboNo);
	
	Member getLoginMember(int memberNo);
	
	void updateGrade(Member member);
	
	void editMember(Member member);
	
	List<CommentMypage> getCommentMypage(int memberNo);
	
	void deleteComment(int coid);
}