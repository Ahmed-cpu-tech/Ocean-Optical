import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminProfile() {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        email: user?.email || '',
        password: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const payload = { email: formData.email };
            if (formData.password.trim() !== '') {
                payload.password = formData.password;
            }

            const response = await window.axios.put('/api/admin/profile', payload);
            setMessage(response.data.message || 'Profil mis à jour avec succès.');
            setFormData(prev => ({ ...prev, password: '' })); 
            
            if (response.data.user) {
                updateUser(response.data.user);
            }
        } catch (err) {
            console.error('Profile update failed:', err);
            const data = err.response?.data;
            let errorMsg = 'Une erreur est survenue lors de la mise à jour.';
            if (data?.errors) {
                const firstField = Object.keys(data.errors)[0];
                errorMsg = data.errors[firstField]?.[0] || errorMsg;
            } else if (data?.message) {
                errorMsg = data.message;
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-4 shadow-sm border border-secondary border-opacity-10 overflow-hidden font-outfit mb-4">
            <div className="bg-brand-navy p-4 p-md-5 text-white position-relative">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-10"></div>
                <div className="position-relative z-1 d-flex align-items-center gap-4">
                    <div className="bg-brand-sky rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '80px', height: '80px' }}>
                        <User size={40} className="text-brand-navy" />
                    </div>
                    <div>
                        <h2 className="h3 fw-bold text-uppercase tracking-widest m-0">{user?.name || 'Admin Profile'}</h2>
                        <p className="small text-white-50 text-uppercase fw-bold tracking-widest mt-1 mb-0">Manage your credentials</p>
                    </div>
                </div>
            </div>

            <div className="p-4 p-md-5">
                {message && (
                    <div className="alert alert-success border-0 rounded-3 small fw-bold text-uppercase tracking-widest mb-4 d-flex align-items-center gap-2 shadow-sm">
                        <div className="bg-success rounded-circle d-inline-block" style={{ width: '8px', height: '8px' }}></div>
                        {message}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger border-0 rounded-3 small fw-bold text-uppercase tracking-widest mb-4 d-flex align-items-center gap-2 shadow-sm">
                        <div className="bg-danger rounded-circle d-inline-block" style={{ width: '8px', height: '8px' }}></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="row g-4" style={{ maxWidth: '600px' }}>
                    <div className="col-12">
                        <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest ps-1">
                            Email Address
                        </label>
                        <div className="input-group input-group-lg shadow-sm">
                            <span className="input-group-text bg-light border-0 ps-3">
                                <Mail className="text-secondary opacity-50" size={18} />
                            </span>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                className="form-control bg-light border-0 font-weight-medium small"
                                style={{ fontSize: '14px' }}
                            />
                        </div>
                        <div className="form-text small opacity-75 ps-1 mt-2">
                            This email is used for your administrator login.
                        </div>
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest ps-1">
                            New Password <span className="opacity-50 text-lowercase fw-normal">(Optional)</span>
                        </label>
                        <div className="input-group input-group-lg shadow-sm">
                            <span className="input-group-text bg-light border-0 ps-3">
                                <Lock className="text-secondary opacity-50" size={18} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave empty to keep current password"
                                className="form-control bg-light border-0 font-weight-medium small"
                                style={{ fontSize: '14px' }}
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn bg-light border-0 text-secondary px-3"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="form-text small opacity-75 ps-1 mt-2">
                            Must be at least 8 characters long if provided.
                        </div>
                    </div>

                    <div className="col-12 mt-5">
                        <hr className="opacity-10 mb-4" />
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-lg bg-brand-navy text-white rounded-3 fw-bold text-uppercase tracking-widest py-3 px-5 d-flex align-items-center gap-3 shadow-sm transition-all hover-scale"
                            style={{ fontSize: '12px' }}
                        >
                            <Save size={18} />
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
