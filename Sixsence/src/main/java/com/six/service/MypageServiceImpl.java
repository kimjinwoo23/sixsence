package com.six.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.six.dto.CommentMypage;
import com.six.dto.ItempayMypage;
import com.six.dto.Member;
import com.six.dto.Movie;
import com.six.dto.Moviepay;
import com.six.dto.Obo;
import com.six.mapper.MypageMapper;


@Service
public class MypageServiceImpl implements MypageService {
	@Autowired
	private MypageMapper mypageMapper;

	@Override
	public Map<String, Object> getMovieList(int memberNo) {
		Map<String, Object> map = new HashMap<>();
		List<Moviepay> reservationList = mypageMapper.getMovieList(memberNo);

		if(reservationList.isEmpty()) {
			map.put("result", null);
		} else {
			for(int i=0; i<reservationList.size(); i++) {
				map.put("result", reservationList);
			}
		}

		return map;
	}

	@Override
	public Map<String, Object> getMovieAll() {
		Map<String, Object> map = new HashMap<>();
		List<Movie> movieList = mypageMapper.getMovieAll();
		
		if(movieList.isEmpty()) {
			map.put("result", null);
		} else {
			for(int i=0; i<movieList.size(); i++) {
				map.put("result", movieList);
			}
		}
		return map;
	}

	@Override
	public void cancelReservation(int moviepayNo) {
		mypageMapper.cancelReservation(moviepayNo);
	}

	@Override
	public void returnPoint(Moviepay moviepay) {
		if(moviepay.getMoviepayPointUse().equalsIgnoreCase("Y")) {
			mypageMapper.returnPointY(moviepay);
		} else {
			mypageMapper.returnPointN(moviepay);
		}
	}
	
	@Override
	public List<ItempayMypage> getItempayList(int memberNo) {
		return mypageMapper.getItempayList(memberNo);
	}

	@Override
	public void cancelItempay(int itempayNo) {
		mypageMapper.cancelItempay(itempayNo);
	}
	
	@Override
	public void returnPointItem(ItempayMypage itempayMypage) {
		if(itempayMypage.getItempayPointUse().equalsIgnoreCase("Y")) {
			mypageMapper.returnPointYItem(itempayMypage);
		} else {
			if(itempayMypage.getMemberGrade().equalsIgnoreCase("VIP")) {
				mypageMapper.returnPointNItemVip(itempayMypage);
			} else {
				mypageMapper.returnPointNItemNew(itempayMypage);
			}
		}
	}

	@Override
	public List<ItempayMypage> getRefundItempayList(int memberNo) {
		return mypageMapper.getRefundItempayList(memberNo);
	}

	@Override
	public List<Moviepay> getRefundMovieList(int memberNo) {
		return mypageMapper.getRefundMovieList(memberNo);
	}

	@Override
	public void deleteAccount(int memberNo) {
		mypageMapper.deleteAccount(memberNo);
	}

	@Override
	public List<Obo> getMemberObo(int memberNo) {
		return mypageMapper.getMemberObo(memberNo);
	}

	@Override
	public void deleteObo(int oboNo) {
		mypageMapper.deleteObo(oboNo);
	}

	@Override
	public Member getLoginMember(int memberNo) {
		Member mem = mypageMapper.getLoginMember(memberNo);
		
		if(mem.getMemberGrade().equalsIgnoreCase("VIP") && mem.getMemberPayCount() < 10) {
			mem.setMemberGrade("NEW");
			
			mypageMapper.updateGrade(mem);
		}
		
		return mem;
	}

	@Override
	public void editMember(Member member) {
		mypageMapper.editMember(member);
	}

	@Override
	public List<CommentMypage> getCommentMypage(int memberNo) {
		return mypageMapper.getCommentMypage(memberNo);
	}

	@Override
	public void deleteComment(int coid) {
		mypageMapper.deleteComment(coid);
	}
}