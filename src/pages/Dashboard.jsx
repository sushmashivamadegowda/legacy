import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    const [counts, setCounts] = useState({});
    const [checkIn, setCheckIn] = useState({});
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/user/dashboard-data', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCounts(data.stats);
                setCheckIn(data.check_in);
                setRecentActivity(data.recent_activity);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
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

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 }
        }
    };

    const SkeletonCard = () => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', height: '110px' }}>
            <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '16px', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '40px', height: '2rem', marginBottom: '0.4rem', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '120px', height: '0.9rem', borderRadius: '4px' }}></div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
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
                    variants={itemVariants}
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
                <motion.section
                    variants={containerVariants}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}
                >
                    {isLoading ? (
                        [...Array(stats.length)].map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => navigate(`/assets/${stat.slug}`)}
                                className="card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    cursor: 'pointer',
                                    background: `linear-gradient(135deg, ${stat.color}, rgba(26, 35, 71, 0.8))`,
                                    borderLeft: `3px solid ${stat.border}`,
                                    height: '110px'
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
                                <div style={{ overflow: 'hidden' }}>
                                    <h3 style={{ fontSize: '2rem', marginBottom: '0', lineHeight: 1, color: 'var(--color-text-main)' }}>{stat.count}</h3>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{stat.title}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.section>

                {/* Main Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Recent Activity */}
                    <motion.section
                        variants={itemVariants}
                        style={{ minWidth: '400px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 0, color: 'var(--color-text-main)' }}>Recent Assets</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => navigate('/assets/all')}>View All</button>
                        </div>

                        <div className="card" style={{ padding: '0' }}>
                            {recentActivity.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No recent activity</div>
                            ) : (
                                recentActivity.map((asset, idx) => (
                                    <motion.div
                                        key={asset.id}
                                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                                        style={{
                                            padding: '1.2rem 1.5rem',
                                            borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--color-border)' : 'none',
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '0.5rem',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Image size={20} color="var(--color-primary)" />
                                        </div>
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.title || asset.file_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{asset.category}</div>
                                        </div>
                                        <CheckCircle size={18} color="#10B981" weight="fill" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.section>

                    {/* Quick Add & Status */}
                    <motion.section variants={itemVariants}>
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
                                background: checkIn.is_emergency
                                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(26, 35, 71, 0.8) 100%)'
                                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(26, 35, 71, 0.8) 100%)',
                                padding: '1.5rem',
                                borderLeft: checkIn.is_emergency ? '3px solid #EF4444' : '3px solid #10B981',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Clock size={24} color={checkIn.is_emergency ? "#EF4444" : "#10B981"} />
                                <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--color-text-main)' }}>
                                    {checkIn.is_emergency ? "Emergency Mode Active" : "Check-in Status"}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: checkIn.is_emergency ? '#EF4444' : '#10B981' }}>
                                        {checkIn.days_remaining} {checkIn.days_remaining === 1 ? 'Day' : 'Days'}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--color-text-muted)' }}>
                                        until next check-in
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={async () => {
                                        try {
                                            const response = await fetch('http://127.0.0.1:8000/user/check-in', {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            if (response.ok) {
                                                // toast.success('Successfully checked in!');
                                                fetchDashboardData();
                                            }
                                        } catch (error) {
                                            // toast.error('Check-in failed');
                                        }
                                    }}
                                    className="btn btn-secondary"
                                    style={{
                                        padding: '0.5rem 0.8rem',
                                        fontSize: '0.8rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(255,255,255,0.1)'
                                    }}
                                >
                                    Check In Now
                                </motion.button>
                            </div>

                            {checkIn.is_emergency && (
                                <div style={{
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid rgba(239, 68, 68, 0.2)',
                                    fontSize: '0.8rem',
                                    color: '#EF4444'
                                }}>
                                    ⚠️ Beneficiaries have been granted access.
                                </div>
                            )}
                        </motion.div>
                    </motion.section>
                </div>

            </main>
        </motion.div>
    );
};

export default Dashboard;
