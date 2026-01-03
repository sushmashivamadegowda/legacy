import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TrustedPeople from './pages/TrustedPeople';
import AddInfo from './pages/AddInfo';
import AssetList from './pages/AssetList';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-main)' }}>
        <div style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>LegacyKey</div>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return children;
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="app-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
            <Route path="/trusted" element={<ProtectedRoute><PageTransition><TrustedPeople /></PageTransition></ProtectedRoute>} />
            <Route path="/add-info" element={<ProtectedRoute><PageTransition><AddInfo /></PageTransition></ProtectedRoute>} />
            <Route path="/assets/:category" element={<ProtectedRoute><PageTransition><AssetList /></PageTransition></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </div>
    </AuthProvider>
  )
}

export default App
