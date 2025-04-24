import React from 'react'
import {Routes, Route,Navigate } from "react-router-dom";
import Login from '../components/login/Login';
export default function Applayout() {
  return (
    <>
        <Routes>
            <Route path="/" element={<Login/>} />
        </Routes>
    </>
  )
}
