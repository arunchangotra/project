// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import Second from './MyComponents/Second';
// import ForgetPassword from './MyComponents/ForgetPassword'
// import LoginPage from './MyComponents/LoginPage'
// import Forgotpassword2 from './MyComponents/Forgotpassword2';



// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>,
//   },
//   {
//     path: "/second",
//     element: <Second/>,
//   },
//   {
//     path: "/signup",
//     element: <App/>,
//   },
//   {
//     path: "/forgot-password",
//     element: <ForgetPassword/>,
//   },
//   {
//     path: "/login",
//     element: <LoginPage/>,
//   },
//   {
//     path: `/forgot-password?email=${email}`,
//     element: <Forgotpassword2 />,
//   }
  
  
// ]);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
  
//     <RouterProvider router={router} />
  
// );


// reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Second from './MyComponents/Second';
import ForgetPassword from './MyComponents/ForgetPassword';
import LoginPage from './MyComponents/LoginPage';
import Forgotpassword2 from './MyComponents/Resetpassword';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Resetpassword from './MyComponents/Resetpassword';
import Resetcrendintial from './MyComponents/Resetcrendintial';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/second',
    element: <Second />,
  },
  {
    path: '/signup',
    element: <App />,
  },
  {
    path: '/forgot-password',
    element: <ForgetPassword />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password/:email', // Define email as a dynamic route parameter
    element: <Resetpassword />,

  },
  {
    path: '/resetcredintial', // Define email as a dynamic route parameter
    element: <Resetcrendintial/>,
    
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();

