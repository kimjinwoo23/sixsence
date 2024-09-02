package com.six.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.six.dto.Itempay;
import com.six.mapper.ItempayMapper;

@Service
public class ItempayServiceImpl implements ItempayService {

	@Autowired
	private ItempayMapper itempayMapper;

	@Autowired
	private JavaMailSender mailSender;

	@Override
	public void insertItempay(Itempay itempay) {
		System.out.println("itempay service : " + itempay);
		itempayMapper.insertItempay(itempay);
	}

	@Override
	public void sendPaymentConfirmationEmail(String email, String buyer, String date, String itemName, int price, int point, int receipt) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(email);
		message.setSubject("결제 확인 메일");

		String emailContent = String.format(
				"안녕하세요 %s님,\n\n" +
						"결제가 성공적으로 완료되었습니다.\n\n" +
						"결제 정보:\n" +
						"구매 영수증: %d\n" +
						"상품: %s\n" +
						"결제 금액: %d원\n" +
						"사용한 포인트: %d원\n" +
						"결제일자: %s\n\n" +
						"이용해주셔서 감사합니다.",
				buyer, receipt, itemName, price, point, date);

		message.setText(emailContent);
		mailSender.send(message);

	}
}
