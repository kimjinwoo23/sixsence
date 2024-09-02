package com.six.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.six.dto.Obo;
import com.six.mapper.OboMapper;

@Service
public class OboServiceImpl implements OboService {
	
   @Autowired
   private OboMapper oboMapper;
   
  
   // 문의내용 저장하기
   @Override
   public void insertObo(Obo obo) {
	 oboMapper.insertObo(obo);
	 
   }
	 
  // 문의내용 불러오기
  @Override
  public List<Obo> getOboList() {
	return oboMapper.getOboList();
	
  }
  
  // 특정문의내용 불러오기
  @Override
	public Obo findOboList(int oboNo) {
		return oboMapper.findOboList(oboNo);
  }
  
  //문의내용 답변 등록하기
  @Override
	public void registerAnswer(Obo obo) {
		oboMapper.registerAnswer(obo);
		
	}
 
  //문의내용 삭제하기
  @Override
	public int oboDelete(int oboNo) {
		return oboMapper.oboDelete(oboNo);
	}
  
}

