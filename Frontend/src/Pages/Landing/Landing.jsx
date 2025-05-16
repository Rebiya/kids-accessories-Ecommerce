import React from "react";
import Layout from "../../Components/Layout/Layout";
import CarouselEffect from "../../Components/Carousel/CarouselEffect";
import Product from "../../Components/Product/Product";
import Category from "../../Components/Category/Category";

import footer from "../../Components/Footer/Footer";
import UserDashboard from "../../Components/Admin/UserDashBoard/UserDashboard";
import CategoryDashboard from "../../Components/Admin/CategoryDashBoard/CategoryDashboard";
import ProductDashboard from "../../Components/Admin/ProductDashBoard/ProductDashboard";
import OrderDashboard from "../../Components/Admin/OrderDashBoard/OrderDashboard";
import AnalyticsDashboard from "../../Components/Admin/AnalyticsDashBoard/AnalyticsDashboard";
import WelcomeDashboard from "../../Components/Admin/WelcomeDashBoard/WelcomeDashboard";
const Landing = () => {
  return (
    <div>
      <Layout>
        <CarouselEffect />
        <Category />
        <Product />
      </Layout>


      <footer />


    </div>
  );
};

export default Landing;
