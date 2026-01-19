import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";

import { ProtectedLayout } from "../layout/ProtectedLayout";

import { SuperAdminDashboard } from "../pages/super-admin/SuperAdminDashboard";
import { Companies } from "../pages/super-admin/Companies";

import { CompanyDashboard } from "../pages/company/CompanyDashboard";
import { EntityPage } from "../pages/company/EntityPage";
import { SuperAdminRoute } from "../layout/SuperAdminRoute";
import { CompanyRoute } from "../layout/CompanyRoute";

import { VoicebotDashboard } from "../pages/voicebot/VoicebotDashboard";
import { VoicebotCRM } from "../pages/voicebot/VoicebotCRM";
import VoicebotInsights from "../pages/voicebot/VoicebotInsights";
import { VoicebotSettings } from "../pages/voicebot/VoicebotSettings";

import { CRMDashboard } from "../pages/crm/CRMDashboard";
import { CRMContacts } from "../pages/crm/CRMContacts";
import { CRMDeals } from "../pages/crm/CRMDeals";
import VoicebotCalls from "@/pages/voicebot/VoicebotCalls";
import VoicebotLeadDatabase from "@/pages/voicebot/VoicebotLeadDatabase";
import { MyCompanyDashboard } from "@/pages/single-company/MyCompanyDashboard";
import Campaigns from "@/pages/voicebot/Campaigns";
import AllLeads from "@/pages/super-admin/AllLeads";
import Customers from "@/pages/super-admin/Customers";
import MyAgents from "@/pages/super-admin/MyAgents";
import Customer from "@/pages/super-admin/Customer";
import Inbound from "@/pages/super-admin/Inbound";
import AdminProfile from "@/pages/super-admin/AdminProfile";
import UserProfie from "@/pages/voicebot/UserProfie";
import Billing from "@/pages/voicebot/Billing";
import AgentStats from "@/pages/super-admin/AgentStats";

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
            // Default route → voicebot dashboard
            {
                index: true,
                element: <Navigate to="/app/voicebot/dashboard" replace />,
            },

            // VOICEBOT ROUTES
            {
                path: "voicebot/dashboard",
                element: <VoicebotDashboard />,
            },
            // {
            //     path: "voicebot/crm",
            //     element: <VoicebotCRM />,
            // },
            {
                path: "voicebot/calls",
                element: <VoicebotCalls />,
            },
            {
                path: "voicebot/insights",
                element: <VoicebotInsights />,
            },
            {
                path: "voicebot/leads-database",
                element: <VoicebotLeadDatabase />,
            },
            {
                path: "voicebot/campaigns",
                element: <Campaigns />,
            },
            // CRM ROUTES
            {
                path: "crm/dashboard",
                element: <CRMDashboard />,
            },
            {
                path: "crm/contacts",
                element: <CRMContacts />,
            },
            {
                path: "crm/deals",
                element: <CRMDeals />,
            },
            {
                path: "my-company",
                element: <MyCompanyDashboard />,
            },
            {
                path: "voicebot/user-profile",
                element: <UserProfie />,
            },
            {
                path: "voicebot/billing",
                element: <Billing />,
            },

            // SUPER ADMIN ROUTES (under Apps section)
            {
                element: <SuperAdminRoute />,
                children: [
                    { path: "super-admin/dashboard", element: <SuperAdminDashboard /> },
                    { path: "super-admin/inbound", element: <Inbound /> },
                    { path: "super-admin/my-agent", element: <MyAgents /> },
                    { path: "super-admin/all-leads", element: <AllLeads /> },
                    { path: "super-admin/all-clients", element: <Customers /> },
                    { path: "super-admin/clients/:id", element: <Customer /> },
                    { path: "super-admin/profile", element: <AdminProfile /> },
                    { path: "super-admin/agent/:id", element: <AgentStats /> },

                ],
            },

            // COMPANY ROUTES (under Apps section)
            {
                element: <CompanyRoute />,
                children: [
                    { path: "company/dashboard", element: <CompanyDashboard /> },
                    {
                        path: "company/apps",
                        element: <Navigate to="/app/apps/entities/contacts" replace />,
                    },

                    // Keep old route for backward compatibility, but also add new route
                    { path: "company/entities/:entityType", element: <EntityPage /> },
                ],
            },

            // APPS ROUTES (new route structure for entities)
            {
                path: "apps/entities/:entityType",
                element: <EntityPage />,
            },

            // BILLING ROUTE
            {
                path: "billing",
                element: <CompanyDashboard />, // Placeholder - replace with actual billing component
            },
        ],
    },

    {
        path: "*", // We will add a 404 page here later
        element: <Navigate to="/login" replace />,
    },
]);
