import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Tiers from './pages/Tiers';
import Apply from './pages/Apply';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import Blog from './pages/Blog';
import Press from './pages/Press';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tiers" element={<Tiers />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/press" element={<Press />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </BrowserRouter>
  );
}

export default App;
