/**
 * Navbar — responsive navigation bar with role-based links
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { GiAutoRepair } from 'react-icons/gi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'wholesaler': return '/wholesaler/dashboard';
      default: return '/customer/orders';
    }
  };

  return (
    <nav className="bg-primary-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <GiAutoRepair className="text-accent-300 text-2xl" />
            <span>SparePartsHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="hover:text-accent-200 transition-colors">
              Products
            </Link>
            {user && (
              <Link to={getDashboardLink()} className="hover:text-accent-200 transition-colors">
                Dashboard
              </Link>
            )}
            {user?.role === 'customer' && (
              <Link to="/cart" className="relative hover:text-accent-200 transition-colors">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-400 text-steel-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
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
                <Link to="/register" className="bg-accent-400 text-steel-900 px-4 py-1.5 rounded-lg font-semibold hover:bg-accent-300 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/products" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>Products</Link>
            {user && (
              <Link to={getDashboardLink()} className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            )}
            {user?.role === 'customer' && (
              <Link to="/cart" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>
                Cart ({cartCount})
              </Link>
            )}
            {user ? (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 hover:text-accent-200">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 hover:text-accent-200" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
