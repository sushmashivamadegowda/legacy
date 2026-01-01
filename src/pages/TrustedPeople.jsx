import React, { useState, useEffect } from 'react';
import { CaretLeft, Plus, UserCircle, ToggleLeft, ToggleRight, Trash } from '@phosphor-icons/react';
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

    const addPerson = async () => {
        // Simplified for production demo - usually a modal
        const name = prompt('Enter Name:');
        if (!name) return;
        const email = prompt('Enter Email:');
        if (!email) return;
        const relation = prompt('Enter Relation:');
        if (!relation) return;

        try {
            const response = await fetch('http://localhost:8000/beneficiaries', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, relation })
            });
            if (response.ok) {
                const newPerson = await response.json();
                setPeople([...people, newPerson]);
                toast.success('Contact added');
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
                <button className="btn btn-primary" onClick={addPerson}>
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

        </div>
    );
};

export default TrustedPeople;
