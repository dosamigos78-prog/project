import { BrowserRouter, Routes, Route } from "react-router";
import { Navigation } from "./components/Navigation";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { DataInput } from "./components/DataInput";
import { Payment } from "./components/Payment";
import { Chatbot } from "./components/Chatbot";
// 1️⃣ السطر المظبوط بالملي بناءً على مسار الفولدرات عندك
import { Signup } from "./components/Signup"; 

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* 2️⃣ سطر الـ Route اللي هينادي الصفحة لما نكتب /signup */}
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/data-input" element={<DataInput />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}