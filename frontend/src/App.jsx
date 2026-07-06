import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tiers from './pages/Tiers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/investments" element={<div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-2xl">Investments (coming soon)</div>} />
        <Route path="/apply" element={<div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-2xl">Application Form (coming soon)</div>} />
        <Route path="/dashboard" element={<div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-2xl">Dashboard (coming soon)</div>} />
        <Route path="/admin" element={<div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-2xl">Admin Panel (coming soon)</div>} />
        <Route path="/login" element={<div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-2xl">Login (coming soon)</div>} />
        <Route path="/register" element={<div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-2xl">Register (coming soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
