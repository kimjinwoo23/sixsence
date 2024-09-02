package com.six.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.six.dto.Cart;
import com.six.mapper.CartMapper;

@Service
public class CartServiceImpl implements CartService {

	@Autowired
	private CartMapper cartMapper;

	@Override
	public void insertCart(Cart cart) {
		cartMapper.insertCart(cart);
	};

	@Override
	public List<Cart> getUserCartItems(int memberNo) {
		System.out.println("memberNo2222 : " + memberNo);
		return cartMapper.getUserCartItems(memberNo);
	}

	@Override
	/*
	public void updateCartItem(int shoppingNo, int shoppingCount, int shoppingPrice) {
		cartMapper.updateCartItem(shoppingNo, shoppingCount, shoppingPrice);
	}
	*/
	public void updateCartItem(Cart cart) {
		//cartMapper.updateCartItem(shoppingNo, shoppingCount, shoppingPrice);
		cartMapper.updateCartItem(cart);
	}

	public void deleteCartItem(int shoppingNo) {
		cartMapper.deleteCartItem(shoppingNo);
	}
}
