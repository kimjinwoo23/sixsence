package com.six.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.six.dto.Comment;

@Service
public interface CommentService {

	List<Comment> selectComment(int movieNo);
	void insertComment(Comment comment);
	void deleteComment(int coid);
	
	
	
}