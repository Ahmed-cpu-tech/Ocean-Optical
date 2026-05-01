import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Globe, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const { lang, setLang, t } = useLanguage();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: t('home'), path: '/' },
        { name: t('products'), path: '/products' },
        { name: t('prescriptions'), path: '/prescription' },
        { name: t('contact'), path: '/contact' },
    ];

    return (
        <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : 'navbar-dark bg-transparent'}`}>
            <div className="container">
                {/* Logo */}
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <div className="bg-brand-navy rounded d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                        <span className="text-white font-weight-bold">O</span>
                    </div>
                    <span className={`h4 mb-0 font-weight-bold font-outfit ${scrolled ? 'text-brand-navy' : 'text-white'}`}>
                        OCEAN<span className="text-brand-sky">OPTICAL</span>
                    </span>
                </Link>

                {/* Mobile Toggler */}
                <button 
                    className="navbar-toggler border-0 shadow-none" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Content */}
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        {navLinks.map((link) => (
                            <li className="nav-item mx-lg-3" key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`nav-link text-uppercase small font-weight-bold tracking-widest ${
                                        isActive(link.path) 
                                        ? (scrolled ? 'text-brand-navy active' : 'text-white active') 
                                        : (scrolled ? 'text-secondary' : 'text-white-50')
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-4">
                        {/* Language Switch */}
                        <button 
                            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
                            className={`btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2 transition-colors ${
                                scrolled ? 'text-secondary' : 'text-white-50'
                            }`}
                        >
                            <Globe size={18} />
                            <small className="font-weight-bold text-uppercase tracking-widest">{lang === 'fr' ? 'AR' : 'FR'}</small>
                        </button>
                        
                        <div className="vr bg-secondary opacity-25 d-none d-md-block" style={{ height: '1.5rem' }}></div>
                        
                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                {user.role === 'admin' && (
                                    <Link to="/dashboard" className="text-secondary hover-text-brand-navy">
                                        <LayoutDashboard size={18} />
                                    </Link>
                                )}
                                <div className={`text-end d-none d-sm-block ${scrolled ? 'text-dark' : 'text-white'}`}>
                                    <div className="small font-weight-bold text-uppercase tracking-widest" style={{ fontSize: '10px' }}>{user.name}</div>
                                    <div className="opacity-50 text-uppercase tracking-tighter" style={{ fontSize: '8px' }}>{user.role}</div>
                                </div>
                                <button 
                                    onClick={logout}
                                    className={`btn btn-sm rounded-3 transition-all ${
                                        scrolled ? 'btn-light text-secondary' : 'btn-outline-light border-0 opacity-75'
                                    }`}
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className={`btn px-4 rounded-3 small font-weight-bold text-uppercase tracking-widest ${
                                    scrolled 
                                    ? 'bg-brand-navy text-white' 
                                    : 'btn-light text-brand-navy'
                                }`}
                            >
                                {t('login')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
