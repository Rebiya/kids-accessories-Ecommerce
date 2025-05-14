import React from "react";
import Layout from "../../Components/Layout/Layout";
import CarouselEffect from "../../Components/Carousel/CarouselEffect";
import Product from "../../Components/Product/Product";
import Category from "../../Components/Category/Category";

import footer from "../../Components/Footer/Footer";
import UserDashboard from "../../Components/Admin/UserDashboard";
import CategoryDashboard from "../../Components/Admin/CategoryDashboard";
import ProductDashboard from "../../Components/Admin/ProductDashboard";
import OrderDashboard from "../../Components/Admin/OrderDashboard";
import AnalyticsDashboard from "../../Components/Admin/AnalyticsDashboard";
import WelcomeDashboard from "../../Components/Admin/WelcomeDashboard";
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
