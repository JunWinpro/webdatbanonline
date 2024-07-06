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
import UserPage from "./pages/UserPage";
import { ForgetPassPage } from "./pages/ForgetPassPage";

function App() {
  const [showFixedNavBar, setShowFixedNavBar] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [userList, setUserList] = useState([
    {
      email: "user@example.com",
      phone: "1234567890",
      avatar: "https://example.com/user1.jpg",
      firstName: "User",
      lastName: "One",
      dateOfBirth: new Date("1990-01-01"),
      gender: "male",
      address: {
        streetAddress: "123 Main St",
        district: "Downtown",
        city: "Metropolis",
      },
      role: "user",
      isVerified: true,
      password: "userpassword",
    },
    {
      email: "manager@example.com",
      phone: "2345678901",
      avatar: "https://example.com/manager1.jpg",
      firstName: "Manager",
      lastName: "One",
      dateOfBirth: new Date("1985-05-15"),
      gender: "female",
      address: {
        streetAddress: "456 Oak Ave",
        district: "Uptown",
        city: "Metropolis",
      },
      role: "manager",
      isVerified: true,
      password: "managerpassword",
    },
    {
      email: "admin@example.com",
      phone: "3456789012",
      avatar: "https://example.com/admin1.jpg",
      firstName: "Admin",
      lastName: "One",
      dateOfBirth: new Date("1980-12-31"),
      gender: "other",
      address: {
        streetAddress: "789 Pine Rd",
        district: "Midtown",
        city: "Metropolis",
      },
      role: "admin",
      isVerified: true,
      password: "adminpassword",
    },
  ]);

  const handleSignup = (newUser) => {
    return new Promise((resolve, reject) => {
      try {
        setUserList((prevList) => [...prevList, newUser]);
        setCurrentUser(newUser);
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  };
  const updateUser = (updatedUserInfo) => {
    setCurrentUser(updatedUserInfo);
  };
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  const updateUserAvatar = (newAvatarSrc) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      avatar: newAvatarSrc,
    }));

    setUserList((prevList) =>
      prevList.map((user) =>
        user.email === currentUser.email
          ? { ...user, avatar: newAvatarSrc }
          : user
      )
    );
  };

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

  return (
    <>
      <Navbar
        navItems={navItems}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        updateUserAvatar={updateUserAvatar}
      />
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
          <Route
            path="/signin"
            element={
              <SigninPage
                userList={userList}
                employeeList={employeeList}
                onLogin={handleLogin}
              />
            }
          />
          <Route
            path="/signup"
            element={<SignupPage onSignup={handleSignup} />}
          />
          <Route
            path="/user"
            element={
              <UserPage currentUser={currentUser} updateUser={updateUser} />
            }
          />
          <Route path="/forget-password" element={<ForgetPassPage />} />
          {/* <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          /> */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
