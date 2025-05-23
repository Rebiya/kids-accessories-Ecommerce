import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/Landing/Landing";
import AuthPage from "./Pages/Auth/signin/Auth";
import OrdersPage from "./Pages/Orders/Orders";
import Payment from "./Pages/Payment/Payment";
import CartPage from "./Pages/Cart/Cart";
import Results from "./Pages/Results/Results";
import ProductDashboard from "./Components/Admin/ProductDashBoard/ProductDashboard";
import AnalyticsDashboard from "./Components/Admin/AnalyticsDashBoard/AnalyticsDashboard";
import CategoryDashboard from "./Components/Admin/CategoryDashBoard/CategoryDashboard";
import OrderDashboard from "./Components/Admin/OrderDashBoard/OrderDashboard";
import UserDashboard from "./Components/Admin/UserDashBoard/UserDashboard";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Register from "./Pages/Auth/signup/Signup";
import Unauthorized from "./Components/Unauthorized/Unauthorized";
import Support from "./Pages/Support/Support";
import MyAccount from "./Pages/MyAccount/MyAccount";
import WelcomeDashboard from "./Components/Admin/WelcomeDashBoard/WelcomeDashboard";
import SearchPage from "./Pages/Search/Search";
import CategoriesPage from "./Pages/CategorySlider/CategorySlider";
import AdminLayout from "./Components/Admin/AdminLayout/AdminLayout";
import { Navigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51QTVpPA3g8fQRAS3vKHatPJBiP7avo3wdXeTS417I8eXaxIzevZYFIwMZUcheDTzoEVZvdo5HgX9Go5J4OnHuigw003BMQpUEt"
);

const Routers = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/support" element={<Support />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:category" element={<Results />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category" element={<CategoriesPage />} />

        {/* User Routes (role_id 1) */}
        <Route
          path="/account"
          element={
            <ProtectedRoute allowedRoles={[1,3]}>
              <MyAccount />
            </ProtectedRoute>
          }
        />
      <Route
  path="/orders"
  element={
    <ProtectedRoute allowedRoles={[1,3]}>
      <OrdersPage />
    </ProtectedRoute>
  }
/>

        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={[1,3]}>
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />

        {/* Employee & Admin Routes (role_id 2 & 3) */}
       
        <Route
          path="/admin/welcome"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <WelcomeDashboard />
            </ProtectedRoute>
          }
        />
        
       <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={[2, 3]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="product" element={<ProductDashboard />} />
  <Route path="order" element={<OrderDashboard />} />
  <Route path="category" element={<CategoryDashboard />} />
  <Route path="user" element={<UserDashboard />} />
  <Route path="analytics" element={<AnalyticsDashboard />} />
  <Route index element={<Navigate to="product" replace />} />
</Route>

      </Routes>
    </Router>
  );
};

export default Routers;