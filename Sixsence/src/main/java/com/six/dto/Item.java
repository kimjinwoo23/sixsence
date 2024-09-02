package com.six.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Item {

    private int itemNo;
    private String itemImage;
    private String itemName;
    private String itemPackage;
    private int itemPrice;
    private String itemDes;
    private int itemType;
}
