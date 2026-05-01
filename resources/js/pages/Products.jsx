import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Filter, Search, Grid, List, ChevronRight, SlidersHorizontal } from 'lucide-react';

const SkeletonCard = () => (
    <div className="card h-100 border-light p-4 placeholder-glow">
        <div className="ratio ratio-1x1 bg-light rounded-3 mb-4 placeholder"></div>
        <div className="placeholder col-8 mb-3"></div>
        <div className="placeholder col-5"></div>
    </div>
);

export default function Products() {
    const { t } = useLanguage();

    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        window.axios.get('/api/products')
            .then(res => {
                let data;
                if (Array.isArray(res.data?.data)) {
                    data = res.data.data;
                } else if (Array.isArray(res.data)) {
                    data = res.data;
                } else {
                    data = [];
                }
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('[Products] Fetch error:', err);
                setProducts([]);
                setLoading(false);
            });
    }, []);

    const filtered = (Array.isArray(products) ? products : []).filter(p => {
        const matchesFilter = filter === 'all' || p.type === filter;
        const matchesSearch = (p.name ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="bg-white min-vh-100" style={{ paddingTop: '160px', paddingBottom: '80px' }}>
            
            <div className="container mb-5">
                <div className="row align-items-end g-4 pb-5 border-bottom">
                    <div className="col-md-auto">
                        <span className="text-uppercase small fw-bold tracking-widest text-secondary mb-2 d-block">Collections</span>
                        <h1 className="display-5 fw-bold text-brand-navy m-0 text-uppercase">
                            Visionary <span className="text-light-emphasis">Frames</span>
                        </h1>
                    </div>
                    <div className="col-md-4 ms-md-auto">
                        <div className="position-relative">
                            <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" size={16} />
                            <input 
                                type="text" 
                                placeholder="Find a model..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-control form-control-lg border-0 bg-light rounded-3 ps-5 small"
                                style={{ fontSize: '14px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row g-5">
                    
                    <aside className="col-lg-3 order-2 order-lg-1">
                        <div className="sticky-top" style={{ top: '120px' }}>
                            <div className="mb-5">
                                <h3 className="text-uppercase small fw-bold tracking-widest text-brand-navy mb-4 d-flex align-items-center gap-2">
                                    <SlidersHorizontal size={14} /> Filters
                                </h3>
                                <div className="d-flex flex-column gap-1">
                                    {['all', 'medical', 'sunglasses'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilter(cat)}
                                            className={`btn d-flex align-items-center justify-content-between px-4 py-3 rounded-3 text-start small fw-bold text-uppercase tracking-widest transition-all ${
                                                filter === cat 
                                                ? 'bg-brand-navy text-white shadow-sm' 
                                                : 'text-secondary hover-bg-light'
                                            }`}
                                        >
                                            <span>{cat === 'all' ? t('all') : t(cat)}</span>
                                            {filter === cat && <ChevronRight size={12} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-light rounded-4 border-0">
                                <h4 className="fw-bold text-brand-navy small text-uppercase mb-3">Store Service</h4>
                                <p className="text-secondary small mb-4 opacity-75">Book a consultation at our Asfi boutique for custom lens fitting.</p>
                                <button className="btn btn-outline-dark w-100 py-3 rounded-3 small fw-bold text-uppercase tracking-widest">
                                    Reserve Appt
                                </button>
                            </div>
                        </div>
                    </aside>

                    <main className="col-lg-9 order-1 order-lg-2">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <p className="text-uppercase small fw-bold text-secondary tracking-widest m-0">
                                Results <span className="text-brand-navy ms-1">{filtered.length}</span>
                            </p>
                            <div className="d-flex gap-2">
                                <button className="btn btn-link p-2 text-brand-navy"><Grid size={16} /></button>
                                <button className="btn btn-link p-2 text-secondary opacity-50"><List size={16} /></button>
                            </div>
                        </div>

                        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="col">
                                        <SkeletonCard />
                                    </div>
                                ))
                            ) : filtered.length > 0 ? (
                                filtered.map(product => (
                                    <div key={product.id} className="col">
                                        <div className="card h-100 border-light overflow-hidden shadow-sm hover-shadow-md transition">
                                            <div className="position-relative ratio ratio-1x1 bg-light">
                                                <img
                                                    src={product.image_url || 'https://via.placeholder.com/500'}
                                                    alt={product.name}
                                                    className="w-100 h-100 object-fit-cover transition"
                                                />
                                                {product.is_new && (
                                                    <div className="position-absolute top-0 start-0 m-3 z-1">
                                                        <span className="badge bg-brand-navy rounded-1 text-uppercase small tracking-widest px-2 py-1">New</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="card-body d-flex flex-column gap-3 p-4">
                                                <div className="d-flex justify-content-between align-items-start gap-2">
                                                    <h3 className="h6 fw-bold text-brand-navy text-uppercase m-0 truncate">{product.name}</h3>
                                                    <span className="small fw-bold text-secondary">{product.price} DHS</span>
                                                </div>

                                                <span className="text-uppercase small fw-bold text-secondary opacity-50 tracking-widest">
                                                    {product.type === 'medical' ? 'Medical' : 'Sunglasses'}
                                                </span>
                                                
                                                <p className="card-text small text-secondary opacity-75 fst-italic mb-auto">
                                                    {product.description || 'Modern aesthetics combined with superior protection.'}
                                                </p>

                                                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                                                    <div className="d-flex gap-2">
                                                        {Array.isArray(product.colors) && product.colors.map((color, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="rounded-circle border"
                                                                style={{ width: '12px', height: '12px', backgroundColor: color }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                    <button className="btn btn-link p-0 text-brand-navy text-decoration-none small fw-bold text-uppercase tracking-widest">
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5 border rounded-4 border-dashed bg-light">
                                    <p className="small fw-bold text-uppercase tracking-widest m-0">No models match your search</p>
                                    <button onClick={() => {setFilter('all'); setSearchQuery('');}} className="btn btn-link text-brand-sky text-decoration-none small fw-bold text-uppercase mt-2">Reset filters</button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
