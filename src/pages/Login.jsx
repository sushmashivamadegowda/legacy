import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, Eye, EyeSlash } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLogin && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading(isLogin ? 'Signing in...' : 'Creating account...');

        try {
            if (isLogin) {
                const success = await login(email, password);
                if (success) {
                    toast.success('Welcome back!', { id: toastId });
                } else {
                    toast.error('Invalid email or password', { id: toastId });
                    setIsLoading(false);
                }
            } else {
                const result = await register(email, password, username);
                if (result.success) {
                    if (result.session) {
                        toast.success('Account created!', { id: toastId });
                    } else {
                        toast.success('Registration successful! Please check your email.', {
                            id: toastId,
                            duration: 6000
                        });
                        setIsLogin(true); // Switch to login after signup
                        setConfirmPassword('');
                        setPassword('');
                        setIsLoading(false);
                    }
                } else {
                    toast.error(result.error || 'Registration failed. Try again.', { id: toastId });
                    setIsLoading(false);
                }
            }
        } catch (error) {
            toast.error('Connection error. Please try again.', { id: toastId });
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-main)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={isLogin ? 'login' : 'signup'}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2.5rem',
                    borderTop: `4px solid ${isLogin ? 'var(--color-primary)' : 'var(--color-accent)'}`
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        {isLogin ? 'Access your digital vault' : 'Create your secure vault today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-main)', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '1rem 3rem 1rem 3rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-main)', outline: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <>
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-main)', outline: 'none' }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{ width: '100%', padding: '1rem 3rem 1rem 3rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-main)', outline: 'none' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: isLogin ? 'var(--color-primary)' : 'var(--color-accent)',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading
                            ? (isLogin ? 'Signing in...' : 'Creating account...')
                            : <>{isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} weight="bold" /></>
                        }
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setConfirmPassword('');
                        }}
                        style={{ background: 'none', border: 'none', color: isLogin ? 'var(--color-primary)' : 'var(--color-accent)', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        {isLogin ? "New here? Create an account" : "Already have an account? Sign In"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
