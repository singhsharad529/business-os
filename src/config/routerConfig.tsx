import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";

import { ProtectedLayout } from "../layout/ProtectedLayout";
// import { SuperAdminRoute } from "./SuperAdminRoute";
// import { CompanyRoute } from "./CompanyRoute";

import { SuperAdminDashboard } from "../pages/super-admin/SuperAdminDashboard";
import { Companies } from "../pages/super-admin/Companies";

import { CompanyDashboard } from "../pages/company/CompanyDashboard";
import { EntityPage } from "../pages/company/EntityPage";
import { SuperAdminRoute } from "../layout/SuperAdminRoute";
import { CompanyRoute } from "../layout/CompanyRoute";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },

    // Default landing page → login
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },

    {
        path: "/app",
        element: <ProtectedLayout />,

        children: [
            // SUPER ADMIN ROUTES
            {
                element: <SuperAdminRoute />,
                children: [
                    { path: "super-admin/dashboard", element: <SuperAdminDashboard /> },
                    { path: "super-admin/companies", element: <Companies /> },
                ],
            },

            // COMPANY ROUTES
            {
                element: <CompanyRoute />,
                children: [
                    { path: "company/dashboard", element: <CompanyDashboard /> },
                    { path: "company/entities/:entityType", element: <EntityPage /> },
                ],
            },
        ],
    },

    {
        path: "*", // We will add a 404 page here later
        element: <Navigate to="/login" replace />,
    },
]);
