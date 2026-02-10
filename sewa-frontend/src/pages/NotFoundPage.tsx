import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50 px-4">
            <div className="text-center">
                <p className="text-6xl font-bold text-primary-600">404</p>
                <h1 className="mt-4 text-2xl font-bold text-secondary-900">Page not found</h1>
                <p className="mt-2 text-secondary-600 max-w-sm mx-auto">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link to="/">
                        <Button leftIcon={<HomeIcon className="h-5 w-5" />}>Go to Home</Button>
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 shadow-sm hover:bg-secondary-50"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}
