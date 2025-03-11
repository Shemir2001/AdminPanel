import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { message } from "antd";
import picture from "../assets/icon.svg";
import something from "../assets/bg.png";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Listener to check auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        message.error("Please login first!");
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Splash screen while auth state is being checked
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

  // Securely restrict access based on authentication state
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
