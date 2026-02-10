import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand / About */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex flex-col gap-2">
                            <span className="text-xl font-bold text-primary-900 tracking-tight">SEWA</span>
                            <p className="text-sm text-gray-500 leading-6">
                                Santal Engineers Welfare Association.
                                Building a stronger community through engineering and unity.
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-sm text-gray-600 hover:text-primary-600">About Us</Link></li>
                            <li><Link to="/chapters" className="text-sm text-gray-600 hover:text-primary-600">Chapters</Link></li>
                            <li><Link to="/publications" className="text-sm text-gray-600 hover:text-primary-600">Publications</Link></li>
                            <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><Link to="/calendar" className="text-sm text-gray-600 hover:text-primary-600">Calendar</Link></li>
                            <li><Link to="/news" className="text-sm text-gray-600 hover:text-primary-600">News & Events</Link></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Constitution (PDF)</a></li>
                            <li><Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">Member Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="font-medium mr-2">Email:</span>
                                <a href="mailto:contact@santalengineers.org" className="hover:text-primary-600">contact@santalengineers.org</a>
                            </li>
                            <li className="flex items-start">
                                <span className="font-medium mr-2">Address:</span>
                                <span>123 SEWA Office,<br />Main Road, Ranchi,<br />Jharkhand, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-center text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} Santal Engineers Welfare Association. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
