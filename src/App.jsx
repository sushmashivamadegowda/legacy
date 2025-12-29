import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TrustedPeople from './pages/TrustedPeople';
import AddInfo from './pages/AddInfo';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trusted" element={<TrustedPeople />} />
        <Route path="/add-info" element={<AddInfo />} />
      </Routes>
    </div>
  )
}

export default App
