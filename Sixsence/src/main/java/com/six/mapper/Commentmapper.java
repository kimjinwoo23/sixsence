package com.six.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.six.dto.Comment;

@Mapper
public interface Commentmapper {


	List<Comment> selectComment(int movieNo);


	void insertComment(Comment comment);

	void deleteComment(int coid);


}