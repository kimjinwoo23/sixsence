package com.six.service;

import com.six.dto.Member;

import java.util.Map;

public interface MemberService {

    public int memberSignUp (Member member);

    public int memberIdCheck(String memberId);
    
    public int memberEmailCheck(String memberEmail);

    public Map<String, Object> memberLogin(Member member);

    public Member registerCheck(Member member);

    public Member memberIdFind(Member member);

    public Member memberInfoFind(Member member);

    public boolean updatePassword(Member member);

    void updatePoint(int memberNo, int memberPoint);
}
