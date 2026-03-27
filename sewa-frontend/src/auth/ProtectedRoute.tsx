import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Spinner } from '../components/ui/Spinner';

interface ProtectedRouteProps {
    requiredPermission?: string;
}

export default function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredPermission && user && !user.permissions?.includes(requiredPermission)) {
        // Redirect to dashboard or specialized 403 page
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
