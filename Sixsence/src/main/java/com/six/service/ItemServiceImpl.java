package com.six.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.six.dto.Item;
import com.six.mapper.ItemMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ItemServiceImpl implements ItemService {

	@Autowired
	private ItemMapper itemMapper;

	@Override
	public List<Item> itemAllList() {
		List<Item> items = itemMapper.itemAllList();
		log.info("Items from DB: {}", items);
		//return itemMapper.ItemAllList();
		return items;
	}
}
