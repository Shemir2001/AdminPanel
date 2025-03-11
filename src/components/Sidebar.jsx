import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa"; 
import { auth } from "./Firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import bgimage from "../assets/bgimage.png";
import notification from "../assets/notificationspanel.svg";
import mind from "../assets/mind.svg";
import user from "../assets/usersicon.svg";
import creative3 from "../assets/new.svg";

const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          email: user.email,
          profilePicture: user.photoURL, 
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsSidebarCollapsed]);
  useEffect(() => {
    setActiveButton(location.pathname === "/" ? "/becreative" : location.pathname);
  }, [location]);

  const routeNames = {
    "/": "Be Creative",
    "/edit/:docId": "Edit Document",
    "/newContent/:sectionId": "New Content",
    "/users": "Users",
    "/becreative": "Be Creative",
    "/mindfulness": "Mindfulness",
    "/inapp-messages": "In-App Messages",
    "/notifications": "Notifications",
  };

  const activeRoute = routeNames[activeButton] || "Dashboard";

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login"); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
const menuItems = [
    { name: "Be Creative", path: "/becreative", icon: creative3 },
    { name: "Mindfulness", path: "/mindfulness", icon: mind },
    { name: "Users", path: "/users", icon: user },
    { name: "Notifications", path: "/notifications", icon: notification },
  ];

  return (
    <div className="flex h-screen">
      <aside className="bg-[#1f1838] fixed top-0 left-0 z-50 h-16 w-full text-white flex items-center border-b border-[#352f4c]">
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl ml-4 focus:outline-none"
        >
          <HiMenu />
        </button>
        <div className="flex items-center gap-2 pl-4">
          <img src={bgimage} alt="RBB Logo" className="w-8 h-8" />
          <span className="text-xl font-semibold text-white">RBB</span>
        </div>
        <div
          className={`flex-grow flex justify-start ${
            isSidebarCollapsed ? "pl-8" : "pl-40"
          } `}
        >
          <span className="text-lg font-semibold">{`>${activeRoute}`}</span>
        </div>
        <div className="relative pr-4">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none"
          >
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaUserCircle className="text-3xl text-gray-300" />
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md py-2 w-48">
              <div className="px-4 py-2 border-b">
                <span className="block text-sm font-medium">
                  {currentUser?.email || "No email"}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-200 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
      <aside
        className={`bg-[#1f1838] fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] border-r border-[#352f4c] transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? "w-24" : "w-60"
        }`}
      >
        <div className="h-full flex flex-col items-start">
          <ul className="space-y-4 font-medium text-lg w-full mt-6 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg ${
                    activeButton === item.path
                      ? "bg-[#C94FFC] text-white"
                      : "bg-[#255D74] text-white"
                  } hover:opacity-90 transition ease-in-out duration-150`}
                >
                  <img
                    src={item.icon}
                    alt={`${item.name} Icon`}
                    className={`w-8 h-8`}
                    style={{
                      filter:
                        activeButton === item.path
                          ? "brightness(0) invert(1)"
                          : "none",
                    }}
                  />
                  <span
                    className={`${
                      isSidebarCollapsed ? "hidden" : "block ml-3"
                    } transition-opacity duration-500 whitespace-nowrap`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
