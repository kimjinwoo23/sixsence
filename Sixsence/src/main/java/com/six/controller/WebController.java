package com.six.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
// html 파일이 index.html 파일 하나이기 때문에 이 파일만 본다는 설정

@Controller
public class WebController {

    @GetMapping(value =  {"", "/notice","/list", "/introduce", "/smallbus", "/limousine", "/bigbus", "/request", "/search", "/search/my"})
    public String forward() {
        return "forward:/index.html";
    }
}