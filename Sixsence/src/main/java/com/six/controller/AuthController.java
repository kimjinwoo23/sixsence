package com.six.controller;

import com.six.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private EmailService emailService;
    // AuthController의 sendCode 메서드에서 EmailService의 sendSimpleMessage 메서드를 호출하여 인증 코드를 발송합니다.!!! 흐아..
    // 메모리에 저장된 인증 코드를 보관하는 컨테이너
    private Map<String, String> codeStore = new ConcurrentHashMap<>();

    // 인증 코드 발송
    @PostMapping("/send-code")
    public Map<String, String> sendCode(@RequestParam String email) {

        Map<String, String> response = new HashMap<>();
        try {
            // 인증 코드 생성
            String code = generateRandomCode();
            // 이메일로 발송
            emailService.sendSimpleMessage(email, code);
            System.out.println("11111111" + email + "*********" + code);
            // 인증 코드 저장 (메일 발송 후 일정 시간 동안만 유효하게 관리할 수 있음)
            codeStore.put(email, code);
            System.out.println("codeStore" + codeStore);
            // ** 8/12
            response.put("status", "success");
            response.put("message", "Code sent");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to send code: " + e.getMessage());
        }
        return response;
    }

    // 인증 코드 생성 메서드
    private String generateRandomCode() {
        Random rand = new Random();
        int code = rand.nextInt(999999);
        return String.format("%06d", code);
    }

    // 인증 코드 검증 메서드
    @PostMapping("/verify-code")
    public Map<String, String> verifyCode(@RequestParam("email") String email, @RequestParam("code") String code) {
        Map<String, String> response = new HashMap<>();
        String storedCode = codeStore.get(email);
        System.out.println("이메일: " + email + " - 제출된 코드: " + code);
        System.out.println("저장된 코드: " + codeStore);
        if (storedCode != null && storedCode.equals(code)) {
            response.put("memberEmail", email);
            System.out.println("제발 .. email : " + email); //!!!!! 들어온다..
            response.put("status", "success");
            response.put("message", "코드가 성공적으로 검증되었습니다.");
        } else {
            response.put("status", "error");
            response.put("message", "잘못된 코드입니다.");
        }
        return response;
    }

}