import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, FileText, DownloadSimple, Trash } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AssetList = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState(null);

    useEffect(() => {
        if (token) fetchAssets();
    }, [category, token]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/assets/${category}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAssets(data);
            }
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const categoryNames = {
        'photosvids': 'Photos & Videos',
        'chromepass': 'Chrome Passwords',
        'gdrive': 'Google Drive',
        'messages': 'Messages',
        'passvault': 'Password Vault',
        'whatsapp': 'WhatsApp Backups',
        'beneficiaries': 'Beneficiaries'
    };

    const categoryDisplayName = categoryNames[category] || category;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <CaretLeft size={20} color="var(--color-text-main)" />
                </button>
                <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-text-main)' }}>{categoryDisplayName}</h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading assets...</div>
            ) : assets.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                    <h3 style={{ color: 'var(--color-text-main)' }}>No assets found</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You haven't added any items to this category yet.</p>
                    <button onClick={() => navigate('/add-info')} className="btn btn-primary">Add Asset</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {assets.map((asset) => (
                        <motion.div
                            key={asset.id}
                            whileHover={{ y: -5 }}
                            className="card"
                            style={{ cursor: 'pointer', padding: '1.5rem', position: 'relative' }}
                            onClick={() => setSelectedAsset(asset)}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                                    <FileText size={24} color="var(--color-primary)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>{asset.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>{asset.file_name}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedAsset && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAsset(null)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative', zIndex: 1001, maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)', fontWeight: 'bold' }}>{selectedAsset.category}</span>
                                    <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem', color: 'var(--color-text-main)' }}>{selectedAsset.title}</h2>
                                </div>
                                <button onClick={() => setSelectedAsset(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>×</button>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Instructions / Details</label>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', whiteSpace: 'pre-wrap' }}>
                                    {selectedAsset.details || 'No additional details provided.'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(var(--color-primary-rgb), 0.05)', borderRadius: '12px', border: '1px solid rgba(var(--color-primary-rgb), 0.1)', marginBottom: '2rem' }}>
                                <FileText size={32} color="var(--color-primary)" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>{selectedAsset.file_name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Stored securely in S3</div>
                                </div>
                                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <DownloadSimple size={18} /> Download
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSelectedAsset(null)}>Done</button>
                                <button className="btn btn-secondary" style={{ color: '#EF4444' }}><Trash size={18} /></button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssetList;
