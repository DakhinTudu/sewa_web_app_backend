import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../api/messaging.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function MessagesPage() {
    const [composeOpen, setComposeOpen] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: messages, isLoading, isError } = useQuery({
        queryKey: ['messages'],
        queryFn: messagingApi.getAll,
    });

    const sendMutation = useMutation({
        mutationFn: () => messagingApi.send({ recipientUsername: recipient, subject, content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            setComposeOpen(false);
            setRecipient('');
            setSubject('');
            setContent('');
            toast.success('Message sent.');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to send message.';
            toast.error(msg);
        },
    });

    const handleSend = () => {
        if (!recipient.trim() || !subject.trim() || !content.trim()) {
            toast.error('Please fill recipient, subject and content.');
            return;
        }
        sendMutation.mutate();
    };

    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Failed to load messages.</div>;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Messages</h1>
                    <p className="mt-1 text-sm text-secondary-600">Internal messaging</p>
                </div>
                <Button onClick={() => setComposeOpen(true)} leftIcon={<PaperAirplaneIcon className="h-5 w-5" />}>
                    Compose
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {(messages?.length ?? 0) === 0 ? (
                        <div className="py-12 text-center text-secondary-500">
                            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-secondary-400" />
                            <p className="mt-2">No messages yet.</p>
                            <Button className="mt-4" variant="outline" onClick={() => setComposeOpen(true)}>Compose</Button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-secondary-200">
                            {messages?.map((m) => (
                                <li key={m.id} className="px-4 py-3 hover:bg-secondary-50">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-secondary-900">{m.subject}</span>
                                        <span className="text-sm text-secondary-500">{m.sentAt}</span>
                                    </div>
                                    <p className="text-sm text-secondary-600">From: {m.senderUsername}</p>
                                    <p className="mt-1 text-sm text-secondary-600 line-clamp-2">{m.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="Compose message">
                <div className="space-y-4">
                    <Input label="To (username)" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="username" />
                    <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Message</label>
                        <textarea rows={4} className="block w-full rounded-md border border-secondary-300 px-3 py-2 text-sm" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
                        <Button onClick={handleSend} isLoading={sendMutation.isPending}>Send</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
