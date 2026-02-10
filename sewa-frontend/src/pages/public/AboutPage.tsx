import { Card, CardContent } from '../../components/ui/Card';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-primary-50 to-white">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            About SEWA
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Santal Engineers Welfare Association - Empowering our community through engineering excellence
                        </p>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Our History</h2>
                    <div className="prose prose-lg text-gray-600">
                        <p>
                            The Santal Engineers Welfare Association (SEWA) was established with a vision to create a unified platform
                            for Santal engineers across India. Our journey began with a small group of dedicated professionals who
                            recognized the need for a collective voice and support system within our community.
                        </p>
                        <p className="mt-4">
                            Over the years, SEWA has grown into a vibrant network of engineers, students, and professionals working
                            across various domains of engineering and technology. We have successfully organized numerous technical
                            workshops, cultural events, and professional development programs that have benefited hundreds of members.
                        </p>
                        <p className="mt-4">
                            Today, SEWA stands as a testament to the collective strength and aspirations of Santal engineers,
                            continuing to foster professional excellence while preserving our rich cultural heritage.
                        </p>
                    </div>
                </div>
            </div>

            {/* Objectives Section */}
            <div className="bg-gray-50 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Objectives</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            The core goals that drive our association forward
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {objectives.map((objective, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{objective.title}</h3>
                                            <p className="text-sm text-gray-600">{objective.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Constitution Section */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Constitution & Registration</h2>
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex items-start">
                                <DocumentTextIcon className="h-12 w-12 text-primary-600 flex-shrink-0" />
                                <div className="ml-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">SEWA Constitution</h3>
                                    <p className="text-gray-600 mb-4">
                                        Our constitution outlines the fundamental principles, rules, and regulations that govern
                                        the Santal Engineers Welfare Association. It defines our organizational structure,
                                        membership criteria, and operational guidelines.
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><strong>Registration Number:</strong> [To be added]</p>
                                        <p><strong>Registered Under:</strong> Societies Registration Act</p>
                                        <p><strong>Registration Date:</strong> [To be added]</p>
                                    </div>
                                    <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        Download Constitution (PDF)
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const objectives = [
    {
        title: "Professional Development",
        description: "Provide continuous learning opportunities through workshops, seminars, and training programs to enhance technical skills and professional competencies."
    },
    {
        title: "Community Support",
        description: "Create a strong support network for Santal engineers and students, facilitating mentorship, career guidance, and mutual assistance."
    },
    {
        title: "Cultural Preservation",
        description: "Promote and preserve Santal cultural heritage while embracing modern technological advancements and professional excellence."
    },
    {
        title: "Knowledge Sharing",
        description: "Foster a collaborative environment for sharing technical knowledge, best practices, and innovative ideas among members."
    },
    {
        title: "Educational Advancement",
        description: "Support and encourage engineering education within the Santal community through scholarships, guidance, and resource sharing."
    },
    {
        title: "Networking Opportunities",
        description: "Build a robust professional network connecting Santal engineers across various industries, organizations, and geographical locations."
    },
    {
        title: "Social Welfare",
        description: "Contribute to the socio-economic development of the Santal community through various welfare initiatives and programs."
    },
    {
        title: "Advocacy & Representation",
        description: "Represent the interests and concerns of Santal engineers at various platforms and work towards creating equal opportunities."
    }
];
