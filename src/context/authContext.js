import axios from "axios";
import config from "../config"
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null; // Trả về null nếu không có giá trị
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null; // Trả về null nếu có lỗi
    }
  });

  const login = async (inputs) => {
   // console.log("haha")
    const res = await axios.post(`${config.API_BASE_URL}/api/v1/auth/login`, inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data)
    localStorage.setItem("user", JSON.stringify(res.data)); 
  };
 

  // useEffect(() => {
  //   // Chuyển hướng đến trang login nếu currentUser không có trong localStorage
  //   if (!currentUser) {
  //     navigate("/login");
  //   }
  // }, [currentUser, navigate]);
  const logout = () => {
    console.log("day la logout !!!!!!!!!!!!!!!!!!")
    setCurrentUser(null); // Đặt currentUser về null
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user"); // Xóa user khi người dùng đăng xuất hoặc không có người dùng
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login ,logout }}>
      {children}
    </AuthContext.Provider>
  );
};