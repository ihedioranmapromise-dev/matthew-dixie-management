import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tiers from './pages/Tiers';
import Apply from './pages/Apply';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tiers" element={<Tiers />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/investments" element={<div className="min-h-screen bg-charcoal text-white flex items-center justify-center text-2xl pt-20">Investments (coming soon)</div>} />
        <Route path="/dashboard" element={<div className="min-h-screen bg-charcoal text-white flex items-center justify-center text-2xl pt-20">Dashboard (coming soon)</div>} />
        <Route path="/blog" element={<div className="min-h-screen bg-charcoal text-white flex items-center justify-center text-2xl pt-20">Blog (coming soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
