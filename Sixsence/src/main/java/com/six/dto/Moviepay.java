package com.six.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Moviepay {
	private int moviepayNo;
	private int moviepayAdult;
	private int moviepayChild;
	private int moviepayAdultpay;
	private int moviepayChildpay;
	private int moviepayPrice;
	private String moviepaySeat;
	private String moviepayPaydate;
	private String moviepayPointUse;
	private int moviepayPoint;
	private String moviepayRefund;
	private String moviepayViewdate;
	private String moviepayViewtime;
	private int movieNo;
	private int memberNo;
	private String moviepayViewregion;
	private String movieTitle;
}