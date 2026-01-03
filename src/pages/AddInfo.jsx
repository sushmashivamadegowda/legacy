import React, { useState } from 'react';
import { CaretLeft, CloudArrowUp, Eye, Users } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AddInfo = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('photosvids');
    const [details, setDetails] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isLoadingBeneficiaries, setIsLoadingBeneficiaries] = useState(true);

    useEffect(() => {
        if (token) {
            fetchBeneficiaries();
        }
    }, [token]);

    const fetchBeneficiaries = async () => {
        try {
            const response = await fetch('http://localhost:8000/beneficiaries', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBeneficiaries(data);
            }
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
        } finally {
            setIsLoadingBeneficiaries(false);
        }
    };

    const getPrivacyText = () => {
        if (isLoadingBeneficiaries) return 'Loading privacy settings...';

        // Map category to permission type
        let permType = 'docs';
        if (category === 'photosvids') permType = 'photos';
        else if (category === 'messages') permType = 'messages';

        const authorisedPeople = beneficiaries.filter(b => b[`can_access_${permType}`]);

        if (authorisedPeople.length === 0) {
            return <span>Only <strong>you</strong>. No contacts have permission for this category.</span>;
        }

        const names = authorisedPeople.map(p => p.name);
        if (names.length === 1) {
            return <span>Visible to <strong>{names[0]}</strong> after your digital legacy is triggered.</span>;
        }

        if (names.length === 2) {
            return <span>Visible to <strong>{names[0]}</strong> and <strong>{names[1]}</strong> after your digital legacy is triggered.</span>;
        }

        return <span>Visible to <strong>{names[0]}</strong> and <strong>{names.length - 1} others</strong> after your digital legacy is triggered.</span>;
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading('Uploading asset to secure storage...');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('details', details);
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                toast.success('Asset saved successfully!', { id: toastId });
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                toast.error(`Upload failed: ${errorData.detail || 'Unknown error'}`, { id: toastId });
            }
        } catch (error) {
            console.error('Error uploading:', error);
            toast.error('Error connecting to the server', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 4rem', maxWidth: '700px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', border: 'none', paddingLeft: 0 }}>
                <CaretLeft size={20} /> Back to Dashboard
            </button>

            <h1 style={{ marginBottom: '2rem' }}>Add New Asset</h1>

            <div className="card">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Title Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title / Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Netflix Subscription, Life Insurance Policy"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    {/* Category Select */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {[
                                { id: 'photosvids', label: 'Photos' },
                                { id: 'chromepass', label: 'Passwords' },
                                { id: 'gdrive', label: 'Drive' },
                                { id: 'messages', label: 'Messages' },
                                { id: 'passvault', label: 'Vault' },
                                { id: 'whatsapp', label: 'WhatsApp' }
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '50px',
                                        border: category === cat.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        background: category === cat.id ? '#E0F2F1' : 'white',
                                        color: category === cat.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                                        textTransform: 'capitalize',
                                        fontWeight: '500'
                                    }}
                                >
                                    {cat.label}
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
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    {/* File Upload (Functional) */}
                    <div
                        onClick={() => document.getElementById('file-upload').click()}
                        style={{ border: '2px dashed var(--color-border)', padding: '2rem', borderRadius: '16px', textAlign: 'center', color: 'var(--color-text-muted)', cursor: 'pointer', background: '#F8FAFC' }}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            hidden
                            onChange={handleFileChange}
                        />
                        <CloudArrowUp size={32} style={{ marginBottom: '0.5rem' }} />
                        <p style={{ margin: 0 }}>{file ? `Selected: ${file.name}` : 'Click to upload file or drag and drop'}</p>
                        <span style={{ fontSize: '0.8rem' }}>PDF, JPG, PNG (Max 10MB)</span>
                    </div>

                    {/* Visibility */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Who can see this?</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(2, 132, 199, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(2, 132, 199, 0.1)' }}>
                            <Eye size={24} color="var(--color-primary)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', flex: 1 }}>
                                {getPrivacyText()}
                            </span>
                            <button
                                type="button"
                                onClick={() => navigate('/trusted')}
                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isUploading}>
                            {isUploading ? 'Uploading...' : 'Save Asset'}
                        </button>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Cancel</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddInfo;
