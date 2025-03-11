import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import picture from "../assets/icon.svg";
import something from "../assets/bg.png";
import Navbar from "./Navbar";
const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          message.error("Please login first!");
          navigate("/login");
        }
        setLoading(false);
      });
    }, 4000);

    return () => clearTimeout(splashTimer);
  }, [navigate]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center w-screen h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${something})`,
        }}
      >
        <div className="flex flex-col items-center gap-y-6">
          <img
            src={picture}
            alt="Loading"
            className="w-32 h-auto animate-bounce object-contain"
          />
          <div className="text-white text-3xl font-bold">RBB APP</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#130e26] h-screen overflow-auto">
      <div >
        <Navbar />
      </div>
      <div className="flex">
        <div className={`transition-all ${isSidebarCollapsed ? "w-24" : "w-60"}`}>
          <Sidebar
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />
        </div>
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? "ml-4" : "ml-4"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Layout;
