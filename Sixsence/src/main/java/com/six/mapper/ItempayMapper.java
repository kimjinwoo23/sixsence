package com.six.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.six.dto.Itempay;

@Mapper
public interface ItempayMapper {

	void insertItempay(Itempay itempay);
	//List<Itempay> insertItempay();
}
