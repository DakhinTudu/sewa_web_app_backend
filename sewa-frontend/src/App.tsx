import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import OrganizationPage from './pages/public/OrganizationPage';
import NoticesPage from './pages/public/NoticesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import MemberListPage from './pages/members/MemberListPage';
import ChaptersPage from './pages/chapters/ChaptersPage';
import StudentsPage from './pages/students/StudentsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import ContentsPage from './pages/dashboard/ContentsPage';
import CalendarPage from './pages/dashboard/CalendarPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import AdminPage from './pages/dashboard/AdminPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public website (Navbar + Footer) */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/organization" element={<OrganizationPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/notices" element={<NoticesPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Protected dashboard */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/dashboard/profile" element={<ProfilePage />} />
                            <Route path="/dashboard/membership" element={<MemberListPage />} />
                            <Route path="/dashboard/chapters" element={<ChaptersPage />} />
                            <Route path="/dashboard/students" element={<StudentsPage />} />
                            <Route path="/dashboard/contents" element={<ContentsPage />} />
                            <Route path="/dashboard/calendar" element={<CalendarPage />} />
                            <Route path="/dashboard/messages" element={<MessagesPage />} />
                            <Route path="/dashboard/payments" element={<PaymentsPage />} />
                            <Route path="/dashboard/admin" element={<AdminPage />} />
                        </Route>
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
