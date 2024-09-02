import React, {useEffect, useState} from "react";
import { Link, useLocation } from 'react-router-dom';
import "./MypageCss.css";

const MypageNavbar = () => {

    const mypageMenu = [
        {name : '회원정보변경', path : '/mypageMain/memberInfoEdit'},
        {name : '예매내역', path : '/mypageMain/reservation'},
        {name : '구매내역', path : '/mypageMain/bought'},
        {name : '취소내역', path : '/mypageMain/refund'},
        {name : '한줄평', path : '/mypageMain/comment'},
        {name : '1:1문의내역', path : '/mypageMain/OBO'},
        {name : '회원탈퇴', path : '/mypageMain/deleteAccount'}
    ];

    const location = useLocation();
    const [select, setSelect] = useState('');

    const handleSelect = (index) => {
        setSelect(index);
        sessionStorage.setItem("selMypageNav", index);
    }

    useEffect(() => {
        if(location.pathname.startsWith('/mypageMain') && location.pathname !== "/mypageMain") {
            const savedIndex = sessionStorage.getItem("selMypageNav");
            if(savedIndex !== null){
                setSelect(Number(savedIndex));
            }
        } else {
            sessionStorage.removeItem("selMypageNav");
            setSelect('');
        }
    },[location.pathname])
    
    return (
        <nav className="mypageNav">
            <ul>
                {mypageMenu.map((list, index)=> (
                    <li key={index}>
                        <Link to={list.path} className={index === select ? 'active':''}
                        onClick={() => {handleSelect(index)}} >{list.name} 
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default MypageNavbar;
