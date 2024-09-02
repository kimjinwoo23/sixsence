package com.six.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommentMypage {
	private int score;
	private String text; 
	private int coid;
	private String movieImage;
}