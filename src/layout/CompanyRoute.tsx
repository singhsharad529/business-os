import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const CompanyRoute = () => {
    const { user, isLoading } = useAuth();
    console.log("company user is loading", isLoading);
    console.log("company user", user);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-muted">Checking access...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== "company_admin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
