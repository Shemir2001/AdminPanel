import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout.jsx";
import Login from "./components/Signin.jsx";
import PasswordReset from "./components/Passwordreset.jsx";
import PrivacyPolicy from "./components/Privacy.jsx";
import AccountDeletion from "./components/Account.jsx";
import Sections from "./components/Becreative.jsx";
import TextEditor from "./components/HtmlEditor.jsx";
import User from "./components/Users.jsx";
import Mindfulness from "./components/Mindfullness.jsx";
import MeditationForm from "./components/InappMessaging.jsx";
import NotificationPanel from "./components/Notifications.jsx";
import ProtectedRoute from "./components/Protected.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgetpassword",
    element: <PasswordReset />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/account-deletion",
    element: <AccountDeletion />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, 
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <Sections />,
          },
          {
            path: "/edit/:docId",
            element: <TextEditor />,
          },
          {
            path: "/newContent/:sectionId",
            element: <TextEditor />,
          },
          {
            path: "/users",
            element: <User />,
          },
          {
            path: "/becreative",
            element: <Sections />,
          },
          {
            path: "/mindfulness",
            element: <Mindfulness />,
          },
          {
            path: "/inapp-messages",
            element: <MeditationForm />,
          },
          {
            path: "/notifications",
            element: <NotificationPanel />,
          },
          
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
