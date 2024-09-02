package com.six.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Movie;
import com.six.service.MovieService;

@RestController
@RequestMapping("/api/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/allMovie")
    public List<Movie> getAllMovie(){
    	return movieService.getAllMovie();
    }
    
    @GetMapping("/selectMovie")
    public List<Movie> findAll(@RequestParam("movieNo") int movieNo){
    	return movieService.findAll(movieNo);
    }
}