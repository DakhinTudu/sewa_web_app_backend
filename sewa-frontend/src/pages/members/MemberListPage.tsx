import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { membersApi } from '../../api/members.api';
import { Table } from '../../components/tables/Table';
import type { MemberResponse } from '../../types/api.types';
import { MembershipStatus } from '../../types/api.types';
import clsx from 'clsx';

function StatusBadge({ status }: { status: MembershipStatus }) {
    const styles = {
        [MembershipStatus.ACTIVE]: 'bg-green-50 text-green-700 ring-green-600/20',
        [MembershipStatus.PENDING]: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        [MembershipStatus.APPROVED]: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        [MembershipStatus.REJECTED]: 'bg-red-50 text-red-700 ring-red-600/20',
        [MembershipStatus.INACTIVE]: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                styles[status]
            )}
        >
            {status}
        </span>
    );
}

export default function MemberListPage() {
    const [page, _setPage] = useState(0);
    const pageSize = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['members', page],
        queryFn: () => membersApi.getAllMembers(page, pageSize),
    });

    const columns = [
        { header: 'Full Name', accessor: 'fullName' as const },
        { header: 'Organization', accessor: 'organization' as const },
        { header: 'Designation', accessor: 'designation' as const },
        { header: 'Status', accessor: (row: MemberResponse) => <StatusBadge status={row.membershipStatus} /> },
        {
            header: 'Actions', accessor: (_row: MemberResponse) => (
                <button className="text-primary-600 hover:text-primary-900">Edit</button>
            )
        },
    ];

    if (isError) return <div className="text-red-500">Error loading members.</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Members</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the members in your association including their name, organization, and status.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Add Member
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <Table
                    data={data?.content || []}
                    columns={columns}
                    keyExtractor={(row) => row.id}
                    isLoading={isLoading}
                />
                {/* Pagination controls would go here */}
            </div>
        </div>
    );
}
