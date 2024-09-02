package com.six.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Cart {
	// 장바구니정보
	private int shoppingNo;
	private int itemNo;
	private int memberNo;
	private int shoppingCount;
	private int shoppingPrice;


	// 아이템정보
	private String itemImage;
	private String itemName;
	private String itemPackage;
	private int itemPrice;
}
