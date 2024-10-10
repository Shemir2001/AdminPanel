
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.jsx'
import Login from './components/Signin.jsx'
import PasswordReset from './components/Passwordreset.jsx'
import List from './components/List.jsx'
// import KidsCoachForm from './components/Form.jsx'
import TextEditor from './components/HtmlEditor.jsx'
import './style.css'


const router=createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },

    {
      path:'/forgetpassword',
      element:<PasswordReset/>
    },
    {
      path: "/",
      element: <Layout />, 
      children: [
        {
          path: "", 
          element: <TextEditor />, 
        },
        {
          path:'/edit/:id',
          element: <TextEditor />,

        },
        {
          path: '/list',
          element: <List />,
        }
       
       ],
    },
  ]
  
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    

   <RouterProvider router={router}>
    
   </RouterProvider>
  
   
  </StrictMode>,
)
