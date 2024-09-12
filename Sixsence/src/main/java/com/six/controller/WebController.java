package com.six.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping(value = {"", "/", "/store/**", "/payment/**",
                        "/mypagemain/**", "/mypageMain/**",
                        "/moviechart/**", "/Moviechart/**", "/movie/**", "/Movieboard-app/**",
                        "/CustomerBoard/**", "/customerBoard/**", "/customerAsked/**", "/AdminObo/**", "/customerPromise/**", "/AdminAnswer/**", "/noticeView/**", "/CustomerObo",
                        "/memberLogin", "/memberIdFind", "/passwordFind", "/registerCheck"})
    public String forward() {
        return "forward:/index.html";
    }
}