import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trusted" element={<ProtectedRoute><TrustedPeople /></ProtectedRoute>} />
          <Route path="/add-info" element={<ProtectedRoute><AddInfo /></ProtectedRoute>} />
          <Route path="/assets/:category" element={<ProtectedRoute><AssetList /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
