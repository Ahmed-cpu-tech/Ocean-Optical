import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();

    // Show a visible loading indicator instead of returning null
    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-brand-navy mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-secondary small fw-bold text-uppercase tracking-widest opacity-75">Verification en cours...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if authentication is not confirmed
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based access control
    if (adminOnly === true && user.role !== 'admin') {
        return <Navigate to="/store" replace />;
    }

    return children;
}
