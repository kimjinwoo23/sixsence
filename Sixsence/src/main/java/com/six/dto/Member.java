package com.six.dto;

import lombok.*;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor

public class Member {

    private int memberNo;
    private String memberId;
    private String memberPw;
    private String memberPwCheck;
    private String memberName;
    private int memberAge;
    private String memberGender;
    private String memberBirth;
    private String memberEmail;
    private String memberAddress;
    private String memberPhone;
    private int memberPayCount; // 결제 횟수
    private String memberGrade;    // 회원 등급
    private int memberPoint;    // 회원 마일리지
}