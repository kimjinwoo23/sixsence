package com.six.controller;

import com.six.dto.Member;
import com.six.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/memberSignUp")
    public int memberInsert(@RequestBody Member member) {
        return memberService.memberSignUp(member);
    }

    @GetMapping("/memberIdCheck")
    public int memberIdCheck(@RequestParam("id") String memberId) {
        System.out.println("************************" + memberId);
        return memberService.memberIdCheck(memberId);
    }

    @PostMapping("/memberEmailCheck")
    public int memberEmailCheck(@RequestParam("email") String memberEmail){
        return memberService.memberEmailCheck(memberEmail);
    }

    @PostMapping("/member-Login")
    public Map<String, Object> memberLogin(@RequestBody Member member) {
        log.info("member : " + member);
        Map<String, Object> response = memberService.memberLogin(member);
        log.info("response member : " + response);
        return response;//memberService.memberLogin(member);
    }

    @PostMapping("/register-check")
    public ResponseEntity<Member> registerCheck(@RequestBody Member member) {
        log.info("@@@@@@@@@@@@" + member);
        return ResponseEntity.ok(memberService.registerCheck(member));
    }

    @PostMapping("/memberId-Find")
    public ResponseEntity<Member> memberIdFind(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.memberIdFind(member));
    }

    @PostMapping("/memberInfo-Find")
    public ResponseEntity<Member> memberInfoFind(@RequestBody Member member) {
        log.info("***************" + member);
        return ResponseEntity.ok(memberService.memberInfoFind(member));
    }

    @PostMapping("/change-password")
    public boolean updatePassword(@RequestBody Member member) {
        try {
            // 비밀번호
            boolean success = memberService.updatePassword(member);

            // 비밀번호 변경 성공 여부반환하겠다.
            return success;
        } catch (Exception e) {
            // 예외 발생 시 false 반환
            e.printStackTrace();
            return false;
        }
    }
 // 포인트 업데이트
    @PutMapping("/member-point-update")
    public ResponseEntity<String> updatePoint (@RequestParam("memberNo") int memberNo,
    								@RequestParam("memberPoint") int memberPoint) {
    	System.out.println("memberNo" + memberNo);
    	System.out.println("memberPoint" + memberPoint);
    	memberService.updatePoint(memberNo, memberPoint);
    	return ResponseEntity.ok("포인트 변경");
    }

}
