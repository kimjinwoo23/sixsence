package com.six.service;

import java.util.List;

import com.six.dto.Movie;

public interface MovieService {
	List<Movie> getAllMovie();
	List<Movie> findAll(int movieNo);
}