import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../auth/AuthProvider';
import type { LoginFormValues } from '../../types/auth.forms';
import { LoginSchema } from '../../types/auth.forms';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../components/ui/Toast';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [loginError, setLoginError] = useState<string | null>(null);

    const from = location.state?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema)
    });

    const mutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            console.log('✅ Login Success:', data);
            // Transform API response to internal User format
            const user = {
                username: data.username,
                roles: Array.from(data.roles), // Set to Array
                permissions: [] // Permissions might need to be fetched or derived
            };
            login(data.token, user);
            toast.success('Login successful! Redirecting...');
            navigate(from, { replace: true });
        },
        onError: (error: any) => {
            console.error('❌ Login Error:', error);
            console.error('Error Details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                message: error.response?.data?.message,
                data: error.response?.data,
                fullError: error
            });
            const errorMessage = error.response?.data?.message || error.message || 'Invalid username or password';
            setLoginError(errorMessage);
            toast.error(errorMessage);
        }
    });

    const onSubmit = (data: LoginFormValues) => {
        setLoginError(null);
        mutation.mutate(data);
    };

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-secondary-50 to-teal-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="flex justify-center gap-2 mb-8">
                    <div className="h-12 w-12 rounded-full bg-primary-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        S
                    </div>
                    <span className="self-center text-xl font-bold text-primary-900">SEWA</span>
                </div>

                <h2 className="text-center text-2xl font-bold tracking-tight text-secondary-900">
                    Sign in to SEWA
                </h2>
                <p className="mt-2 text-center text-sm text-secondary-600">
                    Access your member portal
                </p>

                <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-2xl border border-secondary-200 ring-1 ring-secondary-900/5">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {loginError && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{loginError}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Input
                            id="username"
                            label="Username"
                            type="text"
                            autoComplete="username"
                            error={errors.username?.message}
                            {...register('username')}
                        />

                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={mutation.isPending}
                        >
                            {mutation.isPending ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-secondary-500">
                        Not a member?{' '}
                        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

