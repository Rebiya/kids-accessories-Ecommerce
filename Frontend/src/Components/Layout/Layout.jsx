import React from "react";
import Header from "../../Components/Header/Header";
import LowerHeader from "../../Components/Header/LowerHeader";
import Footer from "../../Components/Footer/Footer";  // Changed to uppercase
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <br />
      <LowerHeader />
      <main>
        {children}
        <Outlet /> 
      </main>
      <Footer />  
    </div>
  );
};

export default Layout;