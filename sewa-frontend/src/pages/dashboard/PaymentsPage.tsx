import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { membersApi } from '../../api/members.api';
import { feesApi } from '../../api/fees.api';
import { dropdownsApi } from '../../api/dropdowns.api';
import { useDebouncedSearchQuery } from '../../hooks/useDebouncedSearchQuery';
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
const SEARCH_DEBOUNCE_MS = 400;
const SEARCH_MIN_LENGTH = 3;

export default function PaymentsPage() {
    const [showPay, setShowPay] = useState(false);
    const [financialYear, setFinancialYear] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [feeDate, setFeeDate] = useState(new Date().toISOString().split('T')[0]);
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [remarks, setRemarks] = useState('');
    const [allFeesPage, setAllFeesPage] = useState(0);
    const [editId, setEditId] = useState<number | null>(null);
    const [showRejectionModal, setShowRejectionModal] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showAdminAdd, setShowAdminAdd] = useState(false);
    const [adminMembershipCode, setAdminMembershipCode] = useState('');
    const [searchInput, setSearchInput, appliedSearchQuery] = useDebouncedSearchQuery({
        debounceMs: SEARCH_DEBOUNCE_MS,
        minLength: SEARCH_MIN_LENGTH,
    });
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
        queryKey: ['fees', 'all', allFeesPage, appliedSearchQuery],
        queryFn: ({ signal }) =>
            feesApi.getAllFees(allFeesPage, PAGE_SIZE, appliedSearchQuery || undefined, undefined, undefined, { signal }),
        enabled: !code, // Only for admins
    });

    const { data: financialYears } = useQuery({
        queryKey: ['dropdowns', 'financial-years'],
        queryFn: dropdownsApi.getFinancialYears,
    });

    const payMutation = useMutation({
        mutationFn: (data: any) => feesApi.submitPayment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees', code] });
            queryClient.invalidateQueries({ queryKey: ['fees', 'all'] });
            setShowPay(false);
            setFinancialYear('');
            setAmount('');
            setTransactionId('');
            setPaymentMethod('');
            setScreenshotUrl('');
            setRemarks('');
            toast.success('Payment submitted for approval.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to submit payment.';
            toast.error(msg);
        },
    });

    const adminAddMutation = useMutation({
        mutationFn: (data: any) => feesApi.addFee(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            setShowAdminAdd(false);
            setAdminMembershipCode('');
            setFinancialYear('');
            setAmount('');
            setTransactionId('');
            setPaymentMethod('');
            setRemarks('');
            toast.success('Fee record added successfully.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to add fee record.';
            toast.error(msg);
        },
    });

    const approveMutation = useMutation({
        mutationFn: (id: number) => feesApi.approvePayment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            toast.success('Payment approved.');
        },
        onError: () => toast.error('Failed to approve payment.'),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) => feesApi.rejectPayment(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            setShowRejectionModal(null);
            setRejectionReason('');
            toast.success('Payment rejected.');
        },
        onError: () => toast.error('Failed to reject payment.'),
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
        if (!financialYear || !amount || !transactionId || !paymentMethod || !feeDate) {
            toast.error('Please fill all required fields.');
            return;
        }
        payMutation.mutate({
            membershipCode: code,
            financialYear,
            amount: Number(amount),
            transactionId,
            paymentMethod,
            feeDate,
            screenshotUrl,
            remarks,
        });
    };

    const handleSubmitAdmin = () => {
        if (!adminMembershipCode || !financialYear || !amount) {
            toast.error('Please fill Membership Code, Financial Year and Amount.');
            return;
        }
        adminAddMutation.mutate({
            membershipCode: adminMembershipCode,
            financialYear,
            amount: Number(amount),
            transactionId,
            paymentMethod,
            feeDate,
            remarks,
            status: 'PAID'
        });
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
                        {showAllFees ? 'All payment submissions' : 'Fee history and submit payment'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {showAllFees && (
                        <Button variant="outline" onClick={() => setShowAdminAdd(true)}>
                            Add Record
                        </Button>
                    )}
                    {code && <Button onClick={() => setShowPay(true)}>Submit payment</Button>}
                </div>
            </div>

            {showAllFees ? (
                <>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-secondary-400" />
                            <input
                                type="text"
                                placeholder="Search member, code or transaction ID..."
                                className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" onClick={() => setSearchInput('')} className="md:self-auto">Clear</Button>
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
                                        <p className="mt-2">No payment submissions yet.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-secondary-200">
                                                <thead className="bg-secondary-50">
                                                    <tr>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Member</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Year</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Amount</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Method</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Tx ID</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Proof</th>
                                                        <th className="px-3 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-secondary-200 bg-white">
                                                    {allFees.map((f) => (
                                                        <tr key={f.id}>
                                                            <td className="px-3 py-3 text-sm font-medium text-secondary-900 min-w-[120px]">
                                                                {f.memberName}<br />
                                                                <span className="text-xs font-mono text-secondary-500">{f.membershipCode}</span>
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-secondary-900">{f.financialYear}</td>
                                                            <td className="px-3 py-3 text-sm text-secondary-900">₹{f.amount}</td>
                                                            <td className="px-3 py-3"><StatusBadge status={f.paymentStatus} showLabel={false} /></td>
                                                            <td className="px-3 py-3 text-sm text-secondary-600 hidden md:table-cell">{f.paymentMethod || '—'}</td>
                                                            <td className="px-3 py-3 text-sm font-mono text-secondary-600 hidden md:table-cell">{f.transactionId || '—'}</td>
                                                            <td className="px-3 py-3 text-sm text-secondary-600 hidden md:table-cell">
                                                                {f.screenshotUrl ? (
                                                                    <a href={f.screenshotUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">View</a>
                                                                ) : '—'}
                                                            </td>
                                                            <td className="px-3 py-3 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    {f.paymentStatus === 'PENDING' && (
                                                                        <>
                                                                            <Button size="sm" onClick={() => approveMutation.mutate(f.id)} isLoading={approveMutation.isPending && approveMutation.variables === f.id}>Approve</Button>
                                                                            <Button variant="outline" size="sm" onClick={() => setShowRejectionModal(f.id)}>Reject</Button>
                                                                        </>
                                                                    )}
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
                                                                                    setTransactionId(f.transactionId || '');
                                                                                    setRemarks(f.remarks || '');
                                                                                },
                                                                            },
                                                                            {
                                                                                label: 'Delete',
                                                                                icon: <TrashIcon className="h-4 w-4" />,
                                                                                onClick: () => {
                                                                                    if (window.confirm('Are you certain you want to delete this fee record?')) {
                                                                                        deleteMutation.mutate(f.id);
                                                                                    }
                                                                                },
                                                                                variant: 'danger',
                                                                            },
                                                                        ]}
                                                                    />
                                                                </div>
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
                                <p className="mt-2">No payment submissions yet.</p>
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
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase hidden md:table-cell">Tx ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-200 bg-white">
                                        {fees?.map((f) => (
                                            <tr key={f.id}>
                                                <td className="px-4 py-3 text-sm font-medium text-secondary-900">{f.financialYear}</td>
                                                <td className="px-4 py-3 text-sm text-secondary-900 whitespace-nowrap">₹{f.amount}</td>
                                                <td className="px-4 py-3"><StatusBadge status={f.paymentStatus} showLabel={true} /></td>
                                                <td className="px-4 py-3 text-sm text-secondary-600 hidden md:table-cell">{f.paymentDate}</td>
                                                <td className="px-4 py-3 text-sm font-mono text-secondary-600 hidden md:table-cell">{f.transactionId || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Modal isOpen={showPay} onClose={() => setShowPay(false)} title="Submit payment submission">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Financial year *</label>
                        <select className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                            <option value="">Select</option>
                            {financialYears?.map((fy) => <option key={fy.value} value={fy.value}>{fy.label}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Amount (₹) *" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
                        <Input label="Date of Payment *" type="date" value={feeDate} onChange={(e) => setFeeDate(e.target.value)} />
                    </div>
                    <Input label="Transaction ID *" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter UPI/Bank Ref No." />
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Payment Method *</label>
                        <div className="flex gap-4">
                            <label className="flex items-center text-sm">
                                <input type="radio" name="method" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> UPI
                            </label>
                            <label className="flex items-center text-sm">
                                <input type="radio" name="method" value="BANK" checked={paymentMethod === 'BANK'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Bank Transfer
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Proof screenshot url</label>
                        <Input value={screenshotUrl} onChange={(e) => setScreenshotUrl(e.target.value)} placeholder="Paste screenshot link here (optional)" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Remarks</label>
                        <textarea rows={2} className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setShowPay(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={payMutation.isPending}>Submit Payment</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showAdminAdd} onClose={() => setShowAdminAdd(false)} title="Add Member Payment Record">
                <div className="space-y-4">
                    <Input label="Membership Code *" value={adminMembershipCode} onChange={(e) => setAdminMembershipCode(e.target.value)} placeholder="e.g. SEWAM001" />
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Financial year *</label>
                        <select className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                            <option value="">Select</option>
                            {financialYears?.map((fy) => <option key={fy.value} value={fy.value}>{fy.label}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Amount (₹) *" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
                        <Input label="Date *" type="date" value={feeDate} onChange={(e) => setFeeDate(e.target.value)} />
                    </div>
                    <Input label="Transaction/Receipt ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Payment Method</label>
                        <div className="flex gap-4">
                            <label className="flex items-center text-sm">
                                <input type="radio" name="method-admin" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> UPI
                            </label>
                            <label className="flex items-center text-sm">
                                <input type="radio" name="method-admin" value="BANK" checked={paymentMethod === 'BANK'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Bank Transfer
                            </label>
                            <label className="flex items-center text-sm">
                                <input type="radio" name="method-admin" value="CASH" checked={paymentMethod === 'CASH'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Cash
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Remarks</label>
                        <textarea rows={2} className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setShowAdminAdd(false)}>Cancel</Button>
                        <Button onClick={handleSubmitAdmin} isLoading={adminAddMutation.isPending}>Add Record</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showRejectionModal !== null} onClose={() => setShowRejectionModal(null)} title="Reject payment">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Reason for rejection</label>
                        <textarea
                            rows={3}
                            className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., Invalid transaction ID, screenshot unclear"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowRejectionModal(null)}>Cancel</Button>
                        <Button variant="danger" onClick={() => showRejectionModal && rejectMutation.mutate({ id: showRejectionModal, reason: rejectionReason })} isLoading={rejectMutation.isPending}>Confirm Rejection</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editId !== null} onClose={() => setEditId(null)} title="Edit payment record">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Financial year</label>
                        <select className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                            {financialYears?.map((fy) => <option key={fy.value} value={fy.value}>{fy.label}</option>)}
                        </select>
                    </div>
                    <Input label="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <Input label="Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
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
                                        transactionId,
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
