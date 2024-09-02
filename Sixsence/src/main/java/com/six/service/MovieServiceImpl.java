package com.six.service;

import com.six.dto.Movie;

import com.six.mapper.Moviemapper;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MovieServiceImpl implements MovieService {

	@Autowired
	private Moviemapper moviemapper;
	
	@Override
	public List<Movie> getAllMovie() {
		return moviemapper.getAllMovie();
	}
	
	@Override
	public List<Movie> findAll(int movieNo){
	return moviemapper.findAll(movieNo);
	}

}
