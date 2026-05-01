import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
            const res = await window.axios.get('/api/user');
            setUser(res.data);
            // Sync localStorage in case user data changed on backend
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            console.warn('Auth check failed:', error.response?.status || error.message);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete window.axios.defaults.headers.common['Authorization'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const res = await window.axios.post('/api/login', credentials);
            
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            }
            
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await window.axios.post('/api/logout');
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete window.axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
        }
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
