import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { authApi } from '../../api/auth.api';
import type {
    ForgotPasswordEmailValues,
    ResetPasswordFormValues,
} from '../../types/auth.forms';
import {
    ForgotPasswordEmailSchema,
    ResetPasswordSchema,
} from '../../types/auth.forms';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_VALID_MINUTES = 15;

export default function ForgotPasswordPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [emailSentTo, setEmailSentTo] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otpValidated, setOtpValidated] = useState(false);

    const emailForm = useForm<ForgotPasswordEmailValues>({
        resolver: zodResolver(ForgotPasswordEmailSchema),
    });

    const resetForm = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: { email: '' },
    });

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, [resendCooldown]);

    const forgotMutation = useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email),
        onSuccess: (data) => {
            const email = data?.email ?? '';
            setEmailSentTo(email);
            setStep('reset');
            resetForm.setValue('email', email);
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
            toast.success(email ? `OTP sent successfully to ${email}. Check your inbox.` : 'OTP sent. Check your inbox.');
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || error.response?.data?.data?.message;
            const firstField = error.response?.data?.data && typeof error.response.data.data === 'object'
                ? Object.values(error.response.data.data)[0]
                : null;
            toast.error(firstField || msg || 'Something went wrong. Try again.');
        },
    });

    const validateOtpMutation = useMutation({
        mutationFn: (data: { email: string; otp: string }) => authApi.validateOtp(data),
        onSuccess: () => {
            setOtpValidated(true);
            toast.success('OTP is valid. You can set your new password.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP. Try again.');
        },
    });

    const resetMutation = useMutation({
        mutationFn: (data: ResetPasswordFormValues) =>
            authApi.resetPassword({
                email: data.email,
                otp: data.otp,
                newPassword: data.newPassword,
            }),
        onSuccess: () => {
            toast.success('Password reset successfully. You can sign in now.');
            setStep('email');
            setEmailSentTo('');
            setResendCooldown(0);
            setOtpValidated(false);
            resetForm.reset();
            navigate('/login', { replace: true });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message;
            const firstField = error.response?.data?.data && typeof error.response.data.data === 'object'
                ? Object.values(error.response.data.data)[0]
                : null;
            toast.error(firstField || msg || 'Invalid or expired OTP. Try again.');
        },
    });

    const onRequestOtp = (data: ForgotPasswordEmailValues) => {
        forgotMutation.mutate(data.email);
    };

    const onResendOtp = () => {
        const email = resetForm.getValues('email') || emailSentTo;
        if (!email) {
            toast.error('Email is required.');
            return;
        }
        if (resendCooldown > 0) return;
        forgotMutation.mutate(email);
    };

    const onValidateOtp = () => {
        const email = resetForm.getValues('email')?.trim() || emailSentTo;
        const otp = resetForm.getValues('otp')?.trim() || '';
        if (!email) {
            toast.error('Please enter your email.');
            return;
        }
        if (otp.length !== 6) {
            toast.error('Please enter the 6-digit OTP.');
            return;
        }
        setOtpValidated(false);
        validateOtpMutation.mutate({ email, otp });
    };

    const onResetPassword = (data: ResetPasswordFormValues) => {
        resetMutation.mutate(data);
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
                    Reset password
                </h2>
                <p className="mt-2 text-center text-sm text-secondary-600">
                    {step === 'email'
                        ? 'Enter your email to receive a one-time password (OTP).'
                        : `Enter the 6-digit OTP sent to ${emailSentTo || 'your email'}. OTP is valid for ${OTP_VALID_MINUTES} minutes.`}
                </p>

                <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-2xl border border-secondary-200 ring-1 ring-secondary-900/5">
                    {step === 'email' ? (
                        <form
                            className="space-y-6"
                            onSubmit={emailForm.handleSubmit(onRequestOtp)}
                        >
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                error={emailForm.formState.errors.email?.message}
                                {...emailForm.register('email')}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={forgotMutation.isPending}
                            >
                                {forgotMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                        </form>
                    ) : (
                        <form
                            className="space-y-6"
                            onSubmit={resetForm.handleSubmit(onResetPassword)}
                        >
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                autoComplete="email"
                                error={resetForm.formState.errors.email?.message}
                                {...resetForm.register('email')}
                            />
                            <div className="space-y-2">
                                <Input
                                    id="otp"
                                    label="OTP (6 digits)"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    placeholder="000000"
                                    maxLength={6}
                                    error={resetForm.formState.errors.otp?.message}
                                    {...resetForm.register('otp', {
                                        onChange: () => setOtpValidated(false),
                                    })}
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            (resetForm.watch('otp')?.length ?? 0) !== 6 ||
                                            validateOtpMutation.isPending ||
                                            otpValidated
                                        }
                                        onClick={onValidateOtp}
                                    >
                                        {validateOtpMutation.isPending
                                            ? 'Validating...'
                                            : otpValidated
                                              ? 'OTP validated'
                                              : 'Validate OTP'}
                                    </Button>
                                    {otpValidated && (
                                        <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                            <CheckCircleIcon className="h-5 w-5" />
                                            OTP is valid
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-secondary-600">
                                    Didn&apos;t receive the code?
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={resendCooldown > 0 || forgotMutation.isPending}
                                    onClick={onResendOtp}
                                >
                                    {resendCooldown > 0
                                        ? `Resend OTP in ${resendCooldown}s`
                                        : 'Resend OTP'}
                                </Button>
                            </div>
                            <Input
                                id="newPassword"
                                label="New password"
                                type="password"
                                autoComplete="new-password"
                                error={resetForm.formState.errors.newPassword?.message}
                                {...resetForm.register('newPassword')}
                            />
                            <Input
                                id="confirmPassword"
                                label="Confirm password"
                                type="password"
                                autoComplete="new-password"
                                error={resetForm.formState.errors.confirmPassword?.message}
                                {...resetForm.register('confirmPassword')}
                            />
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setStep('email');
                                        setEmailSentTo('');
                                        setResendCooldown(0);
                                        setOtpValidated(false);
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    isLoading={resetMutation.isPending}
                                >
                                    {resetMutation.isPending ? 'Resetting...' : 'Reset password'}
                                </Button>
                            </div>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-secondary-500">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-primary-600 hover:text-primary-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
