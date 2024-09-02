import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import ItemNavigationBar from './ItemNavigationBar';
import LoginContext from '../login/LoginContext';
import useItemPayment from '../hooks/useItemPayment';
// 장바구니쪽에서 넘어오는 데이터 1개 이상일 수 있으므로 list형태로 넣어야함
const ItemPurchase = () => {
    //const { paymentData, setPaymentData } = useItemPayment();
    const { loginMember } = useContext(LoginContext);
    //console.log("itempurchase login : ", loginMember);

    const location = useLocation();
    //const {itemNo, itemImage, itemName, itempayCount, itempayPrice} = location.state || {};
    const {items} = location.state || {item: []}; // cart에서 넘어온 데이터는 안에 shoppingNo가 존재함
    const navigate = useNavigate();

    const [orderUserName, setOrderUserName] = useState('');
    const [orderUserMail, setOrderUserMail] = useState('');
    const [userInfoChecked, setUserInfoChecked] = useState(false);

    const [usingPoint, setUsingPoint] = useState(0);
    const [usingAllPointChecked, setUsingAllPointChecked] = useState(false);

    const [totalPayment, setTotalPayment] = useState(0);

    //console.info("itempurchase!!!!!!!!!!!!!!!!!!!!!!!! : ", items);
    //console.info("itempurchase!!!!!!!!!!!!!!!!!!!!!!!! : ", items.length);
    /*
    console.info("itempurchase : ", itemNo);
    console.info("itempurchase : ", itemImage);
    console.info("itempurchase : ", itemName);
    console.info("itempurchase : ", itempayCount);
    console.info("itempurchase : ", itempayPrice);
    */

    // 총 상품금액 계산
    /*
    const itemPrices = items.map(item => item.itemPayPrice);

    let totalItemsPrice = 0;
    itemPrices.forEach(price => {
        totalItemsPrice += price;
    });
    */
    // reduce() : 배열의 각 요소를 순회하며 주어진 함수에 따라 배열을 하나의 값으로 줄이는 메서드
    // reduce()는 두개의 인자를 받음
    // acc : 누적값, item : items배열의 개별객체
    // 0은 acc 의 초기값
    const totalItemsPrice = items.reduce((acc, item) => acc + item.itemPayPrice, 0);

    useEffect (()=>{
        setTotalPayment(totalItemsPrice- usingPoint);
    }, [usingPoint, totalItemsPrice])

    const handleUserInfoChange = (e) => {
        const ischecked = e.target.checked;
        setUserInfoChecked(ischecked);
        setOrderUserName(ischecked ? loginMember.memberName : "");
        setOrderUserMail(ischecked ? loginMember.memberEmail : "");
    }

    const inputUsingPoint = (value) => {
        //console.log("totalItemsPrice",totalItemsPrice)
        if (Number(value) > Number(totalItemsPrice)) {
            setUsingPoint(totalItemsPrice)
        } else {
            setUsingPoint(Number(value) > Number(loginMember.memberPoint) ? Number(loginMember.memberPoint) : Number(value))
        }
        //setUsingPoint(Number(value) > Number(loginMember.memberPoint) ? Number(loginMember.memberPoint) : Number(value))
        /* 
        console.log("loginMember.memberPoint :", loginMember.memberPoint);
        console.log("value :", value);
        if(Number(value) > Number(loginMember.memberPoint)) {
            setUsingPoint(Number(loginMember.memberPoint));
        } else {
            setUsingPoint(Number(value));
        }
        */
    }

    const handleUseAllPointsChange = (e) => {
        const ischecked = e.target.checked;
        setUsingAllPointChecked(ischecked);
        //setUsingPoint(ischecked ? loginMember.memberPoint : 0);
        //setUsingPoint(ischecked ? loginMember.memberPoint || 0 : 0);
        if(ischecked && Number(loginMember.memberPoint) >  Number(totalItemsPrice) ) {
            setUsingPoint(totalItemsPrice)
        } else {
            setUsingPoint(ischecked ? loginMember.memberPoint || 0 : 0);
        }
        //setUsingPoint(ischecked ? loginMember.memberPoint || 0 : 0); // loginMember.memberPoint 이 null인 경우 0으로 처리
    }


    const clickedPayment = () => {
        if (!orderUserName || !orderUserMail) {
            alert('주문자 정보가 빠져있습니다.');
            return;
        }

        let phone = loginMember.memberPhone;
        let modifyPhone = phone.replace(/-/g,'');
        //console.log("modifyPhone",modifyPhone);
        
        //console.log("items!!!!!", items);
        const itemPaymentData = {
            amount: totalPayment,
            //orderName: 상품명,
            memberNo: loginMember.memberNo,
            itempay_buyer: orderUserName,
            itempay_email: orderUserMail,
            customerMobilePhone: modifyPhone,
            itempay_point_use: (usingPoint === 0) ? "N":"Y",
            itempay_point: usingPoint,
            items: items.map(item => ({
                itemNo: item.itemNo,
                itemName: item.itemName,
                itemCount: item.itemPayCount,
                itemPayPrice: item.itemPayPrice,
                shoppingNo: item.shoppingNo
            }))
        }

        //setPaymentData(itemPaymentData);
        //console.log("itemPaymentData", itemPaymentData);

        //navigate('/payment/checkout', {state: {itemPayInfo: itemPaymentData}});
        // 결제금액이 0원일경우 tosspay로 가지말고 바로 결제완료 페이지로 이동
        // 토스페이 결제금액이 0이면 오류발생
        sessionStorage.setItem('paymentCompleted', "");
        if (totalPayment == 0) {
            //console.log("000000000000000000000000")
            navigate('/store/payment/complete', {state: {paymentInfo: itemPaymentData}})
        } else {
            navigate('/store/payment/checkout', {state: {itemPayInfo: itemPaymentData}});
        }
    }

    return (
        <>
        <div className='item-nav'>
            <ItemNavigationBar />
        </div>
        <div className='item-payment-contain'>
            <div className='item-payment-order-info'>
                <h3>주문자 정보 확인</h3>
                
                    <label>이름</label>
                    <input type='text' id='order-name' value={orderUserName} 
                                                        required 
                                                        onChange={e=> {setOrderUserName(e.target.value)}}
                                                        disabled={userInfoChecked}></input>
                
                
                    <label>이메일</label>
                    <input type='email' id='order-email' value={orderUserMail} 
                                                        required 
                                                        onChange={e=> {setOrderUserMail(e.target.value)}}
                                                        disabled={userInfoChecked}></input>
                
                    <input type='checkbox' checked={userInfoChecked} onChange={handleUserInfoChange}></input> <label>주문자와 동일</label>
                    {/* input is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.
                    <input></input>사이에 값이 있으면 발생
                    */}
                
            </div>
            <div className='item-payment-item-info'>
                <h3>구매상품 정보</h3>
                <table>
                    {/* list를 for루프 돌려서  */}
                    <thead>
                        <tr>
                            <th colSpan="2">상품명</th>{/* 상품이미지 + 상품명 + 상품package */}
                            <th>판매금액</th>
                            <th>수량</th>
                            <th>구매금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.itemNo}>
                                <td><img src={item.itemImage}/></td>
                                <td>
                                    <h5>{item.itemName}</h5>
                                    <p>{item.itemPackage}</p>
                                </td>
                                <td>{item.itemPrice}</td>
                                <td>{item.itemPayCount}</td>
                                <td>{item.itemPayPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='item-payment-point-info'>
                <h3>포인트</h3>
                
                <label>사용할 포인트</label>
                {/*<input type='number' value={usingPoint} min={0} max={loginMember.memberPoint}  */}
                {/* loginMember.memberPoint의 값이 null 인 경우 처리 */}
                <input type='number' value={usingPoint} min={0} max={loginMember?.memberPoint ?? 0}  
                //onChange={(e) => inputUsingPoint(e.target.value)} 
                onChange={(e) => inputUsingPoint(e.target.value)} 
                disabled={usingAllPointChecked}/>
                
                <label>사용가능한 포인트</label>
                {/*<input type='number' value={loginMember.memberPoint} readOnly />*/}
                {/* loginMember.memberPoint의 값이 null 인 경우 처리 */}
                <input type='number' value={loginMember?.memberPoint ?? 0} readOnly /*value={로그인한유저테이블의point값} />*/ /> 
                
                
                {/* 체크되면 사용할 포인트에 사용가능한 값으로 넣어주기, 체크해제되면 input에 사용할 포인트 값 비워주기 */}
                {/*<input type='checkbox' onClick={AllUsingPoing}></input> <label>전체사용</label>*/}
                <input type='checkbox' checked={usingAllPointChecked} onChange={handleUseAllPointsChange} disabled={loginMember?.memberPoint === null || loginMember?.memberPoint === '0'}></input> <label>전체사용</label>
                
                
            </div>

            <div className='item-payment-pay-info'>
                <h3>결제금액</h3>
                <table>
                    <thead>
                        <tr>
                            <td>상품금액</td>
                            <td></td>
                            <td>할인금액</td>
                            <td></td>
                            <td>결제금액</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{totalItemsPrice}</td>
                            <td>-</td>
                            <td>{usingPoint}</td>
                            <td>=</td>
                            <td>{totalPayment}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* 
            <div className='item-payment-pay-method'>
                <h3>결제수단</h3>
            </div>
            */}
            <div className='item-payment-btn'>
                <button onClick={()=> clickedPayment()}>결제하기</button>
            </div>
        </div>
        </>
    )
}
export default ItemPurchase;