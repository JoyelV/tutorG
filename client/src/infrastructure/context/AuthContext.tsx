import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthState = {
    token: string | null;
    userId: string | null;
    role: string | null;
    username: string | null;
};

type AuthContextType = {
    auth: AuthState;
    login: (data: AuthState) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId'),
        role: localStorage.getItem('role'),
        username: localStorage.getItem('username'),
    });

    const login = (data: AuthState) => {
        setAuth(data);
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('userId', data.userId || '');
        localStorage.setItem('role', data.role || '');
        localStorage.setItem('username', data.username || '');
    };

    const logout = () => {
        setAuth({ token: null, userId: null, role: null, username: null });
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};