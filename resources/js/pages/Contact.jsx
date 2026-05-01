import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Contact() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await window.axios.post('/api/contacts', formData);
            console.log('Contact response:', res.data);

            if (res.data?.success) {
                console.log("Message sent successfully");
                setSuccess(res.data.message || "Message sent successfully");
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSuccess(null), 5000);
            } else {
                throw new Error(res.data?.message || "Unexpected response");
            }
        } catch (err) {
            console.error("Contact error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to send message. Please try again.");
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-vh-100" style={{ paddingTop: '160px', paddingBottom: '80px' }}>

            {/* Page Header */}
            <div className="container mb-5 pb-5 border-bottom border-light">
                <div style={{ maxWidth: '800px' }}>
                    <span className="text-uppercase small fw-bold tracking-widest text-secondary mb-2 d-block">Connect</span>
                    <h1 className="display-3 fw-bold text-brand-navy tracking-tight text-uppercase m-0">
                        We prioritize <span className="text-light-emphasis">your vision.</span>
                    </h1>
                    <p className="lead text-secondary mt-4 opacity-75">
                        Expert consultation and personalized support for your ocular health. Visit our boutique in Asfi or reach out via the form below.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="row g-5 justify-content-between">

                    {/* Contact Form */}
                    <div className="col-lg-6">
                        <div className="mb-5 d-flex align-items-center gap-3">
                            <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <MessageCircle size={24} className="text-brand-navy" />
                            </div>
                            <h2 className="h4 fw-bold text-brand-navy text-uppercase tracking-tight m-0">Direct Messaging</h2>
                        </div>

                        {success && (
                            <div className="alert alert-success border-0 rounded-4 p-4 mb-4 d-flex align-items-center gap-3">
                                <CheckCircle size={20} />
                                <span className="small fw-bold text-uppercase tracking-widest">{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger border-0 rounded-4 p-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
                                <span className="small fw-bold text-uppercase tracking-widest">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="row g-4">
                            <div className="col-12">
                                <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest ms-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="form-control form-control-lg bg-light border-0 rounded-3 small"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest ms-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className="form-control form-control-lg bg-light border-0 rounded-3 small"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest ms-1">Message</label>
                                <textarea
                                    required
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your request"
                                    className="form-control form-control-lg bg-light border-0 rounded-3 small"
                                    style={{ fontSize: '14px', resize: 'none' }}
                                ></textarea>
                            </div>

                            <div className="col-12">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-lg bg-brand-navy text-white w-100 rounded-3 py-3 fw-bold text-uppercase tracking-widest mt-2"
                                    style={{ fontSize: '12px' }}
                                >
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        {loading ? 'Sending...' : 'Submit Message'}
                                        {!loading && <Send size={16} />}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Information */}
                    <div className="col-lg-5">
                        <div className="row row-cols-1 g-4 mb-5">
                            {[
                                { icon: <MapPin size={20} />, label: 'Boutique', value: 'Centre Ville, Asfi, Maroc' },
                                { icon: <Phone size={20} />, label: 'Phone', value: '+212 5 24 00 00 00' },
                                { icon: <Mail size={20} />, label: 'Email', value: 'contact@oceanoptical.ma' },
                            ].map((item, idx) => (
                                <div key={idx} className="col">
                                    <div className="card h-100 border-light border-opacity-50 rounded-4 p-4 d-flex flex-row align-items-center gap-4 transition-colors">
                                        <div className="bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                                            <span className="text-brand-navy">{item.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-uppercase small fw-bold tracking-widest text-secondary mb-1 opacity-50">{item.label}</p>
                                            <p className="fw-bold text-brand-navy h6 m-0">{item.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Google Map */}
                        <div className="bg-light rounded-4 border-light overflow-hidden mb-5 w-100 position-relative shadow-sm hover-shadow-md transition" style={{ height: '450px' }}>
                            <iframe
                                src="https://www.google.com/maps?q=Avenue%20de%20la%20libert%C3%A9%20N%C2%B07%2C%20Ville%20Nouvelle%2C%20SAFI%2C%20Morocco&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Optical Ocean Eyewear Location"
                            />
                        </div>

                        {/* Social Links */}
                        <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="btn btn-outline-light border-opacity-25 p-3 rounded-3 text-secondary transition-all">
                                    <Icon size={22} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
