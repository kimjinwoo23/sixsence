package com.six.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Member;
import com.six.dto.Obo;
import com.six.service.OboService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j

public class OboController {
	
  @Autowired
  private OboService oboService;
  
  //문의내용 제출하기
  @PostMapping("/submitInquiry")
  public ResponseEntity<Void> insertObo(@RequestBody Obo obo){
	  oboService.insertObo(obo);
	  log.info("문의가 성공적으로 제출되었습니다:"+ obo);
	  return ResponseEntity.ok().build();
  }
  
  //문의내용 불러오기
  @GetMapping("/oboList")
  public List<Obo> getOboList(){
	    log.info("문의가 정상적으로 불러와졌습니다.");
	    return oboService.getOboList();
  }
  
  //특정문의내용 불러오기
  @GetMapping("/oboList/{oboNo}")
  public Obo findOboList(@PathVariable("oboNo")int oboNo) {
	  log.info("info message:" + oboNo);
	  return oboService.findOboList(oboNo);
  }
  
  //문의내용 답변 등록하기
  @PostMapping("/registerAnswer")
  public void registerAnswer(@RequestBody Obo obo) {
	  log.info("info message:" + obo);
	  oboService.registerAnswer(obo);
  }
  
  //문의 삭제하기
  @DeleteMapping("/obo/{oboNo}")
  public int oboDelete(@PathVariable("oboNo") int oboNo) {
	  log.info("deleteinfo message:" + oboNo);
	  return oboService.oboDelete(oboNo);
  }
  
}
  
  


