package com.six.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ItempayMypage {
	private int itempayNo;
	private String itemImage; 
	private String itemName;
	private String itempayDate; 
	private int itempayPrice; 
	private int itempayCount; 
	private String itempayBuyer; 
	private String itempayEmail; 
	private int itempayReceipt;
	private int itempayPoint;
	private String itempayPointUse;
	private String memberGrade;
	private int memberNo;
}