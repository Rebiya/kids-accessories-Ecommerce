import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = "http://localhost:3000/api";

// Login function (existing)
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: email.trim().toLowerCase(),
      password
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Login failed");
    }

    const decodedToken = jwtDecode(response.data.accessToken);

    return {
      token: response.data.accessToken,
      user: {
        ID: decodedToken.ID,
        email: decodedToken.email,
        first_name: decodedToken.first_name,
        last_name: decodedToken.last_name,
        phone_number: decodedToken.phone_number,
        role_id: decodedToken.role_id
      }
    };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error(error.message || "Network error. Please try again.");
    }
  }
};

// New register function
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone_number: userData.phoneNumber
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Registration failed");
    }

    const decodedToken = jwtDecode(response.data.accessToken);

    return {
      token: response.data.accessToken,
      user: {
        ID: decodedToken.ID,
        email: decodedToken.email,
        first_name: decodedToken.first_name,
        last_name: decodedToken.last_name,
        phone_number: decodedToken.phone_number,
        role_id: decodedToken.role_id
      }
    };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error(error.message || "Network error. Please try again.");
    }
  }
};
// Logout function (existing)
export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

// Token validation (existing)
export const validateToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};