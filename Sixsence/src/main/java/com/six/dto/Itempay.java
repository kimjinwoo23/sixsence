package com.six.dto;

import java.sql.Date;

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
public class Itempay {

    private int itempayNo;
    private int itemNo;
    private int memberNo;
    private Date itempayDate;
    private int itempayPrice;
    private int itempayCount;
    private String itempayBuyer;
    private String itempayEmail;
    private String itempayPointUse;
    private int itempayPoint;
    private String itempayRefund;
    private int itempayReceipt;

    private String itempayName;
}
