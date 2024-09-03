import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import useCart from '../hooks/useCart'; 
import ItemNavigationBar from './ItemNavigationBar';
import './Item.css';
import LoginContext from '../login/LoginContext';

const Items = () => {
    const { loginMember } = useContext(LoginContext);
    const [items, setItems] = useState([]);
    const { addCartItem, cartItemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const itemType = queryParams.get('itemType');

    useEffect(() => {
        axios.get('/getitems') 
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            console.log("에러발생 : " + error);
        });
    }, []);

    //const filteredItems = itemType ? items.filter(item => item.itemType == itemType) : items;
    const filteredItems = itemType ? items.filter(item => itemType.includes(item.itemType)) : items;

    const ItemClick = (item) => {
        navigate(`/store/detail/${item.itemNo}`, { state: { item } });
    }

    const purchase = (item) => {
        if (!loginMember) {
            const shouldNavigate = window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
            if (shouldNavigate) {
                navigate('/memberLogin');
                return;
            } else {
                return;
            }
        }

        const purchaseData = {
            itemNo: item.itemNo,
            itemName: item.itemName,
            itemImage: item.itemImage,
            itemPackage: item.itemPackage,
            itemPrice: item.itemPrice,
            itemPayCount: 1,
            itemPayPrice: item.itemPrice
        };
        navigate('/store/purchase', { state: { items: [purchaseData] } });
    }

    return (
        <>
            <div className='item-nav'>
                <ItemNavigationBar cartItemCount={cartItemCount} />
            </div>
            <div className='item-container'>
                {filteredItems.map((item) => (
                    <div key={item.itemNo} className='item-box'>
                        <div onClick={() => ItemClick(item)}>
                            <img src={item.itemImage} className='item-image' alt={item.itemName}/>
                            <h2 className='item-name'>{item.itemName}</h2>
                            <p className='item-package'>{item.itemPackage}</p>
                            <p className='item-price'>{item.itemPrice} 원</p>
                        </div>
                        <div className='item-actions'>
                            <button className='item-cart-button' onClick={() => addCartItem(item)}>&#128722;</button>
                            <button className='item-buy-button' onClick={() => purchase(item)}>구매하기</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Items;
