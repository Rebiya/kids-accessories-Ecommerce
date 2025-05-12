import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";  // Changed to uppercase
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>
        {children}
        <Outlet /> 
      </main>
      <Footer />  
    </div>
  );
};

export default Layout;