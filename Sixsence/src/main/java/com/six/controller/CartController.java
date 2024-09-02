package com.six.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Cart;
import com.six.dto.Itempay;
import com.six.service.CartService;

@RestController
public class CartController {

	@Autowired
	private CartService cartService;

	@PostMapping("/add-cart")
	// ResponseEntity 스프링에서 HTTP 응답의 상태 코드, 헤더, body을 캡슐화하는데 사용
	public ResponseEntity<String> insertCart(@RequestBody Cart cart) {
		System.out.println("장바구니 추가 : " + cart);
		cartService.insertCart(cart);
		return ResponseEntity.ok("장바구니 DB 등록 성공");
	}

	@PostMapping("/test")
	public ResponseEntity<String> insertPayment(@RequestBody Itempay itempayment) {
		System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println(itempayment);
		return ResponseEntity.ok("");
	}

	@GetMapping("/getusercart")
	public ResponseEntity<List<Cart>> getUserCartItems(@RequestParam("memberNo") int memberNo) {
		System.out.println("memberNo : " + memberNo);
		List<Cart> cartItems = cartService.getUserCartItems(memberNo);
		System.out.println("cartItems : " + cartItems);
		return ResponseEntity.ok(cartItems);
	}

	@PutMapping("/update-cart-item")
	public ResponseEntity<String> updateCartItem(@RequestBody Cart cart) {
		System.out.println("cart !!!!!!! " + cart);
		// cartService.updateCartItem(cart);
		//cartService.updateCartItem(cart.getShoppingNo(), cart.getShoppingCount(), cart.getShoppingPrice());
		cartService.updateCartItem(cart);
		return ResponseEntity.ok("장바구니 DB 수정성공");
	}
	/*
	public ResponseEntity<String> updateCartItem(@RequestParam("shoppingNo") int shoppingNo,
												@RequestParam("shoppingCount") int shoppingCount,
												@RequestParam("shoppingPrice") int shoppingPrice) {
		//System.out.println("cart !!!!!!! " + cart);
		cartService.updateCartItem(shoppingNo, shoppingCount, shoppingPrice);
		return ResponseEntity.ok("장바구니 DB 수정성공");
	}
	*/

	@DeleteMapping("/delete-cart-item")
	public ResponseEntity<String> deleteCartItem(@RequestParam("shoppingNo") int shoppingNo) {
		System.out.println("shoppingNo !!!!!!! " + shoppingNo);
		cartService.deleteCartItem(shoppingNo);
		return ResponseEntity.ok("장바구니 DB 삭제성공");
	}

}
