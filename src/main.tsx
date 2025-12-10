import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/routerConfig.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        {/* <App /> */}
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  </StrictMode>
);
