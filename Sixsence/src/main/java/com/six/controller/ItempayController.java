package com.six.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Itempay;
import com.six.service.ItempayService;

@RestController
public class ItempayController {
	@Autowired
	private ItempayService itempayService;

	// 결제정보저장
	@PostMapping("/add-item-payment")
	public ResponseEntity<String> insertItempay(@RequestBody Itempay itempay) {
		System.out.println("itempay "+ itempay);
		itempayService.insertItempay(itempay);
		return ResponseEntity.ok("결제정보저장");
	}

	// 결제확인 메일 보내기
	@PostMapping("/send-email-paymentinfo")
	public ResponseEntity<String> sendPaymentConfirmationEmail(@RequestBody Itempay emailInfo) {
		System.out.println("emailInfo "+ emailInfo);
		itempayService.sendPaymentConfirmationEmail(
				emailInfo.getItempayEmail(),
				emailInfo.getItempayBuyer(),
				emailInfo.getItempayDate().toString(),
				emailInfo.getItempayName(),
				emailInfo.getItempayPrice(),
				emailInfo.getItempayPoint(),
				emailInfo.getItempayReceipt()
		);
		return ResponseEntity.ok("메일발송 성공");
	}

}
