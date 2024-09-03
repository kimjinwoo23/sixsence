import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/CustomerBoard.css';
import BoardNavBar from './BoardNavBar';
import LoginContext from '../login/LoginContext'; // 로그인 정보를 가져오는 컨텍스트

const CustomerBoard = () => {
  const { loginMember } = useContext(LoginContext);  // 로그인 정보 가져오기
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
//공지사항 게시물 불러오기
  useEffect(() => {
    axios.get("/api/board")
      .then(response => {
        console.log(response);
        setData(response.data); //서버로부터 받은 데이터를 'setData'로 저장
      })
      .catch(error => {
        console.log("Error", error);
      });
  }, []);

  // 페이지 번호를 변경하는 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 조회수 증가시키는 함수
  const incrementViewCount = (postNo) => {
    // axios 조회수 증가 요청 보냄
    axios.post(`/api/board/incrementViewCount/${postNo}`)
      .then(response => {
        if (response.data.success) {
          setData(prevData =>
            prevData.map(item =>
              item.post_no === postNo ? { ...item, postCount: item.postCount + 1 } : item
            )
          );
        }
      })
      .catch(error => {
        console.error('에러가발생했습니다.', error);
      });
  };

  // 검색하는 함수
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = data.filter(item =>
    item.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지 네이션 함수
  const lastItemIndex = currentPage * itemPerPage;
  const firstItemIndex = lastItemIndex - itemPerPage;
  const currentItems = filteredItems.slice(firstItemIndex, lastItemIndex);

  // 관리자 권한 확인 (member_no가 1인 경우)
  const isAdmin = loginMember && loginMember.memberNo === 1;

  return (
    <div className='customer-container mt-4'>
      <BoardNavBar />
      <h2 className='text-center mb-4'>공지사항</h2>
      <div className='top-bar'>
        <input type='text' placeholder='검색어를 입력하세요'
          value={searchTerm}
          onChange={handleSearch} className='search-box' />
        {isAdmin ? (
          <Link to="/NoticeWrite" className='bbb1 write-button'>글쓰기</Link>
        ) : null}
      </div>
      <div className='table-responsive'>
        <table className='tablee table-hover'>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>조회수</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.postNo}>
                <td>{item.postNo}</td>
                <td>
                  <Link to={`/noticeView/${item.postNo}`} onClick={() => incrementViewCount(item.postNo)}>
                    {item.postTitle}
                  </Link>
                </td>
                <td>{item.postCount}</td>
                <td>{item.postCreateDate}</td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>
      {/* 페이지네이션 작동기능 */}
      <Pagination
        itemPerPage={itemPerPage}
        totalItems={filteredItems.length}
        paginate={paginate}
        currentPage={currentPage} />
    </div>

  );
};

// 페이지네이션 정의
const Pagination = ({ itemPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {/*페이지 10페이지 까지만 보여주고 */}
        {/*<< 화살표 이용해서 이전으로 기능 만들기 */}
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={(e) => { e.preventDefault(); paginate(number); }} href="!#" className='page-link'>
              {number}
             
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
};

export default CustomerBoard;