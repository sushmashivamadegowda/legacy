import React, { useState, useEffect } from 'react';
import { CaretLeft, Plus, UserCircle, ToggleLeft, ToggleRight, Trash, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TrustedPeople = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchPeople();
    }, [token]);

    const fetchPeople = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/beneficiaries', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPeople(data);
            }
        } catch (error) {
            console.error('Error fetching people:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = async (id, type) => {
        const typeMap = { 'subscription': 'photos', 'docs': 'docs', 'messages': 'messages' };
        const permType = typeMap[type];

        try {
            const response = await fetch(`http://localhost:8000/beneficiaries/${id}/toggle/${permType}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const updated = await response.json();
                setPeople(people.map(p => p.id === id ? updated : p));
                toast.success('Permission updated');
            }
        } catch (error) {
            toast.error('Failed to update permission');
        }
    };

    const removePerson = async (id) => {
        if (!window.confirm('Are you sure you want to remove this contact?')) return;

        try {
            const response = await fetch(`http://localhost:8000/beneficiaries/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setPeople(people.filter(p => p.id !== id));
                toast.success('Contact removed');
            }
        } catch (error) {
            toast.error('Failed to remove contact');
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRelation, setNewRelation] = useState('');

    const addPerson = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/beneficiaries', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    email: newEmail,
                    relation: newRelation
                })
            });
            if (response.ok) {
                const newPerson = await response.json();
                setPeople([...people, newPerson]);
                toast.success('Contact added');
                setShowModal(false);
                setNewName('');
                setNewEmail('');
                setNewRelation('');
            }
        } catch (error) {
            toast.error('Failed to add contact');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 4rem', maxWidth: '800px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', border: 'none', paddingLeft: 0 }}>
                <CaretLeft size={20} /> Back to Dashboard
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Trusted People</h1>
                    <p>Manage who has access to your digital vault.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} weight="bold" style={{ marginRight: '8px' }} /> Add Person
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading...</div>
            ) : (
                <div className="people-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {people.map(person => (
                        <div key={person.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                        <UserCircle size={32} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{person.name}</h3>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{person.relation} • {person.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removePerson(person.id)}
                                    style={{ background: 'none', border: 'none', color: '#EF4444', opacity: 0.6, cursor: 'pointer' }}
                                    title="Remove"
                                >
                                    <Trash size={20} />
                                </button>
                            </div>

                            {/* Permissions Grid */}
                            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px' }}>
                                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Access Permissions</h4>

                                {[
                                    { id: 'subscription', label: 'Photos & Videos', perm: 'can_access_photos' },
                                    { id: 'docs', label: 'Important Documents', perm: 'can_access_docs' },
                                    { id: 'messages', label: 'Messages', perm: 'can_access_messages' }
                                ].map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #E2E8F0' }}>
                                        <span>{item.label}</span>
                                        <button
                                            onClick={() => togglePermission(person.id, item.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: person[item.perm] ? 'var(--color-primary)' : '#CBD5E1', transition: 'color 0.2s' }}
                                        >
                                            {person[item.perm] ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="fill" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {people.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
                            <p style={{ color: 'var(--color-text-muted)' }}>No trusted contacts added yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Person Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', zIndex: 1001 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Add Trusted Person</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={addPerson} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g. Sarah Miller"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="input-field"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="sarah@example.com"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Relationship</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={newRelation}
                                        onChange={(e) => setNewRelation(e.target.value)}
                                        placeholder="e.g. Sister, Spouse, Lawyer"
                                    />
                                </div>

                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Person</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrustedPeople;
