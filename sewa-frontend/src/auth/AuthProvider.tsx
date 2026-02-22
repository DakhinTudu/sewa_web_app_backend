import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/auth.api';

interface User {
    username: string;
    roles: string[];
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            const parsed = JSON.parse(storedUser) as User;
            setUser(parsed);
            // Refresh user from server so we always have up-to-date permissions (e.g. COMMUNICATIONS_SEND, ANNOUNCEMENT_VIEW)
            authApi.me().then((data) => {
                const refreshed = {
                    username: data.username,
                    roles: Array.from(data.roles ?? []),
                    permissions: data.permissions ? Array.from(data.permissions) : [],
                };
                setUser(refreshed);
                localStorage.setItem('user', JSON.stringify(refreshed));
            }).catch(() => {
                // Token invalid or network error – keep stored user
            });
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
