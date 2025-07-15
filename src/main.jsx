// src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './Routes/Routes.jsx';
import AuthProvider from './provider/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅ Import React Query

const queryClient = new QueryClient(); // ✅ Initialize QueryClient

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* ✅ Wrap with QueryClientProvider */}
      <AuthProvider> {/* ✅ Auth context */}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
