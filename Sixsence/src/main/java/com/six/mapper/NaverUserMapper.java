package com.six.mapper;

import java.util.List;

import com.six.dto.Member;
import org.apache.ibatis.annotations.Mapper;


// mybatis에 id값으로 작성한 sql 기능 목록을 작성
// 기능에 대한 목록만 보기 때문에 interface
@Mapper
public interface NaverUserMapper {
	List<Member> findAll();

	// 네이버 SNS 연동해서 회원가입하는 insert
	void insertNaverUser(Member member);
}