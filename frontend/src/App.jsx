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
import { UserProvider } from "./context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import authService from "./services/auth";
import { login } from "./store/slice/auth";

function App() {
  const dispatch = useDispatch();
  const { isLogin, userInfo, accessToken } = useSelector((state) => state.auth);
  const email = "user@gmail.com";
  const password = "12345678";
  const [error, setError] = useState();
  useEffect(() => {
    const fetchLogin = async () => {
      if (!isLogin) {
        if (localStorage.getItem("refreshToken")) {
          const { accessToken, userInfo } = await authService.renewAccessToken(
            localStorage.getItem("refreshToken")
          );
          dispatch(login({ accessToken, userInfo }));
        }
      }
    };
    fetchLogin();
  }, []);
  const login = async () => {
    const data = await authService.login({ email, password });
    console.log(data);
    return data;
  };
  login();
  // const [showFixedNavBar, setShowFixedNavBar] = useState(false);

  // const navItems = [
  //   { label: "Home", link: "/" },
  //   { label: "Contact", link: "/contact" },
  //   {
  //     label: "Food & Drink",
  //     items: [
  //       { label: " staurant", link: "/restaurant" },
  //       { label: "Hotpot", link: "/hotpot" },
  //       { label: "Cafe", link: "/cafe" },
  //       { label: "Bar", link: "/bar" },
  //       { label: "Grilled food", link: "/grilled-food" },
  //     ],
  //   },
  //   {
  //     label: "Sales",
  //     link: "/sales",
  //   },
  // ];

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.pageYOffset > 0) {
  //       setShowFixedNavBar(true);
  //     } else {
  //       setShowFixedNavBar(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    // <UserProvider>
    <>
      {/* <Navbar navItems={navItems} />
      {showFixedNavBar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <FixedNavBar navItems={navItems} />
        </div>
      )}
      <SearchBanner />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<UserPage />} />
          <Route path="/forget-password" element={<ForgetPassPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div> */}
    </>
    // </UserProvider>
  );
}

export default App;
