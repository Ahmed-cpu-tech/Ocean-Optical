import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
    FileText, User, Phone, Eye, Glasses, 
    Send, CheckCircle, PlusCircle, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon: Icon }) => (
    <div className="mb-3">
        <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest ms-1">{label}</label>
        <div className="input-group">
            {Icon && (
                <span className="input-group-text bg-white border-light text-secondary opacity-50 px-3">
                    <Icon size={16} />
                </span>
            )}
            <input 
                required 
                type={type} 
                name={name} 
                value={value || ''} 
                onChange={onChange} 
                placeholder={placeholder}
                className="form-control bg-white border-light small px-3 py-2"
                style={{ fontSize: '14px' }}
            />
        </div>
    </div>
);

export default function PrescriptionForm() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '', phone: '',
        od_sph: '', od_cyl: '', od_axis: '',
        og_sph: '', og_cyl: '', og_axis: '',
        product_id: null
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        window.axios.get('/api/products')
            .then(res => {
                console.log('PrescriptionForm products response:', res.data);
                const raw = Array.isArray(res.data?.data) ? res.data.data
                          : Array.isArray(res.data)       ? res.data
                          : [];
                setProducts(raw);
            })
            .catch(err => console.error('Products fetch error:', err.response?.data || err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone', formData.phone);
            if (formData.product_id) data.append('product_id', formData.product_id);
            if (formData.od_sph) data.append('od_sph', formData.od_sph);
            if (formData.od_cyl) data.append('od_cyl', formData.od_cyl);
            if (formData.od_axis) data.append('od_axis', formData.od_axis);
            if (formData.og_sph) data.append('og_sph', formData.og_sph);
            if (formData.og_cyl) data.append('og_cyl', formData.og_cyl);
            if (formData.og_axis) data.append('og_axis', formData.og_axis);
            if (image) data.append('image', image);

            const res = await window.axios.post('/api/prescriptions', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            console.log('Prescription submitted:', res.data);
            setSuccess(true);
            setFormData({ name: '', phone: '', od_sph: '', od_cyl: '', od_axis: '', og_sph: '', og_cyl: '', og_axis: '', product_id: null });
            setImage(null);
            setImagePreview(null);
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error('Prescription error:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-vh-100" style={{ paddingTop: '160px', paddingBottom: '80px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                
                {/* Minimalist Header */}
                <div className="text-center mb-5 pb-5 border-bottom border-light">
                    <div className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center mb-4 border" style={{ width: '56px', height: '56px' }}>
                        <FileText size={24} className="text-brand-navy" />
                    </div>
                    <h1 className="h2 fw-bold text-brand-navy text-uppercase tracking-tight m-0">{t('prescriptions')}</h1>
                    <p className="small fw-bold text-secondary text-uppercase tracking-widest mt-2 opacity-50">Upload or Enter Manual Measurements</p>
                </div>

                {success && (
                    <div className="alert alert-success border-0 rounded-4 p-4 mb-5 d-flex align-items-center gap-3 shadow-sm text-success">
                        <CheckCircle size={20} />
                        <span className="small fw-bold text-uppercase tracking-widest">Submission confirmed. Our optical specialists will review.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    {/* Section 1: Identity */}
                    <div className="p-4 p-md-5 bg-light rounded-5 border border-white shadow-sm mb-5">
                        <h3 className="h6 fw-bold text-uppercase tracking-[0.2em] text-brand-navy mb-4 d-flex align-items-center gap-2">
                            <User size={14} className="text-secondary opacity-50" /> Identity
                        </h3>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <InputField label={t('name')} name="name" icon={User} placeholder="Full legal name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <InputField label={t('phone')} name="phone" icon={Phone} placeholder="+212 ..." value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Photo Upload */}
                    <div className="p-4 p-md-5 bg-light rounded-5 border border-white shadow-sm mb-5">
                        <h3 className="h6 fw-bold text-uppercase tracking-[0.2em] text-brand-navy mb-4 d-flex align-items-center gap-2">
                            <PlusCircle size={14} className="text-secondary opacity-50" /> Photo of Prescription
                        </h3>
                        <div className="bg-white p-4 rounded-4 border-dashed text-center">
                            {imagePreview ? (
                                <div className="position-relative d-inline-block">
                                    <img src={imagePreview} alt="Preview" className="img-thumbnail rounded-4 shadow-sm mb-3" style={{ maxHeight: '300px' }} />
                                    <button 
                                        type="button" 
                                        onClick={() => {setImage(null); setImagePreview(null);}}
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                                    >×</button>
                                </div>
                            ) : (
                                <div 
                                    className="py-5 cursor-pointer"
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    <div className="mb-3 text-secondary opacity-25">
                                        <PlusCircle size={48} />
                                    </div>
                                    <p className="small text-secondary fw-bold text-uppercase tracking-widest mb-1">Click to upload photo</p>
                                    <p className="text-muted extra-small">JPEG, PNG, WEBP (Max 10MB)</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                id="imageInput" 
                                className="d-none" 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <p className="small text-muted font-italic mb-0">Or enter manual data below:</p>
                        </div>
                    </div>

                    {/* Section 3: Technical Rx */}
                    <div className="p-4 p-md-5 bg-light rounded-5 border border-white shadow-sm mb-5 opacity-75">
                        <h3 className="h6 fw-bold text-uppercase tracking-[0.2em] text-brand-navy mb-4 d-flex align-items-center gap-2">
                            <Eye size={14} className="text-secondary opacity-50" /> Technical Data (Optional)
                        </h3>
                        
                        <div className="row g-5">
                            {/* OD */}
                            <div className="col-lg-6 border-end-lg border-light">
                                <h4 className="small fw-bold text-uppercase tracking-widest text-secondary mb-4 opacity-75 d-flex align-items-center gap-2">
                                    <span className="bg-brand-sky rounded-circle" style={{ width: '8px', height: '8px' }}></span> Oeil Droit (OD)
                                </h4>
                                <div className="row g-3">
                                    <div className="col-4"><InputField label="SPH" name="od_sph" placeholder="-2.00" value={formData.od_sph} onChange={handleChange} /></div>
                                    <div className="col-4"><InputField label="CYL" name="od_cyl" placeholder="0.00" value={formData.od_cyl} onChange={handleChange} /></div>
                                    <div className="col-4"><InputField label="AXIS" name="od_axis" placeholder="180°" value={formData.od_axis} onChange={handleChange} /></div>
                                </div>
                            </div>

                            {/* OG */}
                            <div className="col-lg-6">
                                <h4 className="small fw-bold text-uppercase tracking-widest text-secondary mb-4 opacity-75 d-flex align-items-center gap-2">
                                    <span className="bg-secondary bg-opacity-25 rounded-circle" style={{ width: '8px', height: '8px' }}></span> Oeil Gauche (OG)
                                </h4>
                                <div className="row g-3">
                                    <div className="col-4"><InputField label="SPH" name="og_sph" placeholder="-2.00" value={formData.og_sph} onChange={handleChange} /></div>
                                    <div className="col-4"><InputField label="CYL" name="og_cyl" placeholder="0.00" value={formData.og_cyl} onChange={handleChange} /></div>
                                    <div className="col-4"><InputField label="AXIS" name="og_axis" placeholder="180°" value={formData.og_axis} onChange={handleChange} /></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Frame */}
                    <div className="p-4 p-md-5 bg-light rounded-5 border border-white shadow-sm mb-5">
                        <h3 className="h6 fw-bold text-uppercase tracking-[0.2em] text-brand-navy mb-4 d-flex align-items-center gap-2">
                            <Glasses size={14} className="text-secondary opacity-50" /> Frame Selection
                        </h3>
                        
                        <div className="row row-cols-2 row-cols-sm-4 row-cols-md-5 g-3">
                            {products.map(p => (
                                <div key={p.id} className="col">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, product_id: p.id})}
                                        className={`btn p-0 w-100 h-100 ratio ratio-1x1 rounded-4 overflow-hidden border-2 transition-all ${formData.product_id === p.id ? 'border-brand-navy shadow-sm' : 'border-light'}`}
                                    >
                                        <img src={p.image_url} alt={p.name} className="w-100 h-100 object-fit-cover" />
                                        {formData.product_id === p.id && (
                                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-brand-navy bg-opacity-10 d-flex align-items-center justify-content-center">
                                                <div className="bg-brand-navy text-white rounded-circle p-1"><CheckCircle size={14}/></div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            ))}
                            <div className="col">
                                <Link to="/products" className="btn btn-outline-light border-dashed border-2 w-100 h-100 ratio ratio-1x1 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 text-decoration-none transition-all">
                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <PlusCircle size={20} className="text-secondary opacity-50" />
                                        <span className="small fw-bold text-uppercase tracking-widest text-secondary opacity-50" style={{ fontSize: '8px' }}>Explore More</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn btn-lg bg-brand-navy text-white w-100 rounded-3 py-4 fw-bold text-uppercase tracking-widest shadow-sm mt-3"
                            style={{ fontSize: '12px' }}
                        >
                            <div className="d-flex align-items-center justify-content-center gap-3">
                                {loading ? 'Transmitting...' : 'Complete Digital Rx'}
                                {!loading && <Send size={18} />}
                            </div>
                        </button>
                        
                        <div className="text-center">
                            <p className="small fw-bold text-uppercase tracking-widest text-secondary opacity-50 d-flex align-items-center justify-content-center gap-2 m-0">
                                <Info size={12} /> Privacy protected data transmission
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
