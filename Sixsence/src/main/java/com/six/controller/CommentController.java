package com.six.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Comment;
import com.six.service.CommentService;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/movie/{movieNo}")
    public List<Comment> selectComment(@PathVariable("movieNo") int movieNo) {
    	 System.out.println("Fetching comments for movieNo: " + movieNo);
        return commentService.selectComment(movieNo);
    }


    @PostMapping("/insert")
    public void insertComment(@RequestBody Comment comment) {
        System.out.println("Inserting comment for movieNo: " + comment.getMovieNo());
        commentService.insertComment(comment);
    }

    @DeleteMapping("/delete")
    public void deleteComment(@RequestParam(name = "coid") int coid) {
        System.out.println("Deleting comment with coid: " + coid);
        commentService.deleteComment(coid);
    }
}