import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tiers from './pages/Tiers';
import Apply from './pages/Apply';
import Auth from './pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/investments" element={<div className="min-h-screen bg-charcoal text-white flex items-center justify-center text-2xl">Investments (coming soon)</div>} />
        <Route path="/dashboard" element={<div className="min-h-screen bg-charcoal text-white flex items-center justify-center text-2xl">Dashboard (coming soon)</div>} />
        <Route path="/admin" element={<div className="min-h-screen bg-charcoal text-white flex items-center justify-center text-2xl">Admin Panel (coming soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
