import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => {
        const raw = localStorage.getItem('session');
        return raw ? JSON.parse(raw) : null;
    });

    const login = useCallback(async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        const payload = { user: data.user, tenant: data.tenant };
        localStorage.setItem('session', JSON.stringify(payload));
        setSession(payload);
        return data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('session');
        setSession(null);
    }, []);

    useEffect(() => {
        const onUnauthorized = () => setSession(null);
        window.addEventListener('auth:unauthorized', onUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
    }, []);

    const value = { session, login, logout, isAuthenticated: !!session };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}
