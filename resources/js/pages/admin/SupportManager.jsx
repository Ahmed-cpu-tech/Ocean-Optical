import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, User, Clock, Reply, Trash2 } from 'lucide-react';

function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                setLoading(true);
                try {
                    const res = await window.axios.get(`/api/contacts/${id}`);
                    const data = res.data?.data || res.data;
                    if (data && data.name) {
                        setMessage(data);
                    } else {
                        throw new Error("Invalid structure");
                    }
                } catch (err) {
                    console.warn("Direct contact fetch failed, trying fallback", id);
                    const allRes = await window.axios.get('/api/contacts');
                    const list = Array.isArray(allRes.data?.data) ? allRes.data.data : (Array.isArray(allRes.data) ? allRes.data : []);
                    const found = list.find(c => c.id.toString() === id.toString());
                    if (found) {
                        setMessage(found);
                    } else {
                        throw new Error("Message not found in list");
                    }
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load message details.");
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
        try {
            await window.axios.delete(`/api/contacts/${id}`);
            navigate('/dashboard/support');
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setSending(true);
        try {
            await window.axios.post(`/api/contacts/${id}/reply`, { reply: replyText });
            setSuccessMsg("Message envoyé avec succès !");
            setReplyText('');
            setIsReplying(false);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            alert("Erreur lors de l'envoi.");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="p-5 text-center text-secondary">Loading details...</div>;
    if (error || !message) return <div className="p-5 text-center text-danger">Message not found. <button onClick={() => navigate('/dashboard/support')} className="btn btn-link">Go back</button></div>;

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom border-light p-4 d-flex align-items-center gap-3">
                <button onClick={() => navigate('/dashboard/support')} className="btn btn-outline-secondary btn-sm p-2 rounded-circle"><ArrowLeft size={16} /></button>
                <h2 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest m-0">Support Inquiry: #MSG-{message.id}</h2>
                <span className="badge bg-light text-secondary border ms-auto px-3 py-2 text-uppercase tracking-widest small"><Clock size={12} className="me-1"/> Received</span>
            </div>
            <div className="card-body p-4 p-md-5">
                <div className="row g-4 mb-5 pb-4 border-bottom border-light">
                    <div className="col-md-6">
                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-2 d-flex align-items-center gap-2"><User size={14} /> Sender Name</label>
                        <h3 className="h5 fw-bold text-brand-navy m-0">{message.name}</h3>
                    </div>
                    <div className="col-md-6">
                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-2 d-flex align-items-center gap-2"><Mail size={14} /> Email Address</label>
                        <p className="fw-bold fs-5 text-dark m-0"><a href={`mailto:${message.email}`} className="text-decoration-none text-brand-sky">{message.email}</a></p>
                    </div>
                </div>
                
                <div className="mb-5">
                    <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-3">Message Content</label>
                    <div className="bg-light p-4 rounded-4 text-dark fst-italic shadow-sm fs-6" style={{ lineHeight: '1.8' }}>
                        "{message.message}"
                    </div>
                </div>

                {isReplying && (
                    <div className="mb-5 border-top pt-4">
                        <label className="text-secondary small fw-bold text-uppercase tracking-widest mb-3">Votre Réponse</label>
                        <textarea 
                            className="form-control border-0 bg-light p-4 shadow-sm rounded-4" 
                            rows="4" 
                            placeholder="Tapez votre réponse ici..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="mt-3 d-flex gap-2">
                            <button 
                                onClick={handleSendReply} 
                                disabled={sending || !replyText.trim()} 
                                className="btn btn-primary fw-bold text-uppercase tracking-widest small px-4 py-2 rounded-3 shadow-sm border-0"
                                style={{ transition: 'all 0.2s ease' }}
                            >
                                {sending ? 'Envoi...' : 'Envoyer la Réponse'}
                            </button>
                            <button 
                                onClick={() => setIsReplying(false)} 
                                className="btn btn-light fw-bold text-uppercase tracking-widest small px-4 py-2 rounded-3 border-0"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {successMsg && <div className="alert alert-success small fw-bold text-uppercase tracking-widest mb-4 border-0 shadow-sm">{successMsg}</div>}

                <div className="d-flex gap-3">
                    {!isReplying && (
                        <button 
                            onClick={() => setIsReplying(true)} 
                            className="btn btn-primary px-4 py-2 rounded-3 shadow-sm fw-bold text-uppercase tracking-widest small d-flex align-items-center gap-2 border-0"
                            style={{ transition: 'all 0.2s' }}
                        >
                            <Reply size={16} /> Répondre
                        </button>
                    )}
                    <button 
                        onClick={handleDelete} 
                        className="btn btn-danger px-4 py-2 rounded-3 shadow-sm fw-bold text-uppercase tracking-widest small d-flex align-items-center gap-2 border-0"
                        style={{ transition: 'all 0.2s' }}
                    >
                        <Trash2 size={16} /> Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

function MessagesList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await window.axios.get('/api/contacts');
            setContacts(Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
        try {
            await window.axios.delete(`/api/contacts/${id}`);
            setContacts(contacts.filter(c => c.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom border-light p-4 d-flex justify-content-between align-items-center">
                <h2 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest m-0 d-flex align-items-center gap-2"><MessageSquare size={18} /> Support Inbox</h2>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle m-0">
                    <thead className="bg-light text-uppercase tracking-widest text-secondary opacity-50" style={{ fontSize: '10px' }}>
                        <tr>
                            <th className="px-4 py-3 border-0">ID</th>
                            <th className="px-4 py-3 border-0">Sender</th>
                            <th className="px-4 py-3 border-0">Message Snippet</th>
                            <th className="px-4 py-3 border-0 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-5">Loading messages...</td></tr>
                        ) : contacts.length > 0 ? (
                            contacts.map(c => (
                                <tr key={c.id} className="small">
                                    <td className="px-4 py-4 border-0 text-secondary fw-bold">
                                        <Link to={`/dashboard/support/${c.id}`} className="text-decoration-none">#MSG-{c.id}</Link>
                                    </td>
                                    <td className="px-4 py-4 border-0">
                                        <Link to={`/dashboard/support/${c.id}`} className="text-decoration-none text-brand-navy fw-bold text-uppercase d-block mb-1">{c.name}</Link>
                                        <span className="text-secondary">{c.email}</span>
                                    </td>
                                    <td className="px-4 py-4 border-0">
                                        <div className="text-truncate text-secondary" style={{ maxWidth: '250px' }}>{c.message}</div>
                                    </td>
                                    <td className="px-4 py-4 border-0 text-end">
                                        <div className="d-flex justify-content-end gap-3 align-items-center">
                                            <Link to={`/dashboard/support/${c.id}`} className="btn btn-link p-0 text-brand-navy hover-text-dark text-uppercase tracking-widest fw-bold" style={{ fontSize: '10px' }}>Read Message</Link>
                                            <button onClick={() => handleDelete(c.id)} className="btn btn-link p-0 text-danger hover-text-dark border-0 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-5 text-secondary">No messages found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function SupportManager() {
    return (
        <Routes>
            <Route path="/" element={<MessagesList />} />
            <Route path="/:id" element={<MessageDetail />} />
        </Routes>
    );
}
