import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage.jsx";
import { SigninPage } from "./pages/SigninPage";
import { SignupPage } from "./pages/SignupPage";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import FixedNavBar from "./components/HomePage/FixedNavBar.jsx";
import Navbar from "./components/HomePage/Navbar";
import React, { useState, useEffect } from "react";
import SearchBanner from "./components/HomePage/SearchBanner";
import { ProductPage } from "./pages/ProductPage";
import { UserPage } from "./pages/UserPage";
import { ForgetPassPage } from "./pages/ForgetPassPage";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/slice/auth";

import { useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import authService from "./services/auth";
import { ResetPassPage } from "./pages/ResetPassPage";

import { EmployeeSigninPage } from "./pages/EmployeeSigninPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AdminDashboard } from "./pages/AdminDashBoard";
import { ManagerDashboard } from "./pages/ManagerDashBoard";


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.auth);
  const [showFixedNavBar, setShowFixedNavBar] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const refreshToken = async () => {
      if (!isLogin && localStorage.getItem("refreshToken")) {
        try {
          const { accessToken, userInfo, role } = await authService.renewAccessToken(
            localStorage.getItem("refreshToken")
          );
          

          console.log("Token refresh successful:", { accessToken, userInfo, role });
          dispatch(login({ accessToken, userInfo, role }));
        } catch (error) {
          console.error("Error refreshing token:", error);
          dispatch(logout());
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          navigate("/signin");
        }
      }
    };
    refreshToken();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFixedNavBar(window.pageYOffset > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <>
      <Navbar navItems={navItems} />
      {showFixedNavBar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <FixedNavBar navItems={navItems} />
        </div>
      )}
      <SearchBanner />
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/employee/signin" element={<EmployeeSigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<UserPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/forget-password" element={<ForgetPassPage />} />
          <Route path="/reset-password/:token" element={<ResetPassPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
