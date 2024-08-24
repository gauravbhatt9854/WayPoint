import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LogButton";
const Login = () => {
  return (
    <div className="w-screen h-50 border-green-500  border-2 p-5">
      <LoginButton></LoginButton>
    </div>
  );
};

export default Login;
