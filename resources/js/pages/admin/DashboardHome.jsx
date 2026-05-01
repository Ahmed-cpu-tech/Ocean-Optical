import React, { useState, useEffect } from 'react';
import { Home, Package, Calendar, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, to }) => (
    <div className="col-md-4">
        <Link to={to} className="text-decoration-none h-100 d-block">
            <div className="card border-0 shadow-sm p-4 h-100 hover-shadow-md transition">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <p className="text-uppercase small fw-bold tracking-widest text-secondary mb-1 opacity-50">{title}</p>
                        <h3 className="h2 fw-bold text-brand-navy m-0">{value}</h3>
                    </div>
                    <div className={`rounded-3 d-flex align-items-center justify-content-center text-white ${color} shadow-sm`} style={{ width: '48px', height: '48px' }}>
                        <Icon size={20} />
                    </div>
                </div>
            </div>
        </Link>
    </div>
);

export default function DashboardHome() {
    const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [prodRes, presRes, contRes] = await Promise.all([
                    window.axios.get('/api/products'),
                    window.axios.get('/api/prescriptions'),
                    window.axios.get('/api/contacts')
                ]);
                
                const getLength = (res) => Array.isArray(res.data?.data) ? res.data.data.length : Array.isArray(res.data) ? res.data.length : 0;

                setStats({
                    products: getLength(prodRes),
                    orders: getLength(presRes),
                    messages: getLength(contRes)
                });
            } catch (err) {
                console.error('Fetch stats error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="row g-4 mb-5">
                <StatCard title="Total Models" value={loading ? '..' : stats.products} icon={Package} color="bg-brand-navy" to="/dashboard/inventory" />
                <StatCard title="Active Orders" value={loading ? '..' : stats.orders} icon={Calendar} color="bg-indigo-600" to="/dashboard/orders" />
                <StatCard title="Support Inbox" value={loading ? '..' : stats.messages} icon={CheckSquare} color="bg-success text-white" to="/dashboard/support" />
            </div>

            <div className="text-center py-5">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                    <Home size={32} className="text-secondary opacity-50" />
                </div>
                <h2 className="h4 fw-bold text-brand-navy text-uppercase tracking-tight">Welcome to the Command Center</h2>
                <p className="text-secondary small fw-medium mx-auto max-w-sm mt-2">
                    Select a module from the sidebar or stat cards to manage your inventory, process patient prescriptions, or respond to incoming support inquiries.
                </p>
            </div>
        </div>
    );
}
