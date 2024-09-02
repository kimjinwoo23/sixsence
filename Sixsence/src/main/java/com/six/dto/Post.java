package com.six.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {
  private int postNo;
  private String postTitle;
  private String postContent;;
  private int postCount;
  private String postCreateDate;
}
