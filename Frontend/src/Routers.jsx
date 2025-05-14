import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Register from "./Pages/Auth/signup/Signup";
import Unauthorized from "./Components/Unauthorized/Unauthorized";
import Support from "./Pages/Support/Support";
import MyAccount from "./Pages/MyAccount/MyAccount";
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
          path="/admin/product"
          element={
            <ProtectedRoute
            allowedRoles={[2,3]}
              msg={"you must log in to  access your orders "}
              redirect={"/admin/product"}
            >
              <ProductDashboard/>
            </ProtectedRoute>
          }
        />
           <Route
          path="/admin/order"
          element={
            <ProtectedRoute
            allowedRoles={[2,3]}
              msg={"you must log in to  access your orders "}
              redirect={"/admin/orders"}
            >
              <OrderDashboard/>
            </ProtectedRoute>
          }
        />
            <Route
          path="/admin/category"
          element={
            <ProtectedRoute
            allowedRoles={[2,3]}
              msg={"you must log in to  access your orders "}
              redirect={"/admin/category"}
            >
              <CategoryDashboard/>
            </ProtectedRoute>
          }
        />
              <Route
          path="/admin/user"
          element={
            <ProtectedRoute
            allowedRoles={[2,3]}
              msg={"you must log in to  access your orders "}
              redirect={"/admin/user"}
            >
              <UserDashboard/>
            </ProtectedRoute>
          }
        />
                <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute
            allowedRoles={[2,3]}
              msg={"you must log in to  access your orders "}
              redirect={"/admin/analytics"}
            >
              <AnalyticsDashboard/>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default Routers;
