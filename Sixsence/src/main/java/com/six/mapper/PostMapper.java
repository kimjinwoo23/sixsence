package com.six.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.six.dto.Post;

@Mapper
public interface PostMapper {
	//공지사항 데이터 불러오기
	List<Post> findAll();
	//특정게시물 불러오기
	Post findPostById(@Param("postNo")int postNo);
	//조회수 증가하기
	void incrementViewCount(@Param("postNo")int postNo);
	//글쓰기
	void writeCompleted(Post post);
	//공지사항 수정하기
	 void boardUpdate(Post post); 
    //공지사항 삭제하기
	 int postDelete(int postNo);
	

 }