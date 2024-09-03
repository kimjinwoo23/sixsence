import React, { useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route ,useLocation} from 'react-router-dom';
import './App.css';

//김진우
import MovieDetail from './main/MovieDetail';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MainNavbar from './main/MainNavbar';
import Home from './main/Home';
import StaticNavbar from './main/StaticNavbar'; // 정적인 네비게이션 바
import Footer from './main/Footer';


//조원기
import PaymentFailPage from './moviechart/toss/PaymentFailPage';
import PaymentCheckoutPage from './moviechart/toss/PaymentCheckoutPage';
import Booking from './moviechart/Movieboard-app/Booking';
import MovieChart from "./moviechart/Moviechart/Moviechart.js";
import PaymentSuccessPage from "./moviechart/toss/PaymentSuccessPage.js";

//차명준
import MemberLogin from './login/MemberLogin';
import MemberSignUp from './login/MemberSignUp';
import RegisterCheck from './login/RegisterCheck';
import MemberIdFind from './login/MemberIdFind';
import MemberPwFind from './login/MemberPwFind';
import MemberPwChange from './login/MemberPwChange';
import LoginContext from './login/LoginContext';
import './css/Login.css';

//오재진
import Items from './store/Items';
import ItemDetail from './store/ItemDetail';
import ItemPurchase from './store/ItemPurchase';
import Cart from './store/Cart';
import { ItemPaymentCheckoutPage } from './store/payment/ItemPaymentCheckoutPage';
import ItemPaymentFailPage from './store/payment/ItemPaymentFailPage';
import ItemPaymentSuccessPage from './store/payment/ItemPaymentSuccessPage';
import ItemPaymentComplete from './store/ItemPaymentComplete';

//정상준
import MypageMain from './mypage/MypageMain';
import MypageEditMember from './mypage/MypageEditMember';
import MypageReservation from './mypage/MypageReservation';
import MypageBought from './mypage/MypageBought';
import MypageRefund from './mypage/MypageRefund';
import MypageObo from './mypage/MypageObo';
import MypageDeleteAccount from './mypage/MypageDeleteAccount';
import MypageComment from './mypage/MypageComment';

//한진화
import CustomerBoard from './board/CustomerBoard';
import NoticeWrite from './board/NoticeWrite';
import NoticeView from './board/NoticeView';
import CustomerAsked from './board/CustomerAsked';
import CustomerObo from './board/CustomerObo';
import CustomerPromise from './board/CustomerPromise';
import AdminObo from './board/AdminObo';
import AdminAnswer from './board/AdminAnswer';


function AppContent() {
  const location = useLocation();
    const isMainPage = location.pathname === '/';

  const isAdmin = true;
  
    const [loginMember, setLoginMember] = useState(null);
    useEffect(() => {
      const savedMember = localStorage.getItem("loginMember");
      if(savedMember) {
        setLoginMember(JSON.parse(savedMember));
      }
    },[]);
  
    useEffect(() => {
      if(loginMember) {
        localStorage.setItem("loginMember", JSON.stringify(loginMember));
      }
    },[loginMember]);
  
  return (
    
    <div className="App">
       <LoginContext.Provider value = {{loginMember, setLoginMember}}>
{isMainPage ? <MainNavbar /> : <StaticNavbar />}


<Routes>
     
     <Route path="/"   element =  {   <Home />   } />
     <Route path="/movie/:movieNo" element={<MovieDetail />} />
     <Route path='/memberLogin'    element= { <MemberLogin />  } />
     <Route path='/registerCheck'  element= { <RegisterCheck /> } />
     <Route path='/memberSignup'   element= { <MemberSignUp /> } />
     <Route path='/memberIdFind'   element= { <MemberIdFind />} />
     <Route path='/passwordFind'   element= { <MemberPwFind />} />
     <Route path='/passwordChange' element= { <MemberPwChange />} />
     
     
     
    


     <Route path='/store' element={<Items />} />
     <Route path='/store/detail/:itemNo' element={<ItemDetail />} />
     <Route path='/store/purchase' element={<ItemPurchase />} />
     <Route path='/store/user-cart' element={<Cart />} />
     <Route path='/store/payment/checkout' element={<ItemPaymentCheckoutPage/>} />
     <Route path='/store/payment/success' element={<ItemPaymentSuccessPage />} />
     <Route path='/store/payment/fail' element={<ItemPaymentFailPage />} />
     <Route path='/store/payment/complete' element={<ItemPaymentComplete />} />
   
     <Route path="/MypageMain/*" element={<MypageMain />}>
       <Route path="memberInfoEdit" element={<MypageEditMember />} />
       <Route path="reservation" element={<MypageReservation />} />
       <Route path="bought" element={<MypageBought />} />
       <Route path="refund" element={<MypageRefund />} />
       <Route path="comment" element={<MypageComment />} />
       <Route path="OBO" element={<MypageObo />} />
       <Route path="deleteAccount" element={<MypageDeleteAccount />} />
      </Route>
       <Route path="/customerBoard" element={<CustomerBoard />} />
     <Route path="/NoticeView/:postNo" element={<NoticeView />} />
     <Route path="/customerAsked" element={<CustomerAsked />} />
     <Route path="/CustomerObo" element={<CustomerObo />} />
     <Route path="/AdminObo" element={<AdminObo />} />
     <Route path="/customerPromise" element={<CustomerPromise />} />
     <Route path="/noticeWrite" element={<NoticeWrite />} />
     <Route path="/AdminAnswer/:oboNo" element={<AdminAnswer />}/>

     <Route path="/Moviechart" element={<MovieChart />} />
         <Route path="/Movieboard-app" element={<Booking />} />
         <Route path="/payment/checkout" element={<PaymentCheckoutPage />} />
         <Route path="/payment/success" element={<PaymentSuccessPage />} />
         <Route path="/payment/fail" element={<PaymentFailPage />} />

      
  
</Routes>






</LoginContext.Provider>

  </div>
)
}
function App(){
return(
  <div>
<Router>
<AppContent />
</Router> 
<Footer />
</div>
);
}
export default App;