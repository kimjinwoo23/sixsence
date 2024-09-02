package com.six.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class EmailService {

    @Autowired
    //JavaMailSender 이메일 전송을 위한 인터페이스
    private JavaMailSender emailSender;
    // 로그인 성공 실패에 대한 로그를 기록한다.
    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    @Async
    // 비동기적으로 메일을 전송 to , subject, text를 담아서   간단한 텍스트 이메일 인증은 sendSimpleMessage만 사용해도 된다.
    public void sendSimpleMessage(String email, String code) {
        System.out.println("sendSimpleMessage: Email: " + email + ", Code: " + code);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your Authentication Code"); // 제목 설정
            message.setText("Your authentication code is: " + code); // 본문 내용 설정
            emailSender.send(message);
            logger.info("Email sent to: " + email);
        } catch (MailException e) {
            logger.log(Level.SEVERE, "Failed to send email to: " + email, e);
        }
    }

//    @Async
//    public void sendHtmlMessage(String email, String code, String htmlContent) {
//        try {
//            MimeMessage message = emailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//            helper.setTo(email);
//            helper.setSubject(code);
//            helper.setText(htmlContent, true); // true indicates it's HTML
//            emailSender.send(message);
//            logger.info("HTML email sent to: " + email);
//        } catch (MessagingException e) {
//            logger.log(Level.SEVERE, "Failed to send HTML email to: " + email, e);
//        }
//    }
}