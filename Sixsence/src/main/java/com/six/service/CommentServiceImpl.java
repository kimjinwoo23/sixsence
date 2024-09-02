package com.six.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.six.dto.Comment;
import com.six.mapper.Commentmapper;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    Commentmapper commentmapper;

    @Override
    public List<Comment> selectComment(int movieNo) {
        return commentmapper.selectComment(movieNo);
    }

    @Override
    public void insertComment(Comment comment) {
    	
        commentmapper.insertComment(comment);
        
    }

    @Override
    public void deleteComment(int coid) {
    	System.out.println("Deleting comment with coid: " + coid);
        commentmapper.deleteComment(coid);
    }
}