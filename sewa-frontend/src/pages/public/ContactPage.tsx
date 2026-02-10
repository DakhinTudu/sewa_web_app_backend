import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { messagingApi } from '../../api/messaging.api';

const ContactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

export default function ContactPage() {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ContactFormValues>({
        resolver: zodResolver(ContactSchema)
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            // Send message to admin account (assuming 'admin' is the default recipient)
            await messagingApi.send({
                subject: data.subject,
                content: `From: ${data.name} (${data.email})\n\n${data.message}`,
                recipientUsername: 'admin',
                priority: 'NORMAL'
            });
            toast.success('Message sent successfully! We will get back to you soon.');
            reset();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-primary-50 to-white">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Contact Us
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Get in touch with SEWA. We're here to help and answer any questions you may have.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Information & Form */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                                            <item.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                                        <p className="mt-1 text-sm text-gray-600">{item.value}</p>
                                        {item.extra && <p className="mt-1 text-sm text-gray-600">{item.extra}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Office Hours</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 2:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <Input
                                            label="Your Name"
                                            type="text"
                                            placeholder="John Doe"
                                            error={errors.name?.message}
                                            {...register('name')}
                                        />

                                        <Input
                                            label="Email Address"
                                            type="email"
                                            placeholder="john@example.com"
                                            error={errors.email?.message}
                                            {...register('email')}
                                        />
                                    </div>

                                    <Input
                                        label="Subject"
                                        type="text"
                                        placeholder="How can we help you?"
                                        error={errors.subject?.message}
                                        {...register('subject')}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            rows={6}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Tell us more about your inquiry..."
                                            {...register('message')}
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto"
                                        isLoading={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Map Section (Placeholder) */}
            <div className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Map integration coming soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const contactInfo = [
    {
        icon: EnvelopeIcon,
        title: 'Email',
        value: 'contact@santalengineers.org',
        extra: 'info@santalengineers.org'
    },
    {
        icon: PhoneIcon,
        title: 'Phone',
        value: '+91 1234567890',
        extra: '+91 0987654321'
    },
    {
        icon: MapPinIcon,
        title: 'Address',
        value: '123 SEWA Office, Main Road',
        extra: 'Ranchi, Jharkhand - 834001, India'
    }
];
