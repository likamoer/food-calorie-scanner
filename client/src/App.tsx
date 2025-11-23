import React, { useState, useCallback, useEffect } from 'react';
import { createHashRouter, RouterProvider } from "react-router";
import Login from './Pages/Login';
import Home from './Pages/Home';
import User from './Pages/User';
import Record from './Pages/Record';
import Register from './Pages/Login/Register';
import { updateUserOnlineStatus } from './utils/api';

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
  
  // 监听网页关闭事件，发送请求将登录状态置为否
  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await updateUserOnlineStatus({ isOnline: false });
      } catch (error) {
        console.error('更新用户在线状态失败:', error);
      }
    };

    // 监听页面关闭或刷新事件
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 清理事件监听
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;