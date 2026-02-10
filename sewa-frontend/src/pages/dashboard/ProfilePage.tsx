import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { membersApi } from '../../api/members.api';
import type { MemberResponse } from '../../types/api.types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { UserCircleIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const ProfileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    organization: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['member', 'self'],
        queryFn: membersApi.getSelf,
    });

    const mutation = useMutation({
        mutationFn: (data: Partial<MemberResponse>) => membersApi.updateSelf(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['member', 'self'] });
            toast.success('Profile updated successfully.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to update profile.';
            toast.error(msg);
        },
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileSchema),
        values: profile ? {
            fullName: profile.fullName ?? '',
            email: profile.email ?? '',
            phone: profile.phone ?? '',
            address: profile.address ?? '',
            designation: profile.designation ?? '',
            organization: profile.organization ?? '',
        } : undefined,
    });

    const onSubmit = (data: ProfileFormValues) => mutation.mutate(data);

    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load profile. You may need to be a member.</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">My Profile</h1>
                <p className="mt-1 text-sm text-secondary-600">View and update your member information</p>
            </div>

            <Card>
                <CardHeader className="border-b border-secondary-200">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserCircleIcon className="h-8 w-8 text-primary-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{profile?.fullName}</CardTitle>
                            <p className="text-sm text-secondary-500">{profile?.username}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {profile?.membershipCode && (
                        <div className="mb-6 flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-3">
                            <IdentificationIcon className="h-5 w-5 text-primary-600" />
                            <span className="text-sm font-medium text-primary-900">Membership Code</span>
                            <span className="font-mono font-bold text-primary-700">{profile.membershipCode}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
                        <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message as string | undefined} />
                        <Input label="Email" type="email" {...register('email')} error={errors.email?.message as string | undefined} />
                        <Input label="Phone" type="tel" {...register('phone')} />
                        <Input label="Designation" {...register('designation')} />
                        <Input label="Organization" {...register('organization')} />
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Address</label>
                            <textarea rows={3} className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" {...register('address')} />
                        </div>
                        <Button type="submit" isLoading={mutation.isPending}>Save changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
