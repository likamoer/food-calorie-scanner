import React, { useState, useCallback } from 'react';
import { createHashRouter, RouterProvider } from "react-router";
import Login from './Pages/Login';
import Home from './Pages/Home';
import User from './Pages/User';
import Record from './Pages/Record';
import Register from './Pages/Login/Register';

function App() {
  // 使用HashRouter替代BrowserRouter，这样可以直接通过文件系统访问
  const router = createHashRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/record",
      element: <Record />,
    },
    {
      path: "/user",
      element: <User />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <RouterProvider router={router} />
  );
}

export default App;
