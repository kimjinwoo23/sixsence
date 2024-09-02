import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoginContext from "../../login/LoginContext";
import axios from "axios";
import '../Item.css';
// 1. 결제성공(단일품목) -> DB에 입력(상품번호, 회원번호, 결제일자, 결제금액, 상품수량, 구매자, 구매자메일, 
//                         마일리지사용여부, 마일리지사용금액, 환불여부, 결제영수증번호)
// 2. 결제성공(장바구니를 통한 아이템항목이 여러개)
// 3. 결제성공(장바구니를 통해 결제 -> 해당 상품 장바구니DB에서 삭제)
// 4. 결제시 포인트 사용했으면 member의 pooint값 수정
// 5. 구매자 이메일로 결제영수증보내기

function ItemPaymentSuccessPage() {
  const { loginMember, setLoginMember } = useContext(LoginContext);
  const location = useLocation();
  //const { paymentInfo } = location.state || {};
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const paymentInfo = JSON.parse(sessionStorage.getItem('itemPaymentInfo'));
  //const isRun = useRef(false);
  const [receiptNumber, setReceiptNumber] = useState(null);
  
  

  //console.log("!!!!!paymentInfo!!!!!!!",paymentInfo);
  //console.log("!!!!!loginMember!!!!!!!",loginMember);

  useEffect(() => {
    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
      };
    
      try {
        const response = await fetch("/confirm/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
    
        const responseText = await response.text();
        console.log('Raw Response:', responseText); 
    
        const json = JSON.parse(responseText);
        if (!response.ok) {
          throw { message: json.message, code: json.code };
        }
    
        return json;
      } catch (error) {
        console.error("Error during payment confirmation:", error);
        navigate(`/fail?code=${error.code}&message=${error.message}`);
      }
    }
    
  }, [searchParams]);

  /*
  useEffect(()=> {
    if(loginMember && (paymentInfo.itempay_point_use ==="Y")) {
      memberPointUpdate()
    }
  }, [])
  */
 /*
  useEffect(() => {
    if (loginMember && paymentInfo && !isRun.current) {
      memberPointUpdate();
      isRun.current = true; // isRun을 true로 설정하여 이후 실행 방지
    }
  }, [loginMember, paymentInfo]);
*/
  useEffect(()=> {
      //deleteItem()
      deleteCartItem()
  }, [])

  /*
  useEffect(()=> {
      addPaymentInfo()
  }, [])
  */
  useEffect(()=> {
    if(!loginMember) {
      return
    }

    //console.log(sessionStorage.getItem('paymentCompleted'))
    if (sessionStorage.getItem('paymentCompleted')) {
        return
    }

    //console.log("123123loginMember", loginMember)
    memberPointUpdate();

    addPaymentInfo();
    sessionStorage.setItem('paymentCompleted', true);
  }, [[loginMember, paymentInfo]])
  /*
  useEffect(()=> {
      setReceiptNumber(Math.floor(Math.random() * 100000000));
  },[])
  */
  // 포인트업데이트
  const memberPointUpdate = async () => {
    //console.log("포인트업데이트 실행")
      if (!loginMember || !paymentInfo) return;

      // 등급이 NEW 이면 포인트 적립금 5%, VIP 10%
      let gradePointRate =  (loginMember.memberGrade === "NEW" ? 0.05 : 0.1)
      console.log("gradePointRate", gradePointRate);

      //const updatedPoint = Number(loginMember.memberPoint) - Number(paymentInfo.itempay_point)
      
      let updatedPoint = 0;
      if(paymentInfo.itempay_point_use ==="Y") { // 포인트 사용양
          updatedPoint = Number(loginMember.memberPoint) - Number(paymentInfo.itempay_point)
      } else { // 포인트 사용안했을 때 적립
          updatedPoint = Number(loginMember.memberPoint) + (Number(paymentInfo.amount) * gradePointRate)
      }
      console.log("updatedPoint", updatedPoint);

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
      //console.log("포인트 업데이트 완료", loginMember);
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
          })
          .catch((error) => {
              console.log("결제정보 DB")
          })
      })

      sendEmail(receiptNumber);
  }

  const sendEmail = async (receiptNumber) => {

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
          {`${Number(searchParams.get("amount")).toLocaleString()}원`}
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
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
      */}
      <div className='home-btn'>
          <button><Link to='/'>Home</Link></button>
      </div>
    </div>
  );
}

export default ItemPaymentSuccessPage;