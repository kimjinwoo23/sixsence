import React, { useEffect, useState } from 'react'
import ItemNavigationBar from './ItemNavigationBar';
import useCart from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import './Item.css';

const Cart = () => {
    const {cartItems, updateCartItem, deleteCartItem, selectedDeleteCartItem, cartItemCount} = useCart();
    const [checkItems, setCheckItems] = useState([]);
    const navigate = useNavigate();

    // 체크박스 단일 선택
    const handleSingleCheck = (checked, id) => {
        if(checked) { 
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckItems(prev => [...prev, id]);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckItems(checkItems.filter((el) => el !== id));
        }
        //console.log("checkItems : ", checkItems);
    }

    const handleAllCheck = (checked) => {
        if(checked) {
            // 전체 선택 클릭시 카트아이템의 모든 아이템을 담은 배열로 checkItems 상태 업데이트
            const idArray = [];
            cartItems.forEach((el) => idArray.push(el.shoppingNo));
            setCheckItems(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckItems([]);
        }
    }

    // 선택된 항목 삭제
    const handleDeleteSelectedItems = async () => {
        if(checkItems.length < 1) {
            alert("선택한 상품이 없습니다.");
            return;
        }
        await selectedDeleteCartItem(checkItems);
        setCheckItems([]); // 삭제 후 체크된 항목 초기화
    }

    // 구매하기
    const purchase = (cartItem) => {
        //console.log("asdfasdfasdf", cartItem)

        const purchaseData = {
            itemNo: cartItem.itemNo,
            itemName: cartItem.itemName,
            itemImage: cartItem.itemImage,
            itemPackage: cartItem.itemPackage,
            itemPrice: cartItem.itemPrice,
            itemPayCount: cartItem.shoppingCount,
            itemPayPrice: cartItem.shoppingPrice,
            shoppingNo: cartItem.shoppingNo
        };
        navigate('/store/purchase', { state: { items: [purchaseData] } });
    }

    // 선택한 상품 구매페이지로 이동
    const selectedPurchasCartItem = () => {
        if(checkItems.length < 1) {
            alert("선택한 상품이 없습니다.");
            return;
        }
        console.log("checkItems : ", checkItems);
        console.log("cartItems : ", cartItems);

        // cartItems에서 선택한 아이템들만 골라내기
        const selectedItems = cartItems.filter(item => checkItems.includes(item.shoppingNo));
        console.log("selectedItems : ", selectedItems);
        
        const purchaseData = selectedItems.map(cartItem => ({
            itemNo: cartItem.itemNo,
            itemName: cartItem.itemName,
            itemImage: cartItem.itemImage,
            itemPackage: cartItem.itemPackage,
            itemPrice: cartItem.itemPrice,
            itemPayCount: cartItem.shoppingCount,
            itemPayPrice: cartItem.shoppingPrice,
            shoppingNo: cartItem.shoppingNo
        }));

        navigate('/store/purchase', { state: { items: purchaseData } });
    }


    return (
        <>
        <ItemNavigationBar cartItemCount = {cartItemCount}/>
        <div className='item-cart-container'>
        <table>
            <thead>
                <tr>
                    <th>
                        <input type='checkbox' name='select-all' onChange={(e) => handleAllCheck(e.target.checked)}
                        checked={checkItems.length === cartItems.length} />
                    </th>
                    <th colSpan="2">상품명</th>
                    <th>판매금액</th>
                    <th>수량</th>
                    <th>구매금액</th>
                    <th>선택</th>
                </tr>
            </thead>
            <tbody>
                {cartItems.map((cartItem, index) => (
                    <tr key={index}>
                        <td>
                            <input type='checkbox' name={`select-${cartItem.shoppingNo}`}
                            onChange={(e) => handleSingleCheck(e.target.checked, cartItem.shoppingNo)}
                            checked={checkItems.includes(cartItem.shoppingNo)} />
                        </td>
                        <td><img src={cartItem.itemImage} alt={cartItem.itemName}></img></td>
                        <td>
                            <h5>{cartItem.itemName}</h5>
                            <p>{cartItem.itemPackage}</p>
                        </td>
                        <td>{cartItem.itemPrice}</td>
                        <td>
                            <input type='number'
                                value={cartItem.shoppingCount} 
                                min="1" max="9" 
                                onChange={(e) => updateCartItem(cartItem.shoppingNo, parseInt(e.target.value))}
                            />
                        </td>
                        <td>{cartItem.shoppingPrice}</td>
                        <td>
                            <button onClick={()=> deleteCartItem(cartItem.shoppingNo)}>삭제하기</button><br />
                            <button onClick={()=> purchase(cartItem)}>구매하기</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {/*<button onClick={()=> selectedDeleteCartItem(checkItems)}>선택상품 삭제 ({checkItems.length})</button>*/} 
        {/* 선택한 아이템을 삭제하고나서도 heckItems.length 값이 그대로 가지고 있음 -> state변수인 checkItems 가 Cart.js에 있으므로 삭제후 setCheckItems를 이용해 초기화 */}
        <div className='cart-item-button'>
            <button onClick={handleDeleteSelectedItems}>선택상품 삭제 ({checkItems.length})</button>
            <button onClick={()=> selectedPurchasCartItem()}>선택상품 구매</button>
        </div>
        </div>
        </>
    )
}
export default Cart;