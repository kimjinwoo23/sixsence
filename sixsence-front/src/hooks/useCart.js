import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LoginContext from '../login/LoginContext';
import { useNavigate } from 'react-router-dom';

const useCart = () => {
    const { loginMember } = useContext(LoginContext);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [cartItemCount, setCartItemCount] = useState(0);
    //sessionStorage.setItem('cartUpdated', cartItems.length);

    //console.log("cartItems!!!!!!!!! ", cartItems);

    useEffect(()=> {
        setCartItemCount(cartItems.length)
    }, [cartItems])

    // 서버에서 장바구니 데이터 가져오기
    const fetchCartItems = async () => {
        if (!loginMember) return;
        
        try {
            const response = await axios.get('/getusercart', { params: { memberNo: loginMember.memberNo } });
            setCartItems(response.data);
        } catch (error) {
            console.error('장바구니 데이터를 가져오는데 오류발생:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [loginMember]);

    // 서버에 장바구니 데이터 추가
    const addCartItem = async (item) => {
        if (!loginMember) { // 로그인 했을 때
            const shouldNavigate = window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
            if (shouldNavigate) { // 확인버튼
                navigate('/memberLogin');
                return;
            } else { // 취소버튼
                return
            }
        }

        // 기존데이터이 있는 아이템인지 확인
        const existingItem = cartItems.find(cartItem => cartItem.itemNo === item.itemNo);
        if (existingItem) {
            alert("이미 장바구니에 있는 상품입니다.");
            return;
        }

        const cartObj = {
            itemNo: item.itemNo,
            memberNo: loginMember.memberNo,
            shoppingCount: item.shoppingCount || 1, //item.shoppingCount 가 있으면 사용 없으면 1
            shoppingPrice: item.shoppingPrice || item.itemPrice //item.shoppingPrice 가 있으면 사용 없으면 item.itemPrice값 사용
        };

        try {
            await axios.post("/add-cart", cartObj, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            await fetchCartItems();
            alert("장바구니에 추가되었습니다.");
            //window.dispatchEvent(new Event('cartUpdated'));  // 이벤트 생성
        } catch (error) {
            console.error("장바구니 DB 추가 실패:", error);
        }
    };

    // 기존 장바구니 데이터 업데이트(수량, 가격)
    const updateCartItem = async (shoppingNo, quantity) => {
        //console.log("shoppingNo", shoppingNo)
        //console.log("cartItems", cartItems)
        if (quantity < 1 || quantity > 9) return;

        const updatedItem = cartItems.find(item => item.shoppingNo === shoppingNo);
        if (!updatedItem) return;

        try {
            await axios.put('/update-cart-item', { // 데이터 수정
                shoppingNo: shoppingNo,
                shoppingCount: quantity,
                shoppingPrice: updatedItem.itemPrice * quantity
            });
            // 상태변수를 사용하여 해당장바구니의 수량과 가격 업데이트
            // 기존 장바구니변수를 for루프를 item변수로 돌면서 해당 장바구니에 해당하면
            setCartItems(cartItems.map(item => 
                item.shoppingNo === shoppingNo ? 
                { ...item, shoppingCount: quantity, shoppingPrice: item.itemPrice * quantity } 
                : item
            ));
        } catch (error) {
            console.error('장바구니 업데이트 실패', error);
        }
    };

    const deleteCartItem = async (shoppingNo) => {
        //console.log("123123shoppingNo", shoppingNo);

        const deleteItem = cartItems.find(item => item.shoppingNo === shoppingNo);
        //console.log("deleteItem : ",deleteItem)
        if(!deleteItem) return;

        try {
            //await axios.delete('/delete-cart-item?shoppingNo='+shoppingNo);
            await axios.delete('/delete-cart-item', {
                params: {shoppingNo: shoppingNo}
            });
            setCartItems(cartItems.filter(item => item.shoppingNo !== shoppingNo));

            //window.dispatchEvent(new Event('cartUpdated'));  // 커스텀 이벤트 트리거
        } catch (error) {
            console.error('장바구니 아이템 삭제 실패:', error)
        }
        //console.log("cartItems!!!!!!!!!!!! ", cartItems);
    }

    const selectedDeleteCartItem = async (shoppingNoList) => {
        //console.log("shoppingNoList : ", shoppingNoList);

        try {
            /*
            shoppingNoList.forEach(async (shoppingNo) => {
                await axios.delete('/delete-cart-item', {
                    params: { shoppingNo }
                });
            });
            */
            // Promise.all을 사용하지 않으면 forEach문 활용
            // Promise.all 을 사용해 병렬로 삭제 요청을 보낼수 있음(비동기처리)
            // Promise.all 주로 배열을 인자로 받아서 인자로 받은 반복가능한 객체들을 순회하면서 비동기 작업들을 처리
            await Promise.all(shoppingNoList.map(shoppingNo => 
                axios.delete('/delete-cart-item', { params: { shoppingNo } })
            ));
            
            // shoppingNoList에 포함되지 않는 shoppingNo만 걸러서 cartitems에 담기
            setCartItems(cartItems.filter(item => !shoppingNoList.includes(item.shoppingNo)));

            alert("선택된 상품이 삭제되었습니다.");
        } catch (error) {
            console.error('선택된 아이템 삭제 실패', error);
        }
    }

    return {
        cartItems,
        addCartItem,
        updateCartItem,
        deleteCartItem,
        selectedDeleteCartItem,
        fetchCartItems,
        cartItemCount
    };
};

export default useCart;
