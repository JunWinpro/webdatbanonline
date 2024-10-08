import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/HomePage.jsx";
import { SigninPage } from "./pages/SigninPage";
import { SignupPage } from "./pages/SignupPage";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import FixedNavBar from "./components/HomePage/FixedNavBar.jsx";
import Navbar from "./components/HomePage/Navbar";
import SearchBanner from "./components/HomePage/SearchBanner";
import { ContactPage } from "./pages/ContactPage";
import { ProductPage } from "./pages/ProductPage";
import { UserPage } from "./pages/UserPage";
import { ForgetPassPage } from "./pages/ForgetPassPage";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/slice/auth";
import axiosInstance from "./utils/axiosInstance";
import authService from "./services/auth";
import { ResetPassPage } from "./pages/ResetPassPage";
import { EmployeeSigninPage } from "./pages/EmployeeSigninPage";
import { AdminDashboard } from "./pages/AdminDashBoard";
import { ManagerDashboard } from "./pages/ManagerDashBoard";
import { VerifyPage } from "./pages/VerifyPage";
import ProtectedRoute from "./components/AdminDashboard/ProtectedRoute";
import AdminUserList from "./pages/AdminUserList";
import AdminEmployeeList from "./pages/AdminEmployeeList";
import AdminRestaurantList from "./pages/AdminRestaurantList";
import CreateRestaurantPage from "./pages/CreateRestaurantPage";
import { SearchProvider } from "./components/HomePage/SearchContent";
import RestaurantBookings from "./pages/BookingRestaurant";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin } = useSelector((state) => state.auth);
  const [showFixedNavBar, setShowFixedNavBar] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [foodDrinkCategories, setFoodDrinkCategories] = useState([]);

  useEffect(() => {
    const refreshToken = async () => {
      if (!isLogin && localStorage.getItem("refreshToken")) {
        try {
          setIsLoading(true);
          const { accessToken, userInfo, role } = await authService.renewAccessToken(
            localStorage.getItem("refreshToken")
          );

          dispatch(login({ accessToken, userInfo, role }));
        } catch (error) {
          console.error("Error refreshing token:", error);
          dispatch(logout());
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          navigate("/signin");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    refreshToken();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/restaurants');
        if (response.data.success) {
          const categories = [...new Set(response.data.data.data.flatMap(restaurant => restaurant.category || []))];
          setFoodDrinkCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
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

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const navItems = [
    { label: "Home", link: "/" },
    { label: "Contact", link: "/contact" },
    {
      label: "Food & Drink",
      items: foodDrinkCategories.map(category => ({
        label: capitalizeWords(category),
        link: `/${category.toLowerCase().replace(/\s+/g, '-')}`
      }))
    },
    {
      label: "Sales",
      link: "/sales",
    },
  ];

  const handleSearch = (searchTerm) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { searchTerm } });
    }
  };

  return (
    <SearchProvider>
      <Navbar navItems={navItems} />
      {showFixedNavBar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <FixedNavBar navItems={navItems} />
        </div>
      )}
      <SearchBanner onSearch={handleSearch} />
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]} isLoading={isLoading}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin","manager"]} isLoading={isLoading}>
                <AdminUserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute allowedRoles={["admin","manager"]} isLoading={isLoading}>
                <AdminRestaurantList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants/:idrestaurant/bookings"
            element={
              <ProtectedRoute allowedRoles={["admin","manager"]} isLoading={isLoading}>
                <RestaurantBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants/:restaurantId/employees"
            element={
              <ProtectedRoute allowedRoles={["admin","manager"]} isLoading={isLoading}>
                <AdminEmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["manager"]} isLoading={isLoading}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/create-new-restaurant"
            element={
              <ProtectedRoute allowedRoles={["manager"]} isLoading={isLoading}>
                <CreateRestaurantPage />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/verify-user/:token" element={<VerifyPage />} />
          <Route path="/forget-password" element={<ForgetPassPage />} />
          <Route path="/reset-password/:token" element={<ResetPassPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </SearchProvider>
  );
}

export default App;