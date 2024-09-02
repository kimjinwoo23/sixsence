import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Google from "./Google";
import GoogleResult from "./GoogleResult";

const GoogleLogin = () => {
  const [loginResult, setLoginResult] = useState(null);

  console.log("로그인결과 :", loginResult);
 
  return (
    <GoogleOAuthProvider clientId="459677771696-jvkvm5fcs52h2hklujt027qea2ugsolv.apps.googleusercontent.com">
      <Google setLoginResult={setLoginResult} />
      <GoogleResult result={loginResult} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLogin;
