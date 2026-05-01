import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Box } from 'lucide-react';

function InventoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', type: 'medical', price: '', description: '' });
    const [editImage, setEditImage] = useState(null);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await window.axios.get(`/api/products/${id}`);
                const data = res.data?.data || res.data;
                setProduct(data);
                setEditData({
                    name: data.name,
                    type: data.type,
                    price: data.price,
                    description: data.description || ''
                });
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await window.axios.delete(`/api/products/${id}`);
            navigate('/dashboard/inventory');
        } catch (err) {
            alert("Failed to delete product.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitError('');
        const data = new FormData();
        data.append('name', editData.name);
        data.append('type', editData.type);
        data.append('price', editData.price);
        data.append('description', editData.description);
        data.append('_method', 'POST'); // Laravel trick for multipart PUT/PATCH
        if (editImage) data.append('image', editImage);

        try {
            const res = await window.axios.post(`/api/products/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProduct(res.data);
            setIsEditing(false);
            setEditImage(null);
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Failed to update product.");
        }
    };

    if (loading) return <div className="p-5 text-center text-secondary">Loading details...</div>;
    if (error || !product) return <div className="p-5 text-center text-danger">Item not found. <button onClick={() => navigate('/dashboard/inventory')} className="btn btn-link">Go back</button></div>;

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom border-light p-4 d-flex align-items-center gap-3">
                <button onClick={() => navigate('/dashboard/inventory')} className="btn btn-outline-secondary btn-sm p-2 rounded-circle"><ArrowLeft size={16} /></button>
                <h2 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest m-0">Product Details: #PRD-{product.id}</h2>
            </div>
            <div className="card-body p-4 p-md-5">
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest">Name</label>
                            <input required type="text" className="form-control" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest">Type</label>
                            <select className="form-select" value={editData.type} onChange={e => setEditData({...editData, type: e.target.value})}>
                                <option value="medical">Medical</option>
                                <option value="sunglasses">Sunglasses</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest">Price (DHS)</label>
                            <input required type="number" className="form-control" value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest">Description</label>
                            <textarea className="form-control" rows="3" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})}></textarea>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest">Replace Image (Optional)</label>
                            <input type="file" accept="image/*" className="form-control" onChange={e => setEditImage(e.target.files[0])} />
                        </div>
                        {submitError && <div className="col-12 text-danger small fw-bold">{submitError}</div>}
                        <div className="col-12 d-flex gap-3">
                            <button type="submit" className="btn bg-brand-navy text-white px-4 py-2 small fw-bold text-uppercase">Save Changes</button>
                            <button type="button" className="btn btn-light px-4 py-2 small fw-bold text-uppercase" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="row g-4">
                            <div className="col-md-4">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="img-fluid rounded shadow-sm" style={{ maxHeight: '300px', objectFit: 'cover' }} />
                                ) : (
                                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                        <Box size={48} className="text-secondary opacity-25" />
                                    </div>
                                )}
                            </div>
                            <div className="col-md-8">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-1">Name</label>
                                        <h3 className="h4 fw-bold text-brand-navy m-0">{product.name}</h3>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-1">Type</label>
                                        <div><span className="badge bg-info bg-opacity-10 text-info text-uppercase tracking-widest small px-3 py-2">{product.type}</span></div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-1">Price</label>
                                        <p className="fw-bold fs-5 text-dark m-0">{product.price || 'N/A'} DHS</p>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <label className="text-secondary small fw-bold text-uppercase tracking-widest opacity-50 mb-1">Description</label>
                                        <p className="text-secondary">{product.description || 'No description available.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 pt-4 border-top border-light d-flex gap-3">
                            <button className="btn btn-outline-dark fw-bold text-uppercase tracking-widest small d-flex align-items-center gap-2 px-4" onClick={() => setIsEditing(true)}><Edit2 size={14} /> Edit Model</button>
                            <button className="btn btn-outline-danger fw-bold text-uppercase tracking-widest small d-flex align-items-center gap-2 px-4" onClick={handleDelete}><Trash2 size={14} /> Delete Model</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function InventoryList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'medical', price: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await window.axios.get('/api/products');
                setProducts(Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitError('');
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('type', formData.type);
        data.append('price', formData.price);
        data.append('description', formData.description || '');
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const res = await window.axios.post('/api/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProducts([res.data, ...products]);
            setFormData({ name: '', type: 'medical', price: '', description: '' });
            setImageFile(null);
            setShowForm(false);
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to add entry.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await window.axios.delete(`/api/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert("Failed to delete product.");
        }
    };

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom border-light p-4 d-flex justify-content-between align-items-center">
                <h2 className="h6 fw-bold text-brand-navy text-uppercase tracking-widest m-0 d-flex align-items-center gap-2"><Box size={18} /> Inventory List</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-sm bg-brand-navy text-white px-3 py-2 rounded-3 small fw-bold text-uppercase tracking-widest d-flex align-items-center gap-2"
                >
                    <Plus size={14} /> {showForm ? 'Cancel' : 'Add Entry'}
                </button>
            </div>

            {showForm && (
                <div className="bg-light p-4 border-bottom border-light">
                    <form onSubmit={handleAdd} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest mb-2" style={{ fontSize: '10px' }}>Item Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-control form-control-sm border-0" placeholder="e.g. Retro Aviator" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest mb-2" style={{ fontSize: '10px' }}>Type</label>
                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="form-select form-select-sm border-0">
                                <option value="medical">Medical</option>
                                <option value="sunglasses">Sunglasses</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest mb-2" style={{ fontSize: '10px' }}>Price (DHS)</label>
                            <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="form-control form-control-sm border-0" placeholder="0.00" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest mb-2" style={{ fontSize: '10px' }}>Product Image</label>
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="form-control form-control-sm border-0" />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-widest mb-2" style={{ fontSize: '10px' }}>Description</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-control form-control-sm border-0" rows="2" placeholder="Product description..."></textarea>
                        </div>
                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-sm bg-brand-sky text-brand-navy fw-bold text-uppercase tracking-widest px-4 py-2">Save Product</button>
                        </div>
                    </form>
                    {submitError && <div className="text-danger small fw-bold mt-2" style={{ fontSize: '12px' }}>{submitError}</div>}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle m-0">
                    <thead className="bg-light text-uppercase tracking-widest text-secondary opacity-50" style={{ fontSize: '10px' }}>
                        <tr>
                            <th className="px-4 py-3 border-0">Image</th>
                            <th className="px-4 py-3 border-0">ID</th>
                            <th className="px-4 py-3 border-0">Item Name</th>
                            <th className="px-4 py-3 border-0">Type</th>
                            <th className="px-4 py-3 border-0 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-5">Loading...</td></tr>
                        ) : products.length > 0 ? (
                            products.map(p => (
                                <tr key={p.id} className="small">
                                    <td className="px-4 py-4 border-0">
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.name} className="rounded shadow-sm" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <Box size={16} className="text-secondary opacity-25" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 border-0 text-secondary fw-bold">
                                        <Link to={`/dashboard/inventory/${p.id}`} className="text-decoration-none">#PRD-{p.id}</Link>
                                    </td>
                                    <td className="px-4 py-4 border-0 fw-bold text-brand-navy text-uppercase">
                                        <Link to={`/dashboard/inventory/${p.id}`} className="text-decoration-none text-brand-navy">{p.name}</Link>
                                    </td>
                                    <td className="px-4 py-4 border-0">
                                        <span className="badge bg-info bg-opacity-10 text-info text-uppercase tracking-widest small px-2 py-1" style={{ fontSize: '8px' }}>{p.type}</span>
                                    </td>
                                    <td className="px-4 py-4 border-0 text-end">
                                        <div className="d-flex justify-content-end gap-3 align-items-center">
                                            <Link to={`/dashboard/inventory/${p.id}`} className="btn btn-link p-0 text-brand-navy hover-text-dark text-uppercase tracking-widest fw-bold" style={{ fontSize: '10px' }}>View Details</Link>
                                            <button onClick={() => handleDelete(p.id)} className="btn btn-link p-0 text-danger hover-text-dark transition-colors border-0">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-5 text-secondary">No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function InventoryManager() {
    return (
        <Routes>
            <Route path="/" element={<InventoryList />} />
            <Route path="/:id" element={<InventoryDetail />} />
        </Routes>
    );
}
