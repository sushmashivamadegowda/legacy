import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ShieldCheck, Image, Key, EnvelopeSimple, GoogleChromeLogo, GoogleDriveLogo, Timer } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        // Hero glow animation
        gsap.to(heroRef.current, {
            backgroundPosition: '200% center',
            duration: 8,
            repeat: -1,
            ease: 'none'
        });

        // Feature cards stagger animation
        gsap.fromTo(
            '.feature-card',
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: 'top 80%',
                }
            }
        );
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className="landing-page">
            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="navbar glass"
                style={{ padding: '1.5rem 0', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}
            >
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="logo" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', textShadow: 'var(--glow-primary)' }}>
                        LegacyKey
                    </div>
                    <div>
                        <button className="btn btn-secondary" style={{ marginRight: '1rem' }}>Log In</button>
                        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Get Started</button>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <header
                ref={heroRef}
                className="hero section"
                style={{
                    textAlign: 'center',
                    padding: '8rem 1rem 6rem',
                    background: 'radial-gradient(circle at 50% 0%, rgba(0, 217, 255, 0.1), transparent 50%)',
                    backgroundSize: '200% 200%'
                }}
            >
                <motion.div
                    className="container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="badge glow-effect" style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(124, 58, 237, 0.2))',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        color: 'var(--color-primary)',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '50px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        ✨ Your Digital Legacy, Encrypted & Protected
                    </motion.div>

                    <motion.h1 variants={itemVariants} style={{ fontSize: '4rem', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, #E8EAED 0%, var(--color-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Your digital life, backed up and encrypted <br />
                        <span style={{ background: 'linear-gradient(135deg, var(--color-text-muted) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>delivered only when you're gone.</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '750px', margin: '0 auto 3rem' }}>
                        Store memories, export Chrome passwords, backup Google Drive/Photos, and write final messages. Everything encrypted and delivered to loved ones after your passing is confirmed.
                    </motion.p>

                    <motion.div variants={itemVariants} className="cta-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={() => navigate('/dashboard')}>
                            Start Your Legacy <ArrowRight size={20} weight="bold" style={{ marginLeft: '8px' }} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            How It Works
                        </button>
                    </motion.div>
                </motion.div>
            </header>

            {/* Features */}
            <section ref={featuresRef} className="features container" style={{ padding: '4rem 1rem 3rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Everything You Need to Preserve</h2>
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    Manual uploads and automated exports — all encrypted and delivered after verification.
                </p>

                <div className="grid-cols-2" style={{ gap: '2rem' }}>
                    {[
                        { icon: <Image size={32} weight="duotone" />, title: 'Photos & Videos', desc: 'Upload your cherished memories, family photos, and personal videos to share with loved ones.', color: '#EC407A', bg: 'rgba(236, 64, 122, 0.1)' },
                        { icon: <GoogleChromeLogo size={32} weight="duotone" />, title: 'Chrome Password Export', desc: 'Automatically export and encrypt all your saved Chrome passwords and site credentials.', color: '#F57C00', bg: 'rgba(245, 124, 0, 0.1)' },
                        { icon: <GoogleDriveLogo size={32} weight="duotone" />, title: 'Google Drive & Photos', desc: 'Export important documents and photo albums from your Google account with one click.', color: '#1976D2', bg: 'rgba(25, 118, 210, 0.1)' },
                        { icon: <EnvelopeSimple size={32} weight="duotone" />, title: 'Personal Messages', desc: 'Write heartfelt letters to family and friends. They will receive your words when they need them most.', color: '#8E24AA', bg: 'rgba(142, 36, 170, 0.1)' },
                        { icon: <Key size={32} weight="duotone" />, title: 'Password Vault', desc: 'Manually store important account credentials that are not saved in Chrome.', color: '#00D9FF', bg: 'rgba(0, 217, 255, 0.1)' },
                        { icon: <Timer size={32} weight="duotone" />, title: 'Time-Delayed Delivery', desc: 'Set inactivity triggers (1-2 years offline) to automatically send encrypted data to recovery emails.', color: '#F9A825', bg: 'rgba(249, 168, 37, 0.1)' }
                    ].map((feature, index) => (
                        <div key={index} className="card feature-card" style={{ textAlign: 'left', padding: '2.5rem', cursor: 'default' }}>
                            <div className="icon-box" style={{ width: '60px', height: '60px', background: feature.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: feature.color, border: `1px solid ${feature.color}40` }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Security */}
            <section className="container" style={{ padding: '4rem 1rem 6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card"
                        style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(26, 35, 71, 0.8) 100%)' }}
                    >
                        <ShieldCheck size={40} color="#10B981" style={{ marginBottom: '1rem' }} weight="duotone" />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Military-Grade Encryption</h3>
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>All data encrypted with AES-256. Only you and your designated recipients can access it.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card"
                        style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(245, 124, 0, 0.1) 0%, rgba(26, 35, 71, 0.8) 100%)' }}
                    >
                        <ShieldCheck size={40} color="#F57C00" style={{ marginBottom: '1rem' }} weight="duotone" />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Death Verification</h3>
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Assets released only after multi-step confirmation. No accidental or premature delivery.</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--color-border)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>&copy; 2025 LegacyKey. Preserving what matters most.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>Traditional will & banking beneficiaries are handled by your bank and government.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
