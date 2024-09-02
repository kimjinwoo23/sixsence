import React from "react";
import { Box, Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Google = ({ setLoginResult }) => {
  const googleSocialLogin = useGoogleLogin({
    scope: "email profile",
    onSuccess: async ({ code }) => {
      try {
        const response = await axios.post("http://localhost:666/auth/google/callback", { code });
        setLoginResult(response.data);
        console.log("r : ",response.data);
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    onError: (errorResponse) => {
      console.error("Error during login:", errorResponse);
    },
    flow: "auth-code",
  });

  return (
    <Box display="flex" justifyContent="center" alignItems="center" >
      <Button variant="contained" onClick={googleSocialLogin}>
        Google
      </Button>
    </Box>
  );
};

export default Google;
