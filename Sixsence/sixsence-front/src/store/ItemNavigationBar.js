import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import LoginContext from '../login/LoginContext';


//const ItemNavigationBar = () => {
const ItemNavigationBar = ({cartItemCount}) => {
    const { loginMember } = useContext(LoginContext);
    const navigate = useNavigate();
    const {cartItems} = useCart();
    const [itemCount, setItemCount] = useState(0);
    
    
    
    useEffect(()=> {
        setItemCount(cartItems.length);
    }, [loginMember, cartItems])
    
    /*
    useEffect(()=> {
        console.log("111111111")
        const handleCartUpdate = () => {
            console.log("2222222")
            setItemCount(cartItems.length);
        }
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [cartItems])
    
    const handleCartUpdate = () => {
        console.log("2222222")
        setItemCount(cartItems.length);
    }
    */
    const loginCheck = () => {
        if (!loginMember) {
            const shouldNavigate = window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
            if (shouldNavigate) {
                navigate('/memberLogin');
                return;
            } else {
                return;
            }
        } else {
            navigate('/store/user-cart');
        }
    }
    
    return (
        <nav className='item-nav'>
            <ul>
                <li><Link to="/store?itemType=1">콤보</Link></li>
                <li><Link to="/store?itemType=2">팝콘</Link></li>
                <li><Link to="/store?itemType=3">음료</Link></li>
                {/* <span class="badge bg-secondary">0</span></li>에 0 대신 변수값 넣어야 함 
                -> 로그인한 아이디의 장바구니 데이터들을 불러와 길이만큼 값을 나타냄 {로그인한아이디의cart길이} */}
                {/*<li><Link to="/store/user-cart">Cart</Link><span className="badge bg-secondary">{itemCount}</span></li>*/}
                <Link to="/store/user-cart"></Link>
                <li onClick={loginCheck}>Cart<span className="badge bg-secondary">{cartItemCount}</span></li>
                
            </ul>
        </nav>
    );
}

export default ItemNavigationBar;