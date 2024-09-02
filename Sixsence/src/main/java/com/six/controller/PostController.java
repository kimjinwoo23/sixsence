package com.six.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Post;
import com.six.service.PostService;

import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/api")
@Slf4j
public class PostController {
	
	@Autowired
	private PostService postService;
	
	//게시판 정보 불러오기
	@GetMapping("/board")
	public List<Post> findAll(){
		System.out.println("2580000");
		return postService.findAll();
	}
	
	//특정 게시물 불러오기
	@GetMapping("/board/{postNo}")
	public Post findPostById(@PathVariable("postNo")int postNo) {
		System.out.println("33333333");
		log.info("info message");
		return postService.findPostById(postNo);
	}
	//조회수 증가하기
	@PostMapping("/board/incrementViewCount/{postNo}")
	public ResponseEntity<Void> incrementViewCount(@PathVariable("postNo")int postNo){
		postService.incrementViewCount(postNo);
		return ResponseEntity.ok().build();
	}
	//공지사항 글쓰기
	 @PostMapping("/writeCompleted")
	    public void writeCompleted(@RequestBody Post post) {
		 System.out.println("55555555555");
	        postService.writeCompleted(post);
	    }
	 //공지사항 수정하기
	 @PutMapping("/boardEdit/{postNo}")
	public void boardUpdate(@PathVariable("postNo")int postNo,@RequestBody Post post) {
		 post.setPostNo(postNo); //수정하려는 게시글 번호 설정
		log.info("수정되었습니다.", postNo);
		 postService.boardUpdate(post);
	 }
	 
	 //공지사항 삭제하기
	@DeleteMapping("/post/{postNo}")
	public int postDelete(@PathVariable("postNo") int postNo) {
		log.info("공지사항 삭제되었어요:" + postNo);
		return postService.postDelete(postNo);
	}
}
