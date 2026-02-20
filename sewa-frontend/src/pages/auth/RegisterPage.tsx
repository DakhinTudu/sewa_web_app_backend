import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { authApi } from '../../api/auth.api';
import type { RegisterMemberFormValues } from '../../types/auth.forms';
import { RegisterMemberSchema, RegisterStudentSchema } from '../../types/auth.forms';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { cn } from '../../utils/cn';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-secondary-50 to-teal-50">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-center gap-2 mb-8">
                    <div className="h-12 w-12 rounded-full bg-primary-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        S
                    </div>
                    <span className="self-center text-xl font-bold text-primary-900">SEWA</span>
                </div>

                <h2 className="text-center text-2xl font-bold tracking-tight text-secondary-900">
                    Join SEWA
                </h2>
                <p className="mt-2 text-center text-sm text-secondary-600">
                    Register as a Member or Student
                </p>

                <div className="mt-8 shadow-xl rounded-2xl overflow-hidden border border-secondary-200">
                    <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
                        <TabList className="flex space-x-1 bg-primary-900 p-1.5">
                            {['Member', 'Student'].map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        cn(
                                            'w-full rounded-lg py-2.5 text-sm font-semibold leading-5 transition-all duration-200 focus:outline-none',
                                            selected
                                                ? 'bg-white text-primary-900 shadow-lg'
                                                : 'text-primary-100 hover:bg-white/10 hover:text-white'
                                        )
                                    }
                                >
                                    {category}
                                </Tab>
                            ))}
                        </TabList>
                        <TabPanels className="bg-white p-6 sm:p-8">
                            <TabPanel>
                                <MemberRegistrationForm toast={toast} navigate={navigate} />
                            </TabPanel>
                            <TabPanel>
                                <StudentRegistrationForm toast={toast} navigate={navigate} />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>

                <p className="mt-8 text-center text-sm text-secondary-500">
                    Already a member?{' '}
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

function MemberRegistrationForm({ toast, navigate }: { toast: any; navigate: any }) {
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterMemberFormValues>({
        resolver: zodResolver(RegisterMemberSchema)
    });

    const mutation = useMutation({
        mutationFn: (data: RegisterMemberFormValues) =>
            authApi.register({ ...data, memberType: 'MEMBER' }),
        onSuccess: () => {
            toast.success("Registration successful! Please login once your account is approved.");
            navigate('/login');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setSubmitError(errorMessage);
            toast.error(errorMessage);
        }
    });

    const onSubmit = (data: RegisterMemberFormValues) => {
        setSubmitError(null);
        mutation.mutate(data);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {submitError && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{submitError}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                    label="Full Name"
                    type="text"
                    error={errors.fullName?.message as string | undefined}
                    {...register('fullName')}
                />

                <Input
                    label="Phone"
                    type="tel"
                    error={errors.phone?.message as string | undefined}
                    {...register('phone')}
                />

                <div className="sm:col-span-2">
                    <Input
                        label="Email"
                        type="email"
                        error={errors.email?.message as string | undefined}
                        {...register('email')}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Input
                        label="Username"
                        type="text"
                        error={errors.username?.message as string | undefined}
                        {...register('username')}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Input
                        label="Password"
                        type="password"
                        helperText="Minimum 6 characters"
                        error={errors.password?.message as string | undefined}
                        {...register('password')}
                    />
                </div>

                <Input
                    label="Designation"
                    type="text"
                    placeholder="e.g., Software Engineer"
                    error={errors.designation?.message as string | undefined}
                    {...register('designation')}
                />

                <Input
                    label="Organization"
                    type="text"
                    placeholder="Current employer"
                    error={errors.organization?.message as string | undefined}
                    {...register('organization')}
                />

                <div className="sm:col-span-2">
                    <Input
                        label="Address"
                        type="text"
                        error={errors.address?.message as string | undefined}
                        {...register('address')}
                    />
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your registration will be pending until approved by an administrator.
                    You will receive your membership code (SEWAM###) upon approval.
                </p>
            </div>

            <Button
                type="submit"
                className="w-full"
                isLoading={mutation.isPending}
            >
                {mutation.isPending ? 'Registering...' : 'Register as Member'}
            </Button>
        </form>
    );
}

function StudentRegistrationForm({ toast, navigate }: { toast: any; navigate: any }) {
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<any>({
        resolver: zodResolver(RegisterStudentSchema)
    });

    const mutation = useMutation({
        mutationFn: (data: any) =>
            authApi.register({ ...data, memberType: 'STUDENT' }),
        onSuccess: () => {
            toast.success("Registration successful! Please login once your account is approved.");
            navigate('/login');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setSubmitError(errorMessage);
            toast.error(errorMessage);
        }
    });

    const onSubmit = (data: any) => {
        setSubmitError(null);
        mutation.mutate(data);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {submitError && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{submitError}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                    label="Full Name"
                    type="text"
                    error={errors.fullName?.message as string | undefined}
                    {...register('fullName')}
                />

                <Input
                    label="Phone"
                    type="tel"
                    error={errors.phone?.message as string | undefined}
                    {...register('phone')}
                />

                <div className="sm:col-span-2">
                    <Input
                        label="Email"
                        type="email"
                        error={errors.email?.message as string | undefined}
                        {...register('email')}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Input
                        label="Username"
                        type="text"
                        error={errors.username?.message as string | undefined}
                        {...register('username')}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Input
                        label="Password"
                        type="password"
                        helperText="Minimum 6 characters"
                        error={errors.password?.message as string | undefined}
                        {...register('password')}
                    />
                </div>

                <Input
                    label="Institute/College"
                    type="text"
                    placeholder="e.g., IIT Delhi"
                    error={errors.institute?.message as string | undefined}
                    {...register('institute')}
                />

                <Input
                    label="Course"
                    type="text"
                    placeholder="e.g., B.Tech Computer Science"
                    error={errors.course?.message as string | undefined}
                    {...register('course')}
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your registration will be pending until approved by an administrator.
                    You will receive your student code (SEWAS###) upon approval.
                </p>
            </div>

            <Button
                type="submit"
                className="w-full"
                isLoading={mutation.isPending}
            >
                {mutation.isPending ? 'Registering...' : 'Register as Student'}
            </Button>
        </form>
    );
}
