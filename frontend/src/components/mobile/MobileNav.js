// src/components/mobile/MobileNav.js
import React from "react";
import { Home, Search, MessageSquare, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MobileNav.css";

export default function MobileNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  const navItems = [
    { icon: <Home size={22} />, label: "หน้าแรก", path: "/" },
    { icon: <Search size={22} />, label: "ค้นหา", path: "/search" }, // <-- แก้ตรงนี้
    { icon: <MessageSquare size={22} />, label: "พูดคุย", path: "/chat" },
    { icon: <User size={22} />, label: "โปรไฟล์", path: "/customer/profile" },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item, idx) => (
        <button
          key={idx}
          className={isActive(item.path) ? "active" : ""}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
