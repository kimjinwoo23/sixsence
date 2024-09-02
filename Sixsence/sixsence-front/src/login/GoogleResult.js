import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GoogleResult = ({ result }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (result) {
      // result가 있을 때만 navigate 호출
      navigate('/googleSignUp', { state: result });
    }
  }, [result, navigate]);

  if (!result) {
    return;
  }

  return (
    <Box>
      {/* <h2>Login Result</h2>
      <p>User ID: {result.userId}</p>
      <p>Email: {result.email}</p>
      <p>Name: {result.name}</p>
      <p>Access Token: {result.accessToken}</p> */}
    </Box>
  );
};

export default GoogleResult;