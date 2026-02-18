/**
 * Navbar — responsive navigation bar with role-based links + theme toggle
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { GiAutoRepair } from 'react-icons/gi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'wholesaler': return '/wholesaler';
      default: return '/orders';
    }
  };

  return (
    <nav className={`bg-primary-500 dark:bg-gray-800 text-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:scale-105 transition-transform">
            <GiAutoRepair className="text-accent-300 text-2xl" />
            <span>🔧 SparePartsHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="hover:text-accent-200 transition-colors flex items-center gap-1">
              ⚙️ Products
            </Link>
            {user && (
              <Link to={getDashboardLink()} className="hover:text-accent-200 transition-colors">
                📊 Dashboard
              </Link>
            )}
            {user?.role === 'customer' && (
              <Link to="/cart" className="relative hover:text-accent-200 transition-colors">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-400 text-steel-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-subtle">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-primary-600 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FiSun className="text-accent-300 text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardLink()} className="flex items-center gap-1 hover:text-accent-200">
                  <FiUser />
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="hover:text-accent-200 transition-colors" title="Logout">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:text-accent-200 transition-colors">Login</Link>
                <Link to="/register" className="bg-accent-400 text-steel-900 px-4 py-1.5 rounded-lg font-semibold hover:bg-accent-300 transition-all hover:scale-105">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-primary-600 dark:hover:bg-gray-700 transition">
              {darkMode ? <FiSun className="text-accent-300" /> : <FiMoon />}
            </button>
            <button className="text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slideDown">
            <Link to="/products" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>⚙️ Products</Link>
            {user && (
              <Link to={getDashboardLink()} className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>📊 Dashboard</Link>
            )}
            {user?.role === 'customer' && (
              <Link to="/cart" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>
                🛒 Cart ({cartCount})
              </Link>
            )}
            {user ? (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 hover:text-accent-200">🚪 Logout</button>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>🔑 Login</Link>
                <Link to="/register" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>📝 Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
