import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
    ChevronRight, ShieldCheck, Truck, Clock, 
    Instagram, Facebook, Twitter, ArrowRight 
} from 'lucide-react';

export default function Home() {
    const { t } = useLanguage();

    const collections = [
        { id: 'all', name: t('all_frames'), image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800' },
        { id: 'medical', name: t('medical'), image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800' },
        { id: 'sunglasses', name: t('sunglasses'), image: 'https://images.unsplash.com/photo-1511499767390-90342f59b1a7?q=80&w=800' },
    ];

    const features = [
        { icon: <ShieldCheck className="text-brand-sky" size={32} />, title: 'Quality Assurance', desc: 'Certified lenses and frames' },
        { icon: <Truck className="text-brand-sky" size={32} />, title: 'Fast Delivery', desc: 'Secure shipping to your door' },
        { icon: <Clock className="text-brand-sky" size={32} />, title: '24/7 Support', desc: 'Expert optical consultation' },
    ];

    return (
        <div className="font-outfit bg-white">
            
            {/* Hero Section */}
            <section className="position-relative overflow-hidden vh-100 bg-brand-navy d-flex align-items-center">
                <div className="position-absolute top-0 start-0 w-100 h-100 opacity-50">
                    <img 
                        src="/images/hero_background.png" 
                        alt="Ocean Optical Hero" 
                        className="w-100 h-100 object-fit-cover shadow-lg"
                    />
                </div>

                <div className="container position-relative z-1 text-white">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-1 fw-bold text-uppercase tracking-tighter mb-4 animate-fade-in-up">
                                Distinctive <span className="text-brand-sky">Perspective</span>
                            </h1>
                            <p className="lead mb-5 opacity-75 max-w-sm">
                                Elevate your ocular aesthetic with our curated collection of luxury eyewear and precision lenses.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/products" className="btn btn-light btn-lg px-5 rounded-3 fw-bold text-uppercase tracking-widest small">
                                    Browse Shop
                                </Link>
                                <Link to="/contact" className="btn btn-outline-light btn-lg px-5 rounded-3 fw-bold text-uppercase tracking-widest small">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Collections Grid */}
            <section className="bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-5 pb-4 border-bottom border-light">
                        <div>
                            <span className="text-uppercase small fw-bold tracking-widest text-secondary mb-2 d-block">The Vault</span>
                            <h2 className="display-4 fw-bold text-brand-navy m-0">COLLECTIONS</h2>
                        </div>
                        <Link to="/products" className="text-brand-navy text-decoration-none fw-bold small text-uppercase tracking-widest d-flex align-items-center gap-2">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="row g-4">
                        {collections.map((cat) => (
                            <div key={cat.id} className="col-md-4">
                                <Link to={`/products?cat=${cat.id}`} className="card border-0 overflow-hidden h-100 rounded-3 text-white text-decoration-none group">
                                    <div className="position-absolute top-0 start-0 w-100 h-100 z-1 bg-dark opacity-25"></div>
                                    <img src={cat.image} className="w-100 h-100 object-fit-cover transition-transform" style={{ minHeight: '500px' }} alt={cat.name} />
                                    <div className="card-img-overlay d-flex flex-column justify-content-end p-5 z-2">
                                        <h3 className="display-6 fw-bold text-uppercase tracking-tight m-0">{cat.name}</h3>
                                        <div className="mt-3 overflow-hidden" style={{ height: '2px', width: '0%', backgroundColor: 'white', transition: 'width 0.3s ease' }}></div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-light">
                <div className="container">
                    <div className="row g-5">
                        {features.map((f, i) => (
                            <div key={i} className="col-md-4">
                                <div className="p-5 bg-white rounded-4 border border-white shadow-sm h-100">
                                    <div className="mb-4">{f.icon}</div>
                                    <h4 className="fw-bold text-brand-navy text-uppercase mb-3">{f.title}</h4>
                                    <p className="text-secondary small mb-0">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instagram Style Grid */}
            <section className="overflow-hidden p-0">
                <div className="row g-0">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="col-4 col-sm-2">
                            <div className="ratio ratio-1x1 overflow-hidden opacity-90 hover-opacity-100">
                                <img 
                                    src={`https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&sig=${i}`} 
                                    alt="Insta" 
                                    className="w-100 h-100 object-fit-cover grayscale hover-grayscale-0 transition-grayscale"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
