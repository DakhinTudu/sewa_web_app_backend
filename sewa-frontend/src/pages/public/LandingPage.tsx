import { Link } from 'react-router-dom';
import { ArrowRightIcon, UserGroupIcon, CalendarIcon, DocumentTextIcon, MapPinIcon, BellIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '../../api/notice.api';
import { PLACEHOLDER_NEWS } from '../../constants/placeholders';

export default function LandingPage() {
    const { data: notices, isLoading: noticesLoading } = useQuery({
        queryKey: ['notices'],
        queryFn: () => noticeApi.getAll()
    });

    const displayNotices = (notices && notices.length > 0)
        ? notices.slice(0, 3).map(n => ({
            title: n.title,
            description: n.content?.slice(0, 120) || 'New announcement from SEWA.',
            date: new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            link: '/notices'
        }))
        : latestNewsFallback;

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-teal-50" />
                <div className="absolute top-0 right-0 -z-10 transform-gpu blur-3xl opacity-30" aria-hidden="true">
                    <div
                        className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary-400 to-teal-400"
                        style={{
                            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg ring-1 ring-primary-900/10">
                            {notices && notices.length > 0 ? (
                                <>
                                    <BellIcon className="h-5 w-5 text-primary-600 animate-bounce" />
                                    <span className="text-sm font-semibold text-primary-900">Latest: {notices[0].title}</span>
                                </>
                            ) : (
                                <>
                                    <CalendarIcon className="h-5 w-5 text-primary-600" />
                                    <span className="text-sm font-semibold text-primary-900">Annual General Meeting 2026 - Coming Soon</span>
                                </>
                            )}
                        </div>

                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                            Santal Engineers
                            <span className="block text-primary-600 mt-2">Welfare Association</span>
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
                            Empowering the Santal engineering community through professional development, social welfare, and collective growth. Building bridges between tradition and technology.
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register">
                                <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow" rightIcon={<ArrowRightIcon className="h-5 w-5" />}>
                                    Join as Member
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-shadow">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-white p-8 shadow-xl ring-1 ring-gray-900/5 transition-transform hover:scale-105">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary-100 opacity-50 blur-2xl" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-gray-600 leading-7 relative z-10">
                            To create a unified platform for Santal engineers across India, fostering professional excellence, preserving cultural heritage, and contributing to the socio-economic development of our community.
                        </p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-white p-8 shadow-xl ring-1 ring-gray-900/5 transition-transform hover:scale-105">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-teal-100 opacity-50 blur-2xl" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-7 relative z-10">
                            To provide a collaborative ecosystem for knowledge sharing, skill development, and mutual support among Santal engineers while promoting education and technical advancement in our community.
                        </p>
                    </div>
                </div>
            </div>

            {/* Highlights */}
            <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">What We Offer</h2>
                        <p className="mt-4 text-lg text-gray-600">Supporting our members through various initiatives and programs</p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
                        {highlights.map((highlight) => (
                            <div key={highlight.name} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-2xl hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                        <highlight.icon className="h-7 w-7 text-white" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.name}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Updates */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Latest Updates</h2>
                    <p className="mt-4 text-lg text-gray-600">Stay informed about our recent activities and upcoming events</p>
                </div>
                {noticesLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {displayNotices.map((news, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-2xl hover:-translate-y-1">
                                <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                                    <img src={PLACEHOLDER_NEWS} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                                        {news.date}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{news.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{news.description}</p>
                                    <Link to={news.link} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group-hover:gap-2 transition-all min-h-[44px] items-center">
                                        Read more
                                        <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA */}
            <div className="relative isolate overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Ready to Join SEWA?</h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">Become part of a growing community of Santal engineers. Register today and contribute to our collective success.</p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register"><Button variant="secondary" size="lg">Register Now</Button></Link>
                            <Link to="/contact"><Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">Contact Us</Button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const highlights = [
    { name: 'Professional Network', description: 'Connect with fellow Santal engineers across various domains.', icon: UserGroupIcon },
    { name: 'Events & Workshops', description: 'Participate in technical workshops and seminars.', icon: CalendarIcon },
    { name: 'Publications', description: 'Access newsletters and technical papers.', icon: DocumentTextIcon },
    { name: 'State Chapters', description: 'Join local chapters for regional networking.', icon: MapPinIcon },
];

const latestNewsFallback = [
    { title: 'Annual General Meeting 2026', description: 'Join us for our upcoming AGM to discuss future initiatives.', date: 'March 15, 2026', link: '/calendar' },
    { title: 'New Chapter in Maharashtra', description: 'We are exciting to announce our newest state chapter.', date: 'February 1, 2026', link: '/chapters' },
    { title: 'Technical Workshop Series', description: 'Register for our upcoming workshop series.', date: 'January 20, 2026', link: '/calendar' },
];
