import React, { useState, useCallback } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from './Pages/Home';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);
  return (
    <RouterProvider router={router} />
  );
}

export default App;
