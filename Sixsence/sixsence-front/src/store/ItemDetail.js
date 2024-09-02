import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart'; 
import ItemNavigationBar from './ItemNavigationBar';
import './Item.css';
import LoginContext from '../login/LoginContext';

const ItemDetail = () => {
    const { loginMember } = useContext(LoginContext);
    const location = useLocation(); 
    const { item } = location.state || {};
    const { addCartItem, cartItemCount } = useCart();
    const navigate = useNavigate();

    const [itemCount, setItemCount] = useState(1); // 아이템 수량
    const [sumPrice, setSumPrice] = useState(item.itemPrice); // 아이템 수량에 따른 가격

    // 수량 감소 버튼
    const decreasItemCount = () => {
        setItemCount(itemCount > 1 ? itemCount - 1 : 1);
    }

    // 수량 증가 버튼
    const increasItemCount = () => {
        setItemCount(itemCount < 9 ? itemCount + 1 : 9);
    }

    // 총금액 업데이트
    useEffect(() => {
        setSumPrice(item.itemPrice * itemCount);
    }, [itemCount, item.itemPrice]);

    // 구매하기
    const purchase = () => {
        
        if (!loginMember) { // 로그인 했을 때
            const shouldNavigate = window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
            if (shouldNavigate) { // 확인버튼
                navigate('/memberLogin');
                return;
            } else { // 취소버튼
                return
            }
        }

        // 구매하기 페이지로 이동 및 데이터 전송
        const purchaseData = {
            itemNo: item.itemNo,
            itemName: item.itemName,
            itemImage: item.itemImage,
            itemPackage: item.itemPackage,
            itemPrice: item.itemPrice,
            itemPayCount: itemCount,
            itemPayPrice: sumPrice
        };
        navigate('/store/purchase', { state: { items: [purchaseData] } });
    }

    return (
        <>
            <div className='item-nav'>
                <ItemNavigationBar cartItemCount={cartItemCount}/>
            </div>
            <div className='item-detail-container'>
                <section className='item-detail'>
                    <h1>{item.itemName}</h1>
                    <div className='item-detail-row'>
                        <div className='item-detail-image'>
                            <img src={item.itemImage} alt={item.itemName} />
                        </div>
                        <div className='item-detail-info'>
                            <div className='item-detail-text'>
                                <p><strong>금액</strong> : {item.itemPrice} 원</p>
                                <p><strong>구성품</strong> : {item.itemPackage}</p>
                                <p><strong>판매수량</strong> : 1회 9개 구매가능</p>
                                <p><strong>상품설명</strong> : {item.itemDes}</p>
                            </div>
                            <div className='item-detail-price'>
                                <div className='item-detail-price-button'>
                                    <strong>수 량</strong>
                                    <button type='button' onClick={decreasItemCount}>-</button>
                                    <input type='text' value={itemCount} readOnly/>
                                    <button type='button' onClick={increasItemCount}>+</button>
                                </div>
                                <div className='item-detail-price-text'>
                                    <p>총 가격 : {sumPrice}</p>
                                </div>
                            </div>
                            <div className='item-detail-button'>
                                <button onClick={() => addCartItem({ ...item, shoppingCount: itemCount, shoppingPrice: sumPrice })}>&#128722;</button>
                                {/* 
                                { ...item, shoppingCount: itemCount, shoppingPrice: sumPrice }
                                 기존 item 객체의 모든 속성에 shoppingCount, shoppingPrice 속성이 추가 */}
                                <button onClick={purchase}>구매하기</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default ItemDetail;
