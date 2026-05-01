import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-navy text-white pt-5 pb-4">
            <div className="container">
                <div className="row g-5">
                    {/* Brand */}
                    <div className="col-lg-4">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <div className="bg-brand-sky rounded d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <span className="text-brand-navy font-weight-bold">O</span>
                            </div>
                            <span className="h5 mb-0 fw-bold font-outfit uppercase tracking-tighter">OPTICAL <span className="text-brand-sky">OCEAN</span></span>
                        </div>
                        <p className="small text-white-50 opacity-75 mb-4 pe-lg-5">
                            Optical Ocean Eyewear Maroc SARL. Elevating vision with luxury craftsmanship and medical precision in Asfi.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="https://www.facebook.com/search/top?q=Optical%20Ocean%20Eyewear%20Maroc%20SARL" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-white transition-opacity opacity-75 hover-opacity-100">
                                <Facebook size={20} />
                            </a>
                            <a href="https://www.instagram.com/optical_ocean_eyewear/" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-white transition-opacity opacity-75 hover-opacity-100">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-6 col-md-2">
                        <h6 className="text-uppercase fw-bold tracking-widest mb-4 small">Navigation</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 small">
                            <li><Link to="/" className="text-white-50 text-decoration-none hover-text-white transition-colors">Home</Link></li>
                            <li><Link to="/products" className="text-white-50 text-decoration-none hover-text-white transition-colors">Collections</Link></li>
                            <li><Link to="/prescription" className="text-white-50 text-decoration-none hover-text-white transition-colors">Digital Rx</Link></li>
                            <li><Link to="/contact" className="text-white-50 text-decoration-none hover-text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Store Locations */}
                    <div className="col-6 col-md-2">
                        <h6 className="text-uppercase fw-bold tracking-widest mb-4 small">Boutique</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 small text-white-50">
                            <li>Centre Ville</li>
                            <li>Safi (Asfi)</li>
                            <li>Maroc</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-4">
                        <h6 className="text-uppercase fw-bold tracking-widest mb-4 small">Contact Center</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 small">
                            <li className="d-flex align-items-center gap-3">
                                <MapPin size={16} className="text-brand-sky" />
                                <span className="text-white-50">Avenue de la Liberté, Safi, Maroc</span>
                            </li>
                            <li className="d-flex align-items-center gap-3">
                                <Phone size={16} className="text-brand-sky" />
                                <div className="d-flex flex-column">
                                    <a href="tel:0661622838" className="text-white-50 text-decoration-none hover-text-white transition-colors">06 61 62 28 38</a>
                                    <a href="tel:0808621389" className="text-white-50 text-decoration-none hover-text-white transition-colors">08 08 62 13 89</a>
                                </div>
                            </li>
                            <li className="d-flex align-items-center gap-3">
                                <Mail size={16} className="text-brand-sky" />
                                <span className="text-white-50">contact@oceanoptical.ma</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-top border-white border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small text-white-50">
                    <p className="m-0">© 2026 OCEAN OPTICAL. All rights reserved.</p>
                    <div className="d-flex gap-4">
                        <a href="#" className="text-white-50 text-decoration-none hover-text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-white-50 text-decoration-none hover-text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
