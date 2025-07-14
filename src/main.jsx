// src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './Routes/Routes.jsx';
import AuthProvider from './provider/AuthProvider'; // ✅ Make sure this path is correct

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Auth context wrapping the router */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
