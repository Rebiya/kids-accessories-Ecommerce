import "./App.css";
import Routers from "./Routers";
import { useAuth } from "./Components/DataProvider/DataProvider";
import { type } from "./Utility/action.type";
import { useEffect } from "react";
import { validateToken } from "./Services/AuthService";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { state, dispatch } = useAuth();

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));

      if (token && validateToken(token)) {
        dispatch({
          type: type.SET_USER,
          user: userData
        });
      } else {
        dispatch({
          type: type.SET_USER,
          user: null
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    checkAuthState();
  }, [dispatch]);

  return (
    <>
      <Routers />
          <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;