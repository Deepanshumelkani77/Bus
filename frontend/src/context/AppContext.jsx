import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Restore user from cookies if available
  const userCookie = Cookies.get("user");
  const tokenCookie = Cookies.get("token");

  const initialUser =
    userCookie && userCookie !== "undefined" ? JSON.parse(userCookie) : null;

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(tokenCookie || null);



  // Signup
  const signup = async (username, email, password, phone) => {
    try {
      await axios.post("http://localhost:1000/user/signup", {
        username,
        email,
        password,
        phone,
      });
       
      alert("Signup successful! Please login.");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:1000/user/login", {
        email,
        password,
      });
      Cookies.set("token", response.data.token, { expires: 1 });
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // Logout
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Close sidebar function
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const value = {
   
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
