import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/Landing/Landing";
import AuthPage from "./Pages/Auth/signin/Auth";
import OrdersPage from "./Pages/Orders/Orders";
import Payment from "./Pages/Payment/Payment";
import CartPage from "./Pages/Cart/Cart";
import Results from "./Pages/Results/Results";
import ProductDashboard from "./Components/Admin/ProductDashboard";
import AnalyticsDashboard from "./Components/Admin/AnalyticsDashboard";
import CategoryDashboard from "./Components/Admin/CategoryDashboard";
import OrderDashboard from "./Components/Admin/OrderDashboard";
import UserDashboard from "./Components/Admin/UserDashboard";
import AdminLayout from "./Components/Admin/AdminLayout";

import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Register from "./Pages/Auth/signup/Signup";
import Unauthorized from "./Components/Unauthorized/Unauthorized";
import Support from "./Pages/Support/Support";
import MyAccount from "./Pages/MyAccount/MyAccount";
import { useNavigate } from 'react-router-dom';
const stripePromise = loadStripe(
  "pk_test_51QTVpPA3g8fQRAS3vKHatPJBiP7avo3wdXeTS417I8eXaxIzevZYFIwMZUcheDTzoEVZvdo5HgX9Go5J4OnHuigw003BMQpUEt"
);

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/support" element={<Support />} />
        <Route path="/account" element={<MyAccount />} />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        <Route
          path="/unauthorized"
          element={
            <ProtectedRoute
              msg={"you must log in to access this page"}
              redirect={"/unauthorized"}
            >
              <Unauthorized />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute
            allowedRoles={[1]}
              msg={"you must log in to  access your orders "}
              redirect={"/orders"}
            >
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              msg={"you must log in to pay "}
              redirect={"/payment"}
            >
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
        s
        <Route path="/cart" element={<CartPage />} />
        <Route path="/Category/:category" element={<Results />} />
        <Route path="/products/:id" element={<ProductDetails />} />
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
