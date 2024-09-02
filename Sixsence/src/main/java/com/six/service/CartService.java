package com.six.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.six.dto.Cart;

public interface CartService {

	void insertCart(Cart cart);

	List<Cart> getUserCartItems(int memberNo);

	//void updateCartItem(int shoppingNo, int shoppingCount, int shoppingPrice);
	void updateCartItem(Cart cart);

	void deleteCartItem(int shoppingNo);
}
