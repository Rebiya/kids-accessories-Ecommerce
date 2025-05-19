import { createContext, useReducer, useEffect, useContext } from "react";
import { validateToken } from "../../Services/AuthService";
import { type } from "../../Utility/action.type";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { login, register, logout } from "../../Services/AuthService";

// Spinner configuration
const spinnerOverride = css`
  display: block;
  margin: 0 auto;
  border-color: #D4AF37; /* Using your golden color palette */
`;

export const DataContext = createContext();

export const DataProvider = ({ children, reducer, initialState }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));


      if (token && validateToken(token)) {
        dispatch({
          type: type.INITIALIZE_AUTH,
          payload: {
            user,
            isAuthenticated: true
          }
        });
      } else {
        dispatch({
          type: type.INITIALIZE_AUTH,
          payload: {
            user: null,
            isAuthenticated: false
          }
        });
      }
    };

    initializeAuth();
  }, []);

  // Combine state and dispatch with auth actions
  const contextValue = {
    state,
    dispatch,
    login: async (email, password) => {
      try {
        const response = await login(email, password);
        dispatch({
          type: type.LOGIN_SUCCESS,
          payload: response
        });
        return response;
      } catch (error) {
        dispatch({
          type: type.LOGIN_FAILURE,
          error: error.message
        });
        throw error;
      }
    },
    register: async (userData) => {
      try {
        const response = await register(userData);
        dispatch({
          type: type.REGISTER_SUCCESS,
          payload: response
        });
        return response;
      } catch (error) {
        dispatch({
          type: type.REGISTER_FAILURE,
          error: error.message
        });
        throw error;
      }
    },
    logout: async () => {
      try {
        await logout();
        dispatch({ type: type.LOGOUT });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  // Show spinner during initial auth loading
  if (state.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <ClipLoader
          color={'#D4AF37'}
          loading={true}
          css={spinnerOverride}
          size={50}
        />
        <p style={{ marginTop: '20px', color: '#D4AF37' }}>Loading application...</p>
      </div>
    );
  }

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Create and export the useAuth hook
export const useAuth = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a DataProvider');
  }
  return context;
};