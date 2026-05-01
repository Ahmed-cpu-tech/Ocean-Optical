import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Search, TrendingUp, Box, FileText, MessageSquare, Home as HomeIcon, User } from 'lucide-react';
import { Link, NavLink, useLocation, Routes, Route } from 'react-router-dom';

// Import sub-components
import DashboardHome from './DashboardHome';
import InventoryManager from './InventoryManager';
import OrdersManager from './OrdersManager';
import SupportManager from './SupportManager';
import AdminProfile from './AdminProfile';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="d-flex min-vh-100 bg-light font-outfit">
            {/* Sidebar */}
            <aside className="bg-brand-navy text-white d-flex flex-column position-fixed h-100" style={{ width: '280px', zIndex: 1000 }}>
                <div className="p-4 p-md-5">
                    <div className="d-flex align-items-center gap-3 mb-5 pb-4 border-bottom border-white border-opacity-10">
                        <div className="bg-brand-sky rounded d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                            <span className="text-brand-navy font-weight-bold small">O</span>
                        </div>
                        <span className="small fw-bold tracking-widest text-uppercase">Admin <span className="opacity-50">Hub</span></span>
                    </div>

                    <nav className="nav flex-column gap-2">
                        {[
                            { path: '/dashboard', name: 'Dashboard', icon: HomeIcon, exact: true },
                            { path: '/dashboard/inventory', name: 'Inventory', icon: Box },
                            { path: '/dashboard/orders', name: 'Orders', icon: FileText },
                            { path: '/dashboard/support', name: 'Support', icon: MessageSquare },
                            { path: '/dashboard/profile', name: 'Profile', icon: User },
                        ].map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) =>
                                    `nav-link border-0 text-start px-4 py-3 rounded-3 small fw-bold text-uppercase tracking-widest transition-all d-flex align-items-center gap-3 ${isActive || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                                        ? 'bg-brand-sky text-brand-navy'
                                        : 'text-white-50 hover-bg-white-10'
                                    }`}
                            >
                                <item.icon size={16} />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-4 p-md-5 border-top border-white border-opacity-10">
                    <Link to="/store" className="nav-link text-white-50 hover-text-white transition-colors small fw-bold text-uppercase tracking-widest d-flex align-items-center gap-3 mb-4">
                        <TrendingUp size={16} /> Live Store
                    </Link>
                    <button
                        onClick={logout}
                        className="btn btn-outline-danger w-100 py-3 rounded-3 small fw-bold text-uppercase tracking-widest transition-all d-flex align-items-center justify-content-center gap-2"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow-1 p-4 p-md-5" style={{ marginLeft: '280px' }}>
                <header className="d-flex justify-content-between align-items-center mb-5 pb-4 border-bottom border-secondary border-opacity-10">
                    <div>
                        <h1 className="h3 fw-bold text-brand-navy m-0">Tableau de Bord</h1>
                        <p className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mt-1 m-0">Gestion de la Boutique Optique</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <div className="position-relative d-none d-lg-block">
                            <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary opacity-50" size={14} />
                            <input type="text" placeholder="Search data..." className="form-control form-control-sm border-0 shadow-sm rounded-3 ps-5 small" style={{ width: '240px', py: '10px' }} />
                        </div>
                        <Link to="/dashboard/profile" className="text-decoration-none text-dark d-flex align-items-center gap-3 bg-white px-3 py-2 rounded-3 shadow-sm border border-white hover-bg-light transition">
                            <div className="bg-light rounded d-flex align-items-center justify-content-center fw-bold transition" style={{ width: '32px', height: '32px', fontSize: '10px' }}>{user?.name?.charAt(0) || 'A'}</div>
                            <div className="d-flex flex-column text-start">
                                <span className="small fw-bold text-brand-navy text-uppercase tracking-widest">{user?.name || 'Administrateur'}</span>
                                <span className="text-secondary smaller opacity-50" style={{ fontSize: '10px' }}>Session Active</span>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Sub-Routes Rendering Area */}
                <div className="position-relative">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="inventory/*" element={<InventoryManager />} />
                        <Route path="orders/*" element={<OrdersManager />} />
                        <Route path="support/*" element={<SupportManager />} />
                        <Route path="profile/*" element={<AdminProfile />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
