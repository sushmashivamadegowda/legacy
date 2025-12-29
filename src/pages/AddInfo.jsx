import React, { useState } from 'react';
import { CaretLeft, CloudArrowUp, Eye } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const AddInfo = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('subscription');

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 4rem', maxWidth: '700px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', border: 'none', paddingLeft: 0 }}>
                <CaretLeft size={20} /> Back to Dashboard
            </button>

            <h1 style={{ marginBottom: '2rem' }}>Add New Asset</h1>

            <div className="card">
                <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Title Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title / Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Netflix Subscription, Life Insurance Policy"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    {/* Category Select */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {['subscription', 'document', 'message', 'account'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '50px',
                                        border: category === cat ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        background: category === cat ? '#E0F2F1' : 'white',
                                        color: category === cat ? 'var(--color-primary)' : 'var(--color-text-main)',
                                        textTransform: 'capitalize',
                                        fontWeight: '500'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description / Details */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Details / Instructions</label>
                        <textarea
                            rows="4"
                            placeholder="Add any login details, account numbers, or personal notes here..."
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    {/* File Upload (Dummy) */}
                    <div style={{ border: '2px dashed var(--color-border)', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: 'var(--color-text-muted)', cursor: 'pointer', background: '#F8FAFC' }}>
                        <CloudArrowUp size={32} style={{ marginBottom: '0.5rem' }} />
                        <p style={{ margin: 0 }}>Click to upload file or drag and drop</p>
                        <span style={{ fontSize: '0.8rem' }}>PDF, JPG, PNG (Max 10MB)</span>
                    </div>

                    {/* Visibility */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Who can see this?</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#F0F9FF', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
                            <Eye size={24} color="#0284C7" />
                            <span style={{ fontSize: '0.9rem', color: '#0369A1' }}>Visible to <strong>Sarah Miller</strong> and <strong>David Chen</strong> after inactive period.</span>
                            <button type="button" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#0284C7', textDecoration: 'underline', fontSize: '0.9rem' }}>Edit</button>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Asset</button>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Cancel</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddInfo;
