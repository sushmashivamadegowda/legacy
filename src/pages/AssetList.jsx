import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, FileText, DownloadSimple, Trash, X, MagnifyingGlassPlus } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AssetList = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState(null);

    useEffect(() => {
        if (user) fetchAssets();
    }, [category, user]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .eq('category', category)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssets(data);
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

    const AssetLightboxContent = ({ asset }) => {
        const [url, setUrl] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchUrl = async () => {
                try {
                    const { data, error } = await supabase.storage
                        .from('assets')
                        .createSignedUrl(asset.object_name, 3600);

                    if (error) throw error;
                    setUrl(data.signedUrl);
                } catch (err) {
                    console.error("Lightbox fetch error", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchUrl();
        }, [asset.object_name]);

        if (loading) return <div className="skeleton" style={{ width: '100%', height: '400px' }}></div>;
        if (!url) return <div style={{ padding: '3rem', textAlign: 'center', color: 'white' }}>Failed to load preview.</div>;

        return (
            <div style={{ width: '100%', maxHeight: '70vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={url} alt={asset.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
        );
    };

    const categoryDisplayName = categoryNames[category] || category;

    const AssetCard = ({ asset }) => {
        const [imageUrl, setImageUrl] = useState(null);
        const [isImageLoading, setIsImageLoading] = useState(false);

        useEffect(() => {
            if (category === 'photosvids') {
                fetchImageUrl();
            }
        }, [asset.id]);

        const fetchImageUrl = async () => {
            setIsImageLoading(true);
            try {
                const { data, error } = await supabase.storage
                    .from('assets')
                    .createSignedUrl(asset.object_name, 3600);

                if (error) throw error;
                setImageUrl(data.signedUrl);
            } catch (err) {
                console.error("Failed to load image url", err);
            } finally {
                setIsImageLoading(false);
            }
        };

        const isPhoto = category === 'photosvids';

        return (
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="card"
                style={{
                    cursor: 'pointer',
                    padding: isPhoto ? '0' : '1.5rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: isPhoto ? 'column' : 'row',
                    gap: isPhoto ? '0' : '1rem',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)'
                }}
                onClick={() => setSelectedAsset(asset)}
            >
                {isPhoto ? (
                    <>
                        <div style={{ height: '200px', width: '100%', background: '#000', position: 'relative', overflow: 'hidden' }}>
                            {imageUrl ? (
                                <img src={imageUrl} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
                                    {isImageLoading ? <div className="skeleton" style={{ width: '100%', height: '100%' }}></div> : <FileText size={48} color="var(--color-primary)" opacity={0.3} />}
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.title}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{asset.file_name}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', padding: '0.75rem', borderRadius: '12px', height: 'fit-content' }}>
                            <FileText size={24} color="var(--color-primary)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>{asset.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>{asset.file_name}</p>
                        </div>
                    </>
                )}
            </motion.div>
        );
    };

    const SkeletonAssetCard = () => (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '70%', height: '1.1rem', marginBottom: '0.25rem' }}></div>
                <div className="skeleton" style={{ width: '40%', height: '0.85rem' }}></div>
            </div>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <CaretLeft size={20} color="var(--color-text-main)" />
                </button>
                <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-text-main)' }}>{categoryDisplayName}</h1>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {[...Array(6)].map((_, i) => <SkeletonAssetCard key={i} />)}
                </div>
            ) : assets.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                    <h3 style={{ color: 'var(--color-text-main)' }}>No assets found</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You haven't added any items to this category yet.</p>
                    <button onClick={() => navigate('/add-info')} className="btn btn-primary">Add Asset</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {assets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                    ))}
                </div>
            )}

            {/* Detail Modal / Lightbox */}
            <AnimatePresence>
                {selectedAsset && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAsset(null)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="card"
                            style={{
                                width: '100%',
                                maxWidth: category === 'photosvids' ? '900px' : '600px',
                                padding: category === 'photosvids' ? '0' : '2rem',
                                position: 'relative',
                                zIndex: 1001,
                                maxHeight: '90vh',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <button
                                onClick={() => setSelectedAsset(null)}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10 }}
                            >
                                <X size={24} />
                            </button>

                            {category === 'photosvids' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <AssetLightboxContent asset={selectedAsset} />
                                    <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)' }}>
                                        <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>{selectedAsset.title}</h2>
                                        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 1.5rem' }}>{selectedAsset.file_name} • {selectedAsset.details || 'No description'}</p>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSelectedAsset(null)}>Close</button>
                                            <button className="btn btn-secondary" style={{ color: '#EF4444' }} onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete this asset?')) {
                                                    try {
                                                        const { error: storageError } = await supabase.storage
                                                            .from('assets')
                                                            .remove([selectedAsset.object_name]);

                                                        const { error: dbError } = await supabase
                                                            .from('assets')
                                                            .delete()
                                                            .eq('id', selectedAsset.id);

                                                        if (dbError) throw dbError;
                                                        setSelectedAsset(null);
                                                        fetchAssets();
                                                    } catch (err) {
                                                        console.error('Delete failed:', err);
                                                    }
                                                }
                                            }}><Trash size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)', fontWeight: 'bold' }}>{categoryDisplayName}</span>
                                            <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem', color: 'var(--color-text-main)' }}>{selectedAsset.title}</h2>
                                        </div>
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
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Stored securely</div>
                                        </div>
                                        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <DownloadSimple size={18} /> Download
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSelectedAsset(null)}>Done</button>
                                        <button className="btn btn-secondary" style={{ color: '#EF4444' }} onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this asset?')) {
                                                try {
                                                    await supabase.storage
                                                        .from('assets')
                                                        .remove([selectedAsset.object_name]);

                                                    const { error } = await supabase
                                                        .from('assets')
                                                        .delete()
                                                        .eq('id', selectedAsset.id);

                                                    if (error) throw error;
                                                    setSelectedAsset(null);
                                                    fetchAssets();
                                                } catch (err) {
                                                    console.error('Delete failed:', err);
                                                }
                                            }
                                        }}><Trash size={18} /></button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssetList;
