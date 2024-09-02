import { useState, useEffect, useContext } from 'react';
import axios from 'axios';


const useItemPayment = () => {
    const [paymentData, setPaymentData] = useState(null)
    console.log("12121 paymentData", paymentData)
    useEffect(()=> {
        console.log("hock paymentData", paymentData)
    }, [paymentData])
    

    return {
        paymentData,
        setPaymentData
    }
}
export default useItemPayment;