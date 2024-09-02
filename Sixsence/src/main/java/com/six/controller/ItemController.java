package com.six.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.six.dto.Item;
import com.six.service.ItemService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class ItemController {

	@Autowired
	private ItemService itemService;

	@GetMapping("/getitems")
	public List<Item> ItemAllList() {
		List<Item> items = itemService.itemAllList();

		// 로그로 아이템 리스트 확인
		for (Item item : items) {
			log.info("Item: {}", item);
		}

		return itemService.itemAllList();
	}

}
