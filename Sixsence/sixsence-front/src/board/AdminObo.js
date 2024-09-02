import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import '../css/AdminObo.css'

const AdminObo = () => {
  const [oboData, setOboData] = useState([]); // 문의 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [itemPerPage] = useState(6); // 페이지당 항목 수 설정

  useEffect(() => {
    axios.get("/api/oboList")
      .then(response => {
        setOboData(response.data);
        console.log("oboData:", oboData);
      }) 
      .catch(e => alert("에러가 발생하였습니다."));
  }, []);

  // 페이지 번호를 변경하는 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호 변경을 위한 함수

  // 페이지 네이션 함수
  const lastItemIndex = currentPage * itemPerPage; // 현재 페이지의 마지막 항목 인덱스 계산
  const firstItemIndex = lastItemIndex - itemPerPage; // 현재 페이지의 첫 번째 항목 인덱스 계산
  const currentItems = oboData.slice(firstItemIndex, lastItemIndex); // 현재 페이지에 해당하는 데이터만 추출

  return (
    <div className="container-admin">
      <h1>일대일문의 목록</h1>
      <button className="admin-button"><Link to={"/CustomerBoard"}>돌아가기</Link></button>
      <div className="admin-table-responsive">
        <table>
        <thead>
        <tr >
              <th>번호</th>
              <th>작성자</th>
              <th>영화관</th>
              <th>질문유형</th>
              <th>제목</th>
              <th>작성일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.oboNo}>
                <td>{item.oboNo}</td>
                <td>{item.memberName}</td>
                <td>{item.oboMovieType === 'gangnam' ? '강남' : item.oboMovieType === 'yeoksam' ? '역삼' : item.oboMovieType}</td>
                <td>{item.oboInquiryType === 'general' ? '일반문의' : item.oboInquiryType === 'technical' ? '기술문의' : item.oboInquiryType === 'payment' ? '결제문의' : item.oboInquiryType}</td>
                {/* 제목을 클릭하면 AdminAnswer 페이지로 이동 */}
                <td><Link to={`/AdminAnswer/${item.oboNo}`}>{item.oboTitle}</Link></td>
                <td>{item.oboCreateDate}</td>
                <td>{item.oboStatus === 'y' ? '답변완료' : item.oboStatus === 'n' ? '답변대기중':item.oboStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 페이지네이션 */}
      <Pagination
        itemPerPage={itemPerPage} // 페이지당 항목 수 전달
        totalItems={oboData.length} // 전체 항목 수 전달
        paginate={paginate} // 페이지 변경 함수 전달
        currentPage={currentPage} // 현재 페이지 전달
      />
    </div>
  );
};

// 페이지네이션 컴포넌트를 AdminObo 바깥으로 이동
const Pagination = ({ itemPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            {/* 페이지 번호 클릭 시 페이지 변경 함수 호출 */}
            <a onClick={(e) => { e.preventDefault(); paginate(number); }} href="!#" className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminObo;
