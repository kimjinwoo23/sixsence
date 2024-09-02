package com.six.service;

import java.util.List;

import com.six.dto.Itempay;

public interface ItempayService {
	// 결제정보 입력
	void insertItempay(Itempay itempay);
	//List<Itempay> insertItempay();

	// 결제확인 메일보내기
	void sendPaymentConfirmationEmail(String email, String buyer, String date, String itemName, int price, int point, int receipt);
}
