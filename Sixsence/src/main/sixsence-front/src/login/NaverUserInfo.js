import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(""); // 비밀번호 상태 추가
  const [error, setError] = useState(""); // 에러 상태 추가

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      axios.get(`/userinfo?access_token=${accessToken}`)
        .then(response => {
          setUserInfo(response.data);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          setError("정보를 가져오지 못했습니다.");
        });
    } else {
      setLoading(false);
      setError("액세스 토큰이 없습니다.");
    }
  }, [location.search]);

  if (loading) {
    return <div>데이터 정보 가져오는 중...</div>;
  }

  return (
    <>
      <h1>유저정보</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userInfo ? (
        <div>
          <input type="text" value={userInfo.response.id} disabled />
          <input type="email" value={userInfo.response.email} disabled />
          <input type="text" value={userInfo.response.nickname} disabled />
          <input type="text" value={userInfo.response.name} disabled />
          <input type="text" value={userInfo.response.gender} disabled />
          <img src={userInfo.response.profile_image} alt="Profile" />
        </div>
      ) : (
        <p>유저를 찾을 수 없습니다.</p>
      )}

      <div>
        
      </div>
    </>
  );
}

export default UserInfo;