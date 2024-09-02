package com.six.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.six.dto.Post;
import com.six.mapper.PostMapper;

@Service
public class PostServiceImpl implements PostService {

	@Autowired
	private PostMapper postMapper;
   
	//게시물 불러오기
	@Override
	public List<Post> findAll() {
		
		return postMapper.findAll();
	}

	//특정게시물 불러오기
     @Override
    public Post findPostById(int postNo) {
    
    	return postMapper.findPostById(postNo);
    }
    //조회수 증가하기
     @Override
    public void incrementViewCount(int postNo) {
    	postMapper.incrementViewCount(postNo);
    	
    }
     //공지사항 작성하기
     @Override
    public void writeCompleted(Post post) {
    	postMapper.writeCompleted(post);
    	
     }
    // 공지사항 수정하기
     @Override
     public void boardUpdate(Post post) {
       postMapper.boardUpdate(post);
     }
     
    // 공지사항 삭제하기
     @Override
    public int postDelete(int postNo) {
    	 return postMapper.postDelete(postNo);
     }
   
}

