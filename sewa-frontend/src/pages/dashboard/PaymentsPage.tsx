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
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';

export default function PaymentsPage() {
    const [showPay, setShowPay] = useState(false);
    const [financialYear, setFinancialYear] = useState('');
    const [amount, setAmount] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [remarks, setRemarks] = useState('');
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: profile } = useQuery({ queryKey: ['member', 'self'], queryFn: membersApi.getSelf });
    const code = profile?.membershipCode ?? '';

    const { data: fees, isLoading, isError } = useQuery({
        queryKey: ['fees', code],
        queryFn: () => feesApi.getByCode(code),
        enabled: !!code,
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

    const handleSubmit = () => {
        if (!financialYear || !amount || Number.isNaN(Number(amount))) {
            toast.error('Please fill financial year and amount.');
            return;
        }
        payMutation.mutate();
    };

    if (!code) return <div className="rounded-lg bg-amber-50 p-4 text-amber-800">Load your profile to see fee history. Membership code is required.</div>;
    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load fees.</div>;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Payments</h1>
                    <p className="mt-1 text-sm text-secondary-600">Fee history and submit payment</p>
                </div>
                <Button onClick={() => setShowPay(true)}>Record payment</Button>
            </div>

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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-200 bg-white">
                                    {fees?.map((f) => (
                                        <tr key={f.id}>
                                            <td className="px-4 py-3 text-sm text-secondary-900">{f.financialYear}</td>
                                            <td className="px-4 py-3 text-sm text-secondary-900">₹{f.amount}</td>
                                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${f.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{f.paymentStatus}</span></td>
                                            <td className="px-4 py-3 text-sm text-secondary-600">{f.paymentDate}</td>
                                            <td className="px-4 py-3 text-sm text-secondary-600">{f.receiptNumber || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal open={showPay} onClose={() => setShowPay(false)} title="Record payment">
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
        </div>
    );
}
