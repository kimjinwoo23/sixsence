package com.six.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.six.dto.Movie;

@Mapper
public interface Moviemapper {
	List<Movie> getAllMovie();
	List<Movie> findAll(int movieNo);
  
}