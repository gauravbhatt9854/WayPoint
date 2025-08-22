import { lazy } from "react";
import "./App.css";
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
const Home = lazy(() => import("../components/Home"));
const Login = lazy(() => import("../components/LoginPage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export { App };