import React, { useState } from 'react';
import { CaretLeft, Check, Plus, UserCircle, ToggleLeft, ToggleRight, Trash } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const TrustedPeople = () => {
    const navigate = useNavigate();

    // Dummy State
    const [people, setPeople] = useState([
        { id: 1, name: 'Sarah Miller', email: 'sarah.m@example.com', relation: 'Spouse', permissions: { subscription: true, docs: true, messages: false } },
        { id: 2, name: 'David Chen', email: 'd.chen@example.com', relation: 'Brother', permissions: { subscription: false, docs: true, messages: true } },
    ]);

    const togglePermission = (id, type) => {
        setPeople(people.map(p => {
            if (p.id === id) {
                return { ...p, permissions: { ...p.permissions, [type]: !p.permissions[type] } };
            }
            return p;
        }));
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
                <button className="btn btn-primary" onClick={() => alert('Add Person Modal functionality would open here.')}>
                    <Plus size={20} weight="bold" style={{ marginRight: '8px' }} /> Add Person
                </button>
            </div>

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
                            <button style={{ background: 'none', border: 'none', color: '#EF4444', opacity: 0.6, cursor: 'pointer' }} title="Remove">
                                <Trash size={20} />
                            </button>
                        </div>

                        {/* Permissions Grid */}
                        <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px' }}>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Access Permissions</h4>

                            {['subscription', 'docs', 'messages'].map(type => (
                                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #E2E8F0' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{type === 'docs' ? 'Important Documents' : type + 's'}</span>
                                    <button
                                        onClick={() => togglePermission(person.id, type)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: person.permissions[type] ? 'var(--color-primary)' : '#CBD5E1', transition: 'color 0.2s' }}
                                    >
                                        {person.permissions[type] ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="fill" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default TrustedPeople;
