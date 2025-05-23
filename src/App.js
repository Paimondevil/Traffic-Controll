import React from "react";
import RoundRobin from "./page/RoundRobin";
import RM from "./page/RM";
import "./index.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoundRobin />} />
        <Route path="/rm" element={<RM />} />
      </Routes>
    </BrowserRouter>
  )
};  