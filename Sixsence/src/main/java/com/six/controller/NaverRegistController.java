package com.six.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Member;
import com.six.service.NaverUserService;

@RestController
public class NaverRegistController {

    @Autowired
    private NaverUserService naverUserService;

    @PostMapping("/naverAPI/register")
    public String insertNaverUser(@RequestBody Member member) {
        // DB에 React로 가져온 naverUser 정보를 큰 수정 없이 전체 다 넣겠다.
        naverUserService.insertNaverUser(member);

        return "Naver API를 활용한 회원가입 성공!";
    }
}