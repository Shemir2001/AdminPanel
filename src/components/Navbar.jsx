import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Default avatar
import { FiChevronDown } from 'react-icons/fi'; // Dropdown arrow
import { useLocation } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Define the mapping of paths to route names
  const routeNames = {
    '/': 'Be Creative',
    '/edit/:docId': 'Edit Document',
    '/newContent/:sectionId': 'New Content',
    '/users': 'Users',
    '/becreative': 'Be Creative',
    '/mindfulness': 'Mindfulness',
    '/inapp-messages': 'In-App Messages',
    '/notifications': 'Notifications',
  };

  // Get the active route name based on the current path
  const activeRoute = Object.keys(routeNames).find((path) =>
    location.pathname.match(new RegExp(`^${path.replace(/:[^/]+/g, '[^/]+')}$`))
  )
    ? routeNames[
        Object.keys(routeNames).find((path) =>
          location.pathname.match(new RegExp(`^${path.replace(/:[^/]+/g, '[^/]+')}$`))
        )
      ]
    : 'Dashboard';

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = () => {
    console.log('User signed out');
  };

  return (
    <div className="bg-[#1f1838]   text-white h-16 flex items-center justify-between px-4 shadow-md border-b border-[#352f4c]">
      <div className="flex items-center ml-64 space-x-2 text-lg font-semibold">
        <span className="text-white">{'>'}</span> 
        <div className="text-white">{activeRoute}</div>
      </div>
      <div className="relative">
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-400" />
          )}
          <FiChevronDown className="ml-2 text-lg text-gray-300" />
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
            <div className="px-4 py-2 border-b text-sm font-medium text-gray-700">
              {user?.email || 'example@example.com'}
            </div>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
