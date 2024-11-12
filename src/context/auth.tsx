import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            console.log('Sending login request:', { email, password });

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                { email, password },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            console.log('Login response:', response.data);

            if (response.data.user) {
                setUser(response.data.user);
                navigate('/calendar');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Login error details:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message ||
                    'Login failed. Please try again.';
                throw new Error(errorMessage);
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/logout`,
                {},
                { withCredentials: true },
            );
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
