package com.six.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Movie {
	private int movieNo; 
	private String movieTitle; 
	private String movieGrade; 
	private String movieShowtime; 
	private String movieCast; 
	private String movieStory; 
	private String movieGenre; 
	private String movieImage; 
	private String movieDate;
}
