package com.six.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.six.dto.Item;

@Mapper
public interface ItemMapper {

	List<Item> itemAllList();
}
