import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-teal-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
                <Link to="/" className="flex justify-center gap-2 mb-8">
                    <div className="h-12 w-12 rounded-full bg-primary-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        S
                    </div>
                    <span className="self-center text-xl font-bold text-primary-900">SEWA</span>
                </Link>
                <Outlet />
            </div>
        </div>
    );
}
