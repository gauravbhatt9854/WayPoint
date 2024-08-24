import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LogButton";
const Login = () => {
  return (
    <div className="w-screen h-16 border-green-200  border-2 overflow-scroll ">
      <LoginButton></LoginButton>
    </div>
  );
};

export default Login;
