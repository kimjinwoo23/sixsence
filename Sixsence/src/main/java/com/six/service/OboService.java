package com.six.service;


import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.six.dto.Obo;


public interface OboService {
    //문의내용 저장하기
	 void insertObo(Obo obo);
	//문의내용 불러오기
	 List<Obo> getOboList();
	 // 특정문의내용 불러오기
	 Obo findOboList(@Param("oboNo") int oboNo);
	 // 문의내용 답변 등록하기
	 void registerAnswer(Obo obo);
	 // 문의내용 삭제하기
	 int oboDelete(int oboNo);
 }
