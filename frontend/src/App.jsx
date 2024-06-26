import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage.jsx";
import { SigninPage } from "./pages/SigninPage";
import { SignupPage } from "./pages/SignupPage";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { ContactPage } from "./pages/Contact.jsx";
import FixedNavBar from "./components/HomePage/FixedNavBar.jsx";
import Navbar from "./components/HomePage/Navbar";
import React, { useState, useEffect } from "react";
import SearchBanner from "./components/HomePage/SearchBanner";
import { ProductPage } from "./pages/ProductPage";

function App() {
  const [showFixedNavBar, setShowFixedNavBar] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const userList = [
    {
      email: "user@example.com",
      password: "userpass",
      username: "User1",
      avatarSrc: "https://example.com/user1.jpg",
    },
    {
      email: "manager@example.com",
      password: "managerpass",
      username: "Manager1",
      avatarSrc: "https://example.com/manager1.jpg",
    },
    {
      email: "admin@example.com",
      password: "adminpass",
      username: "Admin1",
      avatarSrc: "https://example.com/admin1.jpg",
    },
  ];

  const employeeList = [
    {
      usernameOrPhone: "employee1",
      password: "emp1pass",
      username: "Employee1",
      avatarSrc: "https://example.com/emp1.jpg",
    },
    {
      usernameOrPhone: "1234567890",
      password: "emp2pass",
      username: "Employee2",
      avatarSrc: "https://example.com/emp2.jpg",
    },
  ];

  const navItems = [
    { label: "Home", link: "/" },
    { label: "Contact", link: "/contact" },
    {
      label: "Food & Drink",
      items: [
        { label: "Restaurant", link: "/restaurant" },
        { label: "Hotpot", link: "/hotpot" },
        { label: "Cafe", link: "/cafe" },
        { label: "Bar", link: "/bar" },
        { label: "Grilled food", link: "/grilled-food" },
      ],
    },
    {
      label: "Sales",
      link: "/sales",
    },
  ];

  const avatarSrc = "https://github.com/shadcn.png";

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setShowFixedNavBar(true);
      } else {
        setShowFixedNavBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  return (
    <>
      <Navbar navItems={navItems} username={currentUser ? currentUser.username : ""} avatarSrc={currentUser ? currentUser.avatarSrc : avatarSrc} />
      {showFixedNavBar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <FixedNavBar navItems={navItems} />
        </div>
      )}
      <SearchBanner />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/signin" element={<SigninPage userList={userList} employeeList={employeeList} onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;