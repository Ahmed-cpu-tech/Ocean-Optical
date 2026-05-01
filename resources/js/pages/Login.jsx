import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('Attempting login with:', credentials.email);
        
        try {
            console.log('Attempting login through AuthContext');
            
            await login(credentials);
            
            navigate("/dashboard");
        } catch (err) {
            console.error('Login failed — full error:', err);
            console.error('Login failed — response status:', err.response?.status);
            console.error('Login failed — response data:', JSON.stringify(err.response?.data, null, 2));

            const data = err.response?.data;
            // Laravel ValidationException: { errors: { email: ['msg'] } }
            // Laravel manual throw:          { message: 'msg' }
            // Custom error:                  { error: 'msg' }
            let errorMsg = 'Invalid credentials';
            if (data?.errors) {
                // Pick the first message from the first field with an error
                const firstField = Object.keys(data.errors)[0];
                errorMsg = data.errors[firstField]?.[0] || errorMsg;
            } else if (data?.message) {
                errorMsg = data.message;
            } else if (data?.error) {
                errorMsg = data.error;
            }

            console.error('Displayed error message:', errorMsg);
            setError(errorMsg);
        } finally {
            console.log('Login attempt complete — resetting loading state');
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 bg-light font-outfit">
            <div className="card border-0 shadow-sm p-4 p-md-5" style={{ maxWidth: '450px', width: '100%', borderRadius: '1.5rem' }}>
                <div className="text-center mb-5">
                    <div className="bg-brand-navy rounded-4 d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '56px', height: '56px' }}>
                        <UserCheck size={28} className="text-white" />
                    </div>
                    <h2 className="display-6 fw-bold text-brand-navy text-uppercase tracking-tight m-0">{t('login')}</h2>
                    <p className="text-secondary small mt-2 text-uppercase fw-bold tracking-widest opacity-50">Secure Access</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 rounded-3 text-center py-2 mb-4" style={{ fontSize: '10px' }}>
                        <span className="fw-bold text-uppercase tracking-widest">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest mb-2 ps-1">
                            {t('email')}
                        </label>
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-white border-end-0 border-light ps-3">
                                <Mail className="text-secondary opacity-50" size={18} />
                            </span>
                            <input
                                required
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="form-control bg-white border-start-0 border-light font-weight-medium small"
                                style={{ fontSize: '14px' }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-end mb-2 ps-1">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest m-0">
                                Password
                            </label>
                            <button type="button" className="btn btn-link p-0 text-brand-navy text-decoration-none small text-uppercase fw-bold tracking-widest" style={{ fontSize: '9px' }}>Forgot?</button>
                        </div>
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-white border-end-0 border-light ps-3">
                                <Lock className="text-secondary opacity-50" size={18} />
                            </span>
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="form-control bg-white border-start-0 border-light font-weight-medium small"
                                style={{ fontSize: '14px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn border-light border-start-0 bg-white"
                            >
                                {showPassword ? <EyeOff className="text-secondary" size={18} /> : <Eye className="text-secondary" size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-lg w-100 bg-brand-navy text-white rounded-3 fw-bold text-uppercase tracking-widest py-3 mt-4"
                        style={{ fontSize: '12px' }}
                    >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            {loading ? 'Authenticating...' : t('login')}
                            {!loading && <ArrowRight size={16} />}
                        </div>
                    </button>

                    <div className="text-center pt-4 mt-4 border-top border-light">
                        <p className="text-secondary small fw-bold text-uppercase tracking-widest mb-0 opacity-50">
                            Administrator Portal
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
