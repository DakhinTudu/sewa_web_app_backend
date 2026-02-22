import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { membersApi } from '../../api/members.api';
import { chaptersApi } from '../../api/chapters.api';
import type { MemberResponse } from '../../types/api.types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { UserCircleIcon, IdentificationIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { masterApi } from '../../api/master.api';
import { MembershipStatus } from '../../types/api.types';

const ProfileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    address: z.string().optional(),
    permanentAddress: z.string().optional(),
    designation: z.string().optional(),
    organization: z.string().optional(),
    educationalLevel: z.string().optional(),
    workingSector: z.string().optional(),
    gender: z.string().optional(),
    chapterId: z.union([z.number(), z.string()]).optional(),
    college: z.string().optional(),
    university: z.string().optional(),
    graduationYear: z.union([z.number(), z.string()]).optional(),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

function isProfileIncomplete(p: MemberResponse | null): boolean {
    if (!p || !p.id || p.membershipStatus !== MembershipStatus.ACTIVE) return false;
    const hasPhone = !!p.phone?.trim();
    const hasAddress = !!p.address?.trim();
    const hasDesignation = !!p.designation?.trim();
    const hasChapter = p.chapterId != null;
    return !hasPhone || !hasAddress || !hasDesignation || !hasChapter;
}

export default function ProfilePage() {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['member', 'self'],
        queryFn: membersApi.getSelf,
    });

    const { data: masterData } = useQuery({
        queryKey: ['master-data'],
        queryFn: masterApi.getAllMasterData,
    });

    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters-list'],
        queryFn: chaptersApi.getAllChapters,
    });

    const isAdminOnly = profile && !profile.id;
    const showCompleteBanner = !isAdminOnly && profile && isProfileIncomplete(profile);

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

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileSchema),
        values: profile ? {
            fullName: profile.fullName ?? '',
            email: profile.email ?? '',
            phone: profile.phone ?? '',
            address: profile.address ?? '',
            permanentAddress: profile.permanentAddress ?? '',
            designation: profile.designation ?? '',
            organization: profile.organization ?? '',
            educationalLevel: profile.educationalLevel ?? '',
            workingSector: profile.workingSector ?? '',
            gender: profile.gender ?? '',
            chapterId: profile.chapterId != null ? profile.chapterId : '',
            college: profile.college ?? '',
            university: profile.university ?? '',
            graduationYear: profile.graduationYear != null ? profile.graduationYear : '',
        } : undefined,
    });

    const onSubmit = (data: ProfileFormValues) => {
        const chId = data.chapterId === '' || data.chapterId == null ? undefined : Number(data.chapterId);
        const gradYear = data.graduationYear === '' || data.graduationYear == null ? undefined : Number(data.graduationYear);
        const payload: Partial<MemberResponse> = {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || undefined,
            address: data.address || undefined,
            permanentAddress: data.permanentAddress || undefined,
            designation: data.designation || undefined,
            organization: data.organization || undefined,
            educationalLevel: data.educationalLevel || undefined,
            workingSector: data.workingSector || undefined,
            gender: data.gender || undefined,
            college: data.college || undefined,
            university: data.university || undefined,
            graduationYear: typeof gradYear === 'number' && !Number.isNaN(gradYear) ? gradYear : undefined,
            chapterId: typeof chId === 'number' && !Number.isNaN(chId) ? chId : undefined,
        };
        mutation.mutate(payload);
    };

    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load profile. Please try again.</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">My Profile</h1>
                <p className="mt-1 text-sm text-secondary-600">View and update your account information. Complete all fields after approval.</p>
            </div>

            {/* Complete your profile — for approved members with missing key fields */}
            {showCompleteBanner && (
                <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-800">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-semibold">Complete your profile</p>
                        <p>Please fill in Phone, Address, Designation, and Chapter below. Save your changes when done.</p>
                    </div>
                </div>
            )}

            {isAdminOnly && (
                <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-blue-800">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm">
                        <span className="font-semibold">Administrator Account</span> — This account does not have an associated member profile.
                    </p>
                </div>
            )}

            <Card>
                <CardHeader className="border-b border-secondary-200">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserCircleIcon className="h-8 w-8 text-primary-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{profile?.fullName || profile?.username}</CardTitle>
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
                        <Input
                            label="Full Name"
                            {...register('fullName')}
                            error={errors.fullName?.message as string | undefined}
                            readOnly={isAdminOnly}
                        />
                        <Input
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message as string | undefined}
                            readOnly={isAdminOnly}
                        />
                        {!isAdminOnly && (
                            <>
                                <Input label="Phone" type="tel" placeholder="e.g. 9876543210" {...register('phone')} />
                                <Input label="Designation" placeholder="e.g. Engineer" {...register('designation')} />
                                <Input label="Organization" {...register('organization')} />

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Chapter</label>
                                    <select
                                        {...register('chapterId')}
                                        className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select Chapter</option>
                                        {chapters.map((ch) => (
                                            <option key={ch.id} value={ch.id}>{ch.chapterName} ({ch.chapterType})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Educational Level</label>
                                        <select
                                            {...register('educationalLevel')}
                                            className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="">Select Level</option>
                                            {masterData?.educationalLevels?.map((v) => <option key={v.id} value={v.name}>{v.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Working Sector</label>
                                        <select
                                            {...register('workingSector')}
                                            className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="">Select Sector</option>
                                            {masterData?.workingSectors?.map((v) => <option key={v.id} value={v.name}>{v.name.replace('_', ' ')}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Gender</label>
                                    <select
                                        {...register('gender')}
                                        className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select Gender</option>
                                        {masterData?.genders?.map((v) => <option key={v.id} value={v.name}>{v.name}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="College" {...register('college')} />
                                    <Input label="University" {...register('university')} />
                                </div>
                                <Input
                                    label="Graduation Year"
                                    type="number"
                                    placeholder="e.g. 2015"
                                    min={1950}
                                    max={2030}
                                    {...register('graduationYear', { valueAsNumber: true })}
                                    error={errors.graduationYear?.message as string | undefined}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Current address</label>
                                    <textarea
                                        rows={3}
                                        className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Current / present address"
                                        {...register('address')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Permanent address</label>
                                    <textarea
                                        rows={3}
                                        className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Permanent address"
                                        {...register('permanentAddress')}
                                    />
                                </div>
                                <Button type="submit" isLoading={mutation.isPending}>Save changes</Button>
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
