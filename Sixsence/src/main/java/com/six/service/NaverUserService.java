package com.six.service;

import com.six.dto.Member;

//서비스 목록 리스트 여기는 목록만 작성해주고 imple 오버라이드 해서 각 환경에 맞게 재사용
//기능을 작성하기 전에 상세하게 작성할 기능 목록을 구성
public interface NaverUserService {
	// 네이버 SNS 연동해서 회원가입하는 insert
	void insertNaverUser(Member member);
}