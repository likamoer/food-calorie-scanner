import React, { useState, useCallback } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from './Pages/Login';
import Home from './Pages/Home';
import User from './Pages/User';
import Record from './Pages/Record';

function App() {
  const router = createBrowserRouter([
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
  ]);
  return (
    <RouterProvider router={router} />
  );
}

export default App;
