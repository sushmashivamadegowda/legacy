import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
    Users,
    EnvelopeSimple,
    Plus,
    SignOut,
    Bell,
    Image,
    Key,
    GoogleChromeLogo,
    GoogleDriveLogo,
    CheckCircle,
    Clock,
    WhatsappLogo
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout, user, token } = useAuth();
    const cardsRef = useRef([]);
    const [counts, setCounts] = useState({});

    useEffect(() => {
        fetchStats();
        // Stagger animation for stat cards
        gsap.fromTo(
            cardsRef.current,
            { y: 40, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.4)'
            }
        );
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/user/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCounts(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const stats = [
        { title: 'Photos & Videos', count: counts.photosvids || 0, icon: <Image size={32} color="#EC407A" />, color: 'rgba(236, 64, 122, 0.15)', border: '#EC407A', slug: 'photosvids' },
        { title: 'Chrome Passwords', count: counts.chromepass || 0, icon: <GoogleChromeLogo size={32} color="#F57C00" />, color: 'rgba(245, 124, 0, 0.15)', border: '#F57C00', slug: 'chromepass' },
        { title: 'Google Drive', count: counts.gdrive || 0, icon: <GoogleDriveLogo size={32} color="#1976D2" />, color: 'rgba(25, 118, 210, 0.15)', border: '#1976D2', slug: 'gdrive' },
        { title: 'Messages', count: counts.messages || 0, icon: <EnvelopeSimple size={32} color="#8E24AA" />, color: 'rgba(142, 36, 170, 0.15)', border: '#8E24AA', slug: 'messages' },
        { title: 'Password Vault', count: counts.passvault || 0, icon: <Key size={32} color="#00D9FF" />, color: 'rgba(0, 217, 255, 0.15)', border: '#00D9FF', slug: 'passvault' },
        { title: 'WhatsApp Backups', count: counts.whatsapp || 0, icon: <WhatsappLogo size={32} color="#25D366" />, color: 'rgba(37, 211, 102, 0.15)', border: '#25D366', slug: 'whatsapp' },
        { title: 'Beneficiaries', count: counts.beneficiaries || 0, icon: <Users size={32} color="#7C3AED" />, color: 'rgba(124, 58, 237, 0.15)', border: '#7C3AED', slug: 'beneficiaries' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="dashboard"
            style={{ paddingBottom: '4rem', minHeight: '100vh' }}
        >
            {/* Top Navigation */}
            <header className="glass" style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem 0'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            borderRadius: '50%',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            boxShadow: 'var(--glow-primary)',
                            textTransform: 'uppercase'
                        }}>
                            {user?.username?.charAt(0) || 'U'}
                        </div>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>Dashboard</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-icon"
                            style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer' }}
                        >
                            <Bell size={24} color="var(--color-text-main)" />
                            <span style={{
                                position: 'absolute', top: -2, right: -2, width: '10px', height: '10px',
                                background: '#EF4444', borderRadius: '50%', border: '2px solid var(--color-bg-main)',
                                boxShadow: '0 0 10px #EF4444'
                            }}></span>
                        </motion.button>
                        <button
                            onClick={logout}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            <SignOut size={20} /> Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '3rem' }}>
                {/* Welcome Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ marginBottom: '3rem' }}
                >
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                        Good evening, <span style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.username}</span>.
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                        Your digital legacy is <strong style={{ color: 'var(--color-primary)' }}>78% complete</strong>.
                        <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none', marginLeft: '0.5rem' }}>Finish setup &rarr;</a>
                    </p>
                </motion.section>

                {/* Quick Stats Grid */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            ref={el => cardsRef.current[index] = el}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => navigate(`/assets/${stat.slug}`)}
                            className="card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                cursor: 'pointer',
                                background: `linear-gradient(135deg, ${stat.color}, rgba(26, 35, 71, 0.8))`,
                                borderLeft: `3px solid ${stat.border}`
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                border: `1px solid ${stat.border}60`,
                                boxShadow: `0 0 20px ${stat.border}40`
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2rem', marginBottom: '0', lineHeight: 1, color: 'var(--color-text-main)' }}>{stat.count}</h3>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{stat.title}</span>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Main Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Recent Activity */}
                    <motion.section
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 0, color: 'var(--color-text-main)' }}>Recent Activity</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View All</button>
                        </div>

                        <div className="card" style={{ padding: '0' }}>
                            {[
                                { icon: <GoogleChromeLogo size={20} color="#F57C00" />, bg: 'rgba(245, 124, 0, 0.1)', title: 'Chrome Passwords Exported', time: 'Today • 47 passwords encrypted', status: true },
                                { icon: <Image size={20} color="#EC407A" />, bg: 'rgba(236, 64, 122, 0.1)', title: 'Uploaded 12 Family Photos', time: '2 days ago • Assigned to Sarah', status: false },
                                { icon: <Users size={20} color="#7C3AED" />, bg: 'rgba(124, 58, 237, 0.1)', title: 'Added David as Beneficiary', time: '1 week ago', status: false }
                            ].map((activity, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                                    style={{
                                        padding: '1.5rem',
                                        borderBottom: idx < 2 ? '1px solid var(--color-border)' : 'none',
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        opacity: idx === 2 ? 0.6 : 1
                                    }}
                                >
                                    <div style={{ background: activity.bg, padding: '0.5rem', borderRadius: '50%' }}>{activity.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{activity.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{activity.time}</div>
                                    </div>
                                    {activity.status && <CheckCircle size={20} color="#10B981" weight="fill" />}
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Quick Add & Status */}
                    <motion.section
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Quick Actions</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={() => navigate('/add-info')}
                            >
                                <Plus size={20} weight="bold" style={{ marginRight: '10px' }} />
                                Add Asset
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn btn-secondary"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={() => navigate('/trusted')}
                            >
                                <Users size={20} weight="bold" style={{ marginRight: '10px' }} />
                                Manage Beneficiaries
                            </motion.button>
                        </div>

                        {/* Check-in Status */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="card"
                            style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(26, 35, 71, 0.8) 100%)',
                                padding: '1.5rem',
                                borderLeft: '3px solid #10B981'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Clock size={24} color="#10B981" />
                                <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--color-text-main)' }}>Last Check-in</h3>
                            </div>
                            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: '#10B981' }}>Today</p>
                            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--color-text-muted)' }}>
                                Next check-in required in <strong style={{ color: '#10B981' }}>30 days</strong>
                            </p>
                        </motion.div>
                    </motion.section>
                </div>

            </main>
        </motion.div>
    );
};

export default Dashboard;
