import React, { useContext, useEffect, useState } from 'react';
import ItemNavigationBar from './ItemNavigationBar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginContext from '../login/LoginContext';
import axios from 'axios';
import useCart from '../hooks/useCart';
import './Item.css'

const ItemPaymentComplete = () => {
    //const { deleteCartItem } = useCart();
    const { loginMember, setLoginMember } = useContext(LoginContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentInfo } = location.state || {};
    const [receiptNumber, setReceiptNumber] = useState(null);
    //const [receiptNumber, setReceiptNumber] = useState(0);
    
    //console.log("paymentInfo", paymentInfo)
    //console.log("loginMember", loginMember)
    //console.log("shoppingNo", paymentInfo.items.shoppingNo)

    /* -> 새로고침하면 DB에 계속 들어감*/
    useEffect(()=> {
        if(loginMember && (paymentInfo.itempay_point_use ==="Y")) {
            memberPointUpdate()
        }
    },[])

    useEffect(()=> {
        //deleteItem()
        deleteCartItem()
    }, [])

    useEffect(()=> {
        //console.log(sessionStorage.getItem('paymentCompleted'))
        if (sessionStorage.getItem('paymentCompleted')) {
            return
        }
        addPaymentInfo();
        sessionStorage.setItem('paymentCompleted', true);
    }, [])
    

    /*
    useEffect(() => {
        if (sessionStorage.getItem('paymentCompleted')) {
            // 이미 결제 정보가 저장된 경우, 다른 페이지로 리다이렉트
            //navigate('/some-other-page');
            return;
        }

        if (loginMember && paymentInfo) {
            if (paymentInfo.itempay_point_use === "Y") {
                memberPointUpdate();
            }
            deleteCartItem();
            addPaymentInfo();
            sessionStorage.setItem('paymentCompleted', 'true');  // 플래그 설정
        }
    }, [loginMember, paymentInfo]);
    */



    /*
    useEffect(()=> {
        setReceiptNumber(Math.floor(Math.random() * 100000000));
    },[])
    */
    // 포인트업데이트
    const memberPointUpdate = async () => {
        if (!loginMember || !paymentInfo) return;
        const updatedPoint = Number(loginMember.memberPoint) - Number(paymentInfo.itempay_point)
        //console.log(updatedPoint);
        await axios.put("/member-point-update",null, {
            params: {
                memberNo: paymentInfo.memberNo,
                memberPoint: updatedPoint
            }
        })
        .then((response) => {
            console.log("asdfasdfasdfasd",response);
        })
        .catch((error) => {
            console.log("오류발생")
        })
        // 로그인한 아이디의 포인트값 변경
        setLoginMember({
            ...loginMember,
            memberPoint: updatedPoint,
        });

        console.log("포인트 업데이트 완료", loginMember);
    }

    // 장바구니를 통해 결제 했을 때 해당 장바구니 목록 삭제
    /*
    const deleteItem = async () => {
        
        if(!paymentInfo.items[0].shoppingNo) {
            console.log("99999999999999999")
        } else {
            console.log('444444444444444')
        }
        
        paymentInfo.items.forEach((item) => {
            console.log("12312313",item.shoppingNo)
            if(item.shoppingNo) {// 장바구니에 있는 항목이면
                console.log(item.shoppingNo)
                deleteCartItem(item.shoppingNo);
            } else {
                console.log("장바구니에 없는 상품")
            }
            
        });
    }
    */
    const deleteCartItem = async () => {
        if (!paymentInfo || !paymentInfo.items) {
            console.log("paymentInfo나 items가 없습니다.");
            return;
        }
    
        paymentInfo.items.forEach(async (item) => {
            if (item.shoppingNo) {
                //console.log('shoppingNo', item.shoppingNo);
                await axios.delete('/delete-cart-item', {
                    params: {shoppingNo: item.shoppingNo}
                })
                .then((response) => {
                    console.log("해당아이템이 장바구니에서 삭제되었습니다.")
                })
                .catch((error) => {
                    console.log("해당아이템이 장바구니에서 삭제중 오류발생")
                })
            } else {
                console.log(`shoppingNo가 없습니다. item = ${item}`);
            }
        });
    };

    // 결제정보 입력
    const addPaymentInfo = async () => {
        //console.log("너 왜 두번이나 호출되니?????????")
        //index.js에서 React.StrictMode 삭제 
        //두 번 호출: React.StrictMode에서는 useEffect와 같은 훅이 두 번 호출될 수 있음
        
        // 결제영수증번호 랜덤숫자
        const receiptNumber = Math.floor(Math.random() * 100000000);
        setReceiptNumber(receiptNumber);
        //console.log("receiptNumber ",receiptNumber);

        if (!paymentInfo || !paymentInfo.items) {
            console.log("paymentInfo나 items가 없습니다.");
            return;
        }

        let usePoint = Number(paymentInfo.itempay_point);
        paymentInfo.items.forEach(async (item) => {
            //console.log("item :", item)
            //console.log("paymentInfo", paymentInfo)
            
            const itemPaymentData = {
                itemNo: item.itemNo,
                memberNo: paymentInfo.memberNo,
                itempayPrice: ( Number(item.itemPayPrice) > usePoint ? Number(item.itemPayPrice) - usePoint : 0 ),
                itempayCount: item.itemCount,
                itempayBuyer: paymentInfo.itempay_buyer,
                itempayEmail: paymentInfo.itempay_email,
                //itempayPointUse: (usePoint > 0 ? "Y" : "N"),
                itempayPointUse: paymentInfo.itempay_point_use,
                itempayPoint: (usePoint >= Number(item.itemPayPrice) ? Number(item.itemPayPrice) : usePoint ),
                itempayRefund: "N",
                itempayReceipt: receiptNumber
            }

            usePoint = ((usePoint - Number(item.itemPayPrice)) < 0 ? 0 : usePoint - Number(item.itemPayPrice) );
            //console.log("!!!!!usePoint!!!!!",usePoint);
            
            await axios.post('/add-item-payment', itemPaymentData)
            .then((response) => {
                console.log("결제정보 DB등록 성공")
                //console.log("!!!itemPaymentData", itemPaymentData)
            })
            .catch((error) => {
                console.log("결제정보 DB")
            })
        })

    sendEmail(receiptNumber);

    }

    // 결제확인 메일 보내기
    // 필요정보 : 결제품목(아이템명(외 O개)), 구매자, 구매자메일, 구매금액, 사용포인트, 구매영수증번호, 구매일자
    const sendEmail = async (receiptNumber) => {
        //console.log("11111",receiptNumber)
        //console.log("22222",paymentInfo)
        //console.log("33333",loginMember)

        const paymentEmailInfo = {
            itempayName: (paymentInfo.items.length >1 ?
                 paymentInfo.items[0].itemName + " 외 " + (paymentInfo.items.length - 1) + " 건" 
                 : 
                 paymentInfo.items[0].itemName),
            itempayBuyer: paymentInfo.itempay_buyer,
            itempayEmail: paymentInfo.itempay_email,
            itempayPrice: paymentInfo.amount,
            itempayPoint: paymentInfo.itempay_point,
            itempayReceipt: receiptNumber,
            itempayDate: new Date().toISOString()
        }

        await axios.post("/send-email-paymentinfo", paymentEmailInfo)
        .then((response) => {
            console.log("결제확인 메일 전송완료")
        })
        .catch((error) => {
            console.log("결제확인 메일 전송실패")
        })
        
    }

    return (
        <div className="box_section" style={{ width: "600px" }}>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="Success" />
        <h2>결제를 완료했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>구매 영수증</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {receiptNumber}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>상품</b>
          </div>
          <div className="p-grid-col text--right" id="itemName">
            {(paymentInfo.items.length >1 ?
               paymentInfo.items[0].itemName + " 외 " + (paymentInfo.items.length - 1) + " 건" 
               : 
               paymentInfo.items[0].itemName)}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {paymentInfo.amount}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>사용한 포인트</b>
          </div>
          <div className="p-grid-col text--right" id="usingPoint">
            {paymentInfo.itempay_point}
          </div>
        </div>
        {/*
        <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
          <b>Response Data :</b>
          <div id="response" style={{ whiteSpace: "initial" }}>
            {}
          </div>
        </div>
         */}
        <div className='home-btn'>
            <button><Link to='/'>Home</Link></button>
        </div>
      </div>
    )
}
export default ItemPaymentComplete;