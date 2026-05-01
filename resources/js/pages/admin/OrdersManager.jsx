import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Phone, CheckCircle, Clock, ExternalLink } from 'lucide-react';

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                // Attempt direct fetch
                try {
                    const res = await window.axios.get(`/api/prescriptions/${id}`);
                    const data = res.data?.data || res.data;
                    if (data && data.name) {
                        setOrder(data);
                    } else {
                        throw new Error("Invalid structure");
                    }
                } catch (err) {
                    console.warn("Direct ID fetch failed, trying fallback search", id);
                    // Fallback: Fetch all and find the ID
                    const allRes = await window.axios.get('/api/prescriptions');
                    const list = Array.isArray(allRes.data?.data) ? allRes.data.data : (Array.isArray(allRes.data) ? allRes.data : []);
                    const found = list.find(o => o.id.toString() === id.toString());
                    if (found) {
                        setOrder(found);
                    } else {
                        throw new Error("Order not found in list");
                    }
                }
            } catch (err) {
                console.error("Order processing error:", err);
                setError("Could not retrieve order details.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async () => {
        setUpdating(true);
        try {
            await window.axios.put(`/api/prescriptions/${id}/status`, { status: 'processed' });
            setOrder({ ...order, status: 'processed' });
        } catch (err) {
            alert("Failed to update order status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-5 text-center text-secondary">Loading details...</div>;
    if (error || !order) return <div className="p-5 text-center text-danger">Order not found. <button onClick={() => navigate('/dashboard/orders')} className="btn btn-link">Go back</button></div>;

    const isPending = order.status === 'pending';
    const details = order.prescription_details || {};

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom border-light p-4 d-flex align-items-center gap-3">
                <button onClick={() => navigate('/dashboard/orders')} className="btn btn-outline-secondary btn-sm p-2 rounded-circle"><ArrowLeft size={16} /></button>
                <h2 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest m-0">Process Order: #RX-{order.id}</h2>
                <div className="ms-auto">
                    <span className={`badge ${isPending ? 'bg-warning text-dark' : 'bg-success text-white'} text-uppercase tracking-widest px-3 py-2 small`}>
                        {isPending ? <><Clock size={12} className="me-1"/> Pending</> : <><CheckCircle size={12} className="me-1"/> Processed</>}
                    </span>
                </div>
            </div>
            <div className="card-body p-4 p-md-5">
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-2 d-flex align-items-center gap-2"><User size={14} /> Patient Name</label>
                        <input type="text" readOnly className="form-control bg-light border-0" value={order.name || ''} />
                    </div>
                    <div className="col-md-6">
                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-2 d-flex align-items-center gap-2"><Phone size={14} /> Contact Phone</label>
                        <input type="text" readOnly className="form-control bg-light border-0" value={order.phone || ''} />
                    </div>
                </div>

                {order.image_url && (
                    <div className="mb-5">
                        <h4 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest mb-4 border-start border-4 border-brand-sky ps-3">Original Rx Photo</h4>
                        <div className="bg-light rounded-4 p-4 text-center">
                            <a href={order.image_url} target="_blank" rel="noopener noreferrer" className="d-inline-block text-decoration-none">
                                <img src={order.image_url} alt="Prescription" className="img-fluid rounded shadow-sm border border-white" style={{ maxHeight: '400px' }} />
                                <p className="mt-3 text-primary small fw-bold text-uppercase tracking-widest d-flex align-items-center justify-content-center gap-2">
                                    <ExternalLink size={14} /> View full resolution
                                </p>
                            </a>
                        </div>
                    </div>
                )}
                
                <div className="mb-5">
                    <h4 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest mb-4 border-start border-4 border-brand-sky ps-3">Manual Metrics</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered text-center align-middle">
                            <thead className="bg-light small fw-bold text-uppercase tracking-widest text-secondary">
                                <tr>
                                    <th>Eye</th>
                                    <th>SPH</th>
                                    <th>CYL</th>
                                    <th>AXIS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fw-bold text-brand-navy">OD (Right)</td>
                                    <td>{details.od_sph || '-'}</td>
                                    <td>{details.od_cyl || '-'}</td>
                                    <td>{details.od_axis || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="fw-bold text-brand-navy">OG (Left)</td>
                                    <td>{details.og_sph || '-'}</td>
                                    <td>{details.og_cyl || '-'}</td>
                                    <td>{details.og_axis || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-light rounded-4 p-4 mb-4">
                    <h4 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest mb-3">Linked Product</h4>
                    {order.product ? (
                        <div className="d-flex align-items-center gap-3">
                            {order.product.image_url && <img src={order.product.image_url} alt="" className="rounded shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />}
                            <div>
                                <p className="m-0 fw-bold text-brand-navy text-uppercase">{order.product.name}</p>
                                <p className="m-0 small text-secondary">{order.product.price} DHS</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-secondary small m-0">No specific product linked.</p>
                    )}
                </div>

                <div className="d-flex gap-3 mt-5">
                    <button onClick={() => window.print()} className="btn btn-outline-dark fw-bold text-uppercase tracking-widest small px-4 py-2">Print Ticket</button>
                    {isPending && (
                        <button 
                            onClick={handleStatusUpdate} 
                            disabled={updating}
                            className="btn btn-success text-white fw-bold text-uppercase tracking-widest small px-4 py-2 shadow-sm"
                        >
                            {updating ? 'Processing...' : 'Mark as Processed'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function OrdersList() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await window.axios.get('/api/prescriptions');
                setPrescriptions(Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom border-light p-4 d-flex justify-content-between align-items-center">
                <h2 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest m-0 d-flex align-items-center gap-2"><Calendar size={18} /> Active Orders</h2>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle m-0">
                    <thead className="bg-light text-uppercase tracking-widest text-secondary opacity-50" style={{ fontSize: '10px' }}>
                        <tr>
                            <th className="px-4 py-3 border-0">ID</th>
                            <th className="px-4 py-3 border-0">Patient Info</th>
                            <th className="px-4 py-3 border-0">Status</th>
                            <th className="px-4 py-3 border-0 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-5">Loading orders...</td></tr>
                        ) : prescriptions.length > 0 ? (
                            prescriptions.map(p => (
                                <tr key={p.id} className="small" style={{ cursor: 'pointer' }}>
                                    <td className="px-4 py-4 border-0 text-secondary fw-bold">
                                        <Link to={`/dashboard/orders/${p.id}`} className="text-decoration-none">#RX-{p.id}</Link>
                                    </td>
                                    <td className="px-4 py-4 border-0">
                                        <Link to={`/dashboard/orders/${p.id}`} className="text-decoration-none text-brand-navy fw-bold text-uppercase d-block mb-1">{p.name}</Link>
                                        <span className="text-secondary">{p.phone}</span>
                                    </td>
                                    <td className="px-4 py-4 border-0">
                                        <span className={`badge ${p.status === 'pending' ? 'bg-warning text-dark' : 'bg-success text-white'} text-uppercase tracking-widest small px-2 py-1`} style={{ fontSize: '8px' }}>
                                            {p.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 border-0 text-end">
                                        <Link to={`/dashboard/orders/${p.id}`} className="btn btn-link p-0 text-brand-navy hover-text-dark text-uppercase tracking-widest fw-bold" style={{ fontSize: '10px' }}>Process Order</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-5 text-secondary">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function OrdersManager() {
    return (
        <Routes>
            <Route path="/" element={<OrdersList />} />
            <Route path="/:id" element={<OrderDetail />} />
        </Routes>
    );
}
