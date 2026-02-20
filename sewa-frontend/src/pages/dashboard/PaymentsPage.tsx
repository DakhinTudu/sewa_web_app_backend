import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { membersApi } from '../../api/members.api';
import { feesApi } from '../../api/fees.api';
import { dropdownsApi } from '../../api/dropdowns.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { CurrencyRupeeIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../../components/ui/Dropdown';
import { StatusBadge } from '../../components/ui/StatusBadge';

const PAGE_SIZE = 20;

export default function PaymentsPage() {
    const [showPay, setShowPay] = useState(false);
    const [financialYear, setFinancialYear] = useState('');
    const [amount, setAmount] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [remarks, setRemarks] = useState('');
    const [allFeesPage, setAllFeesPage] = useState(0);
    const [editId, setEditId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSearch, setTempSearch] = useState('');
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: profile, isLoading: profileLoading } = useQuery({ queryKey: ['member', 'self'], queryFn: membersApi.getSelf });
    const code = profile?.membershipCode ?? '';

    const { data: fees, isLoading: feesLoading, isError: feesError } = useQuery({
        queryKey: ['fees', code],
        queryFn: () => feesApi.getByCode(code),
        enabled: !!code,
    });

    const { data: allFeesData, isLoading: allFeesLoading, isError: allFeesError } = useQuery({
        queryKey: ['fees', 'all', allFeesPage, searchQuery],
        queryFn: () => feesApi.getAllFees(allFeesPage, PAGE_SIZE, searchQuery),
        enabled: !code,
    });

    const { data: financialYears } = useQuery({
        queryKey: ['dropdowns', 'financial-years'],
        queryFn: dropdownsApi.getFinancialYears,
    });

    const payMutation = useMutation({
        mutationFn: () => feesApi.addFee({
            membershipCode: code,
            financialYear,
            amount: Number(amount),
            receiptNumber: receiptNumber || undefined,
            remarks: remarks || undefined,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees', code] });
            queryClient.invalidateQueries({ queryKey: ['fees', 'all'] });
            setShowPay(false);
            setFinancialYear('');
            setAmount('');
            setReceiptNumber('');
            setRemarks('');
            toast.success('Fee record submitted.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to submit fee.';
            toast.error(msg);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => feesApi.updateFee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            setEditId(null);
            toast.success('Fee record updated.');
        },
        onError: () => toast.error('Failed to update fee record.'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => feesApi.deleteFee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            toast.success('Fee record deleted.');
        },
        onError: () => toast.error('Failed to delete fee record.'),
    });

    const handleSubmit = () => {
        if (!financialYear || !amount || Number.isNaN(Number(amount))) {
            toast.error('Please fill financial year and amount.');
            return;
        }
        payMutation.mutate();
    };

    const showAllFees = !code;
    const isLoading = showAllFees ? (profileLoading || allFeesLoading) : (profileLoading || feesLoading);
    const isError = showAllFees ? allFeesError : feesError;
    const allFees = allFeesData?.content ?? [];
    const totalPages = allFeesData?.totalPages ?? 0;

    if (profileLoading && !code) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isLoading && !showAllFees) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError && !showAllFees) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load fees.</div>;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Payments</h1>
                    <p className="mt-1 text-sm text-secondary-600">
                        {showAllFees ? 'All fee records (admin view)' : 'Fee history and submit payment'}
                    </p>
                </div>
                {code && <Button onClick={() => setShowPay(true)}>Record payment</Button>}
            </div>

            {showAllFees ? (
                <>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-secondary-400" />
                            <input
                                type="text"
                                placeholder="Search member, code or receipt..."
                                className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setSearchQuery(tempSearch)} className="w-full md:w-auto">Search</Button>
                            <Button variant="outline" onClick={() => { setTempSearch(''); setSearchQuery(''); }} className="md:hidden">Reset</Button>
                        </div>
                    </div>

                    {allFeesError && <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load fee records.</div>}
                    {!allFeesError && (
                        <Card>
                            <CardContent className="p-0">
                                {allFeesLoading ? (
                                    <div className="flex justify-center py-12"><Spinner size="lg" /></div>
                                ) : allFees.length === 0 ? (
                                    <div className="py-12 text-center text-secondary-500">
                                        <CurrencyRupeeIcon className="mx-auto h-12 w-12 text-secondary-400" />
                                        <p className="mt-2">No fee records yet.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-secondary-200">
                                                <thead className="bg-secondary-50">
                                                    <tr>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Member</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Code</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Year</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Amount</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Date</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Receipt</th>
                                                        <th className="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-secondary-200 bg-white">
                                                    {allFees.map((f) => (
                                                        <tr key={f.id}>
                                                            <td className="px-3 py-3 text-sm font-medium text-secondary-900 w-full min-w-[120px]">{f.memberName ?? '—'}</td>
                                                            <td className="px-3 py-3 text-sm font-mono text-secondary-700 hidden sm:table-cell">{f.membershipCode}</td>
                                                            <td className="px-3 py-3 text-sm text-secondary-900 hidden md:table-cell">{f.financialYear}</td>
                                                            <td className="px-3 py-3 text-sm text-secondary-900 hidden md:table-cell">₹{f.amount}</td>
                                                            <td className="px-3 py-3 w-0"><StatusBadge status={f.paymentStatus} showLabel={false} /></td>
                                                            <td className="px-3 py-3 text-sm text-secondary-600 hidden md:table-cell">{f.paymentDate}</td>
                                                            <td className="px-3 py-3 text-sm text-secondary-600 hidden md:table-cell">{f.receiptNumber || '—'}</td>
                                                            <td className="px-3 py-3 text-center w-0">
                                                                <Dropdown
                                                                    minimal
                                                                    icon={<EllipsisVerticalIcon className="h-5 w-5" />}
                                                                    items={[
                                                                        {
                                                                            label: 'Edit',
                                                                            icon: <PencilSquareIcon className="h-4 w-4" />,
                                                                            onClick: () => {
                                                                                setEditId(f.id);
                                                                                setFinancialYear(f.financialYear);
                                                                                setAmount(f.amount.toString());
                                                                                setReceiptNumber(f.receiptNumber || '');
                                                                                setRemarks(f.remarks || '');
                                                                            },
                                                                        },
                                                                        {
                                                                            label: 'Delete',
                                                                            icon: <TrashIcon className="h-4 w-4" />,
                                                                            onClick: () => {
                                                                                if (window.confirm('Are you certain you want to delete this fee record? This action cannot be undone.')) {
                                                                                    deleteMutation.mutate(f.id);
                                                                                }
                                                                            },
                                                                            variant: 'danger',
                                                                        },
                                                                    ]}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between border-t border-secondary-200 px-4 py-3">
                                                <Button variant="outline" size="sm" disabled={allFeesPage === 0} onClick={() => setAllFeesPage((p) => p - 1)}>Previous</Button>
                                                <span className="text-sm text-secondary-600">Page {allFeesPage + 1} of {totalPages}</span>
                                                <Button variant="outline" size="sm" disabled={allFeesPage >= totalPages - 1} onClick={() => setAllFeesPage((p) => p + 1)}>Next</Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        {(fees?.length ?? 0) === 0 ? (
                            <div className="py-12 text-center text-secondary-500">
                                <CurrencyRupeeIcon className="mx-auto h-12 w-12 text-secondary-400" />
                                <p className="mt-2">No fee records yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-secondary-200">
                                    <thead className="bg-secondary-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Year</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-200 bg-white">
                                        {fees?.map((f) => (
                                            <tr key={f.id}>
                                                <td className="px-4 py-3 text-sm font-medium text-secondary-900 w-full">{f.financialYear}</td>
                                                <td className="px-4 py-3 text-sm text-secondary-900 w-0 whitespace-nowrap">₹{f.amount}</td>
                                                <td className="px-4 py-3 w-0"><StatusBadge status={f.paymentStatus} showLabel={false} /></td>
                                                <td className="px-4 py-3 text-sm text-secondary-600 hidden md:table-cell">{f.paymentDate}</td>
                                                <td className="px-4 py-3 text-sm text-secondary-600 hidden md:table-cell">{f.receiptNumber || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {code && (
                <Modal isOpen={showPay} onClose={() => setShowPay(false)} title="Record payment">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Financial year</label>
                            <select className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                                <option value="">Select</option>
                                {financialYears?.map((fy) => <option key={fy.value} value={fy.value}>{fy.label}</option>)}
                            </select>
                        </div>
                        <Input label="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
                        <Input label="Receipt number" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Remarks</label>
                            <textarea rows={2} className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowPay(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} isLoading={payMutation.isPending}>Submit</Button>
                        </div>
                    </div>
                </Modal>
            )}

            <Modal isOpen={editId !== null} onClose={() => setEditId(null)} title="Edit payment record">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Financial year</label>
                        <select className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                            {financialYears?.map((fy) => <option key={fy.value} value={fy.value}>{fy.label}</option>)}
                        </select>
                    </div>
                    <Input label="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <Input label="Receipt number" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Remarks</label>
                        <textarea rows={2} className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                        <Button onClick={() => {
                            if (editId) {
                                updateMutation.mutate({
                                    id: editId,
                                    data: {
                                        financialYear,
                                        amount: Number(amount),
                                        receiptNumber,
                                        remarks,
                                    }
                                });
                            }
                        }} isLoading={updateMutation.isPending}>Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
