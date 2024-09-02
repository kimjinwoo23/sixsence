package com.six.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import com.six.dto.Post;
import com.six.mapper.PostMapper;


public interface PostService {
	//게시물 데이터 불러오기
	List<Post> findAll();
	//특정게시물 불러오기
	Post findPostById(int postNo);
	void incrementViewCount(int postNo); //조회수 증가 메서드 추가
    //글 쓰기
	void writeCompleted(Post post);
	// 공지사항 수정하기
	void boardUpdate(Post post);
	// 공지사항 삭제하기
	 int postDelete(int postNo);
  }
