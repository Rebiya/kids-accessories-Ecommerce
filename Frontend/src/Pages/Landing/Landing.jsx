import React from "react";
import Layout from "../../Components/Layout/Layout";
import CarouselEffect from "../../Components/Carousel/CarouselEffect";
import Product from "../../Components/Product/Product";
import Category from "../../Components/Category/Category";

import footer from "../../Components/Footer/Footer";
import AdminDashboard from "../../Components/Admin/AdminDashboard";
import ProductDashboard from "../../Components/Admin/ProductDashboard";

const Landing = () => {
  return (
    <div>
      <Layout>
        <CarouselEffect />
        <Category />
        <Product />
      </Layout>

      <footer />
<ProductDashboard/>

    </div>
  );
};

export default Landing;
