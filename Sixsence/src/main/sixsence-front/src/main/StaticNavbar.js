import React from 'react';
import { Link } from "react-router-dom";
import "./css/StaticNavbar.css"; // 새로운 스타일 시트

function StaticNavbar() {
  return (
    <div className="static-all">
      <nav className="static-sor">
        <Link to="/Moviechart" className="static staticmovie">영화</Link>
        <Link to="/Movieboard-app" className="static staticbooking">예매</Link>
        <div className="staticone staticbrand">
          <Link to="/">Sixsence</Link>
        </div>
        <Link to="/store" className="static staticstore">스토어</Link>
        <Link to="/CustomerBoard" className="static staticborder">고객센터</Link>
      </nav>
    </div>
  );
}

export default StaticNavbar;