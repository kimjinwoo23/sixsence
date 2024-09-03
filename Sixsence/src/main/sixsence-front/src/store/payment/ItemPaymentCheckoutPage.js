import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './toss.css';
import axios from "axios";

const clientKey = "test_ck_26DlbXAaV01XDv0Gew4xrqY50Q9R"; // wg
//const clientKey = "test_ck_5OWRapdA8dqJN5YkmkBB3o1zEqZK"; //jj
const generateRandomString = () => window.btoa(Math.random().toString()).slice(0, 20);
const customerKey = generateRandomString();

export function ItemPaymentCheckoutPage() {
  const [payment, setPayment] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  //const { productName, finalPrice } = location.state; 
  const { itemPayInfo } = location.state || {};
  const [orderName, setOrderName] = useState("");
  //console.log("!!!!!!!!!!!!!itemPayInfo", itemPayInfo);
  sessionStorage.setItem('itemPaymentInfo', JSON.stringify(itemPayInfo));

  /*
  const test = () => {
    axios.post("/test", itemPayInfo)
    .then((response) => {
      console.log("등록");
    })
    .catch((error) => {
      console.log("실패");
    })
  }
  */
  const selectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  useEffect(()=> {
    //console.log("0000000000")
    if (itemPayInfo.items.length >1) {
      //console.log("11111111111")
      setOrderName(itemPayInfo.items[0].itemName + " 외 " + (itemPayInfo.items.length - 1) + " 건")
    } else {
      //console.log("2222222222")
      setOrderName(itemPayInfo.items[0].itemName)
    }
  }, [itemPayInfo])

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const payment = tossPayments.payment({
          customerKey,
        });
        setPayment(payment);
      } catch (error) {
        console.error("결제 정보를 불러오는 중 오류가 발생했습니다:", error);
      }
    }

    fetchPayment();
  }, []);

  const requestPayment = async () => {
    //console.log("window.location.origin : " + window.location.origin);
    //window.location.origin = http://localhost:3000
    try {
      const orderId = generateRandomString();
      //test();
      const response = await payment.requestPayment({
        method: selectedPaymentMethod,
        amount: {
          currency: "KRW",
          value: itemPayInfo.amount,
        },
        orderId,
        orderName: orderName,
        successUrl: window.location.origin + "/store/payment/success",
        failUrl: window.location.origin + "/store/payment/fail",
        customerEmail: itemPayInfo.itempay_email,
        customerName: itemPayInfo.itempay_buyer,
        customerMobilePhone: itemPayInfo.customerMobilePhone,
      });
      //test();
      //console.log(response);
      navigate('/payment/success', { state: { paymentInfo: itemPayInfo, response } });
      
    } catch (error) {
      console.error("결제 요청 중 오류가 발생했습니다:", error);
      
    }
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        <h1>일반 결제</h1>
        <div id="payment-method">
          {["CARD", "TRANSFER", "VIRTUAL_ACCOUNT", "MOBILE_PHONE", "CULTURE_GIFT_CERTIFICATE", "FOREIGN_EASY_PAY"].map((method) => (
            <button
              key={method}
              id={method}
              className={`button2 ${selectedPaymentMethod === method ? "active" : ""}`}
              onClick={() => selectPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>
        <button className="button" onClick={requestPayment}>
          결제하기
        </button>
      </div>
    </div>
  );
}

export default ItemPaymentCheckoutPage;
