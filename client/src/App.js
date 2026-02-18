/**
 * App.js — Main application component with all routes
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ChatBot from './components/chat/ChatBot';

// Public Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ComplaintsPage from './pages/customer/ComplaintsPage';
import ComplaintDetailPage from './pages/customer/ComplaintDetailPage';

// Wholesaler Pages
import WholesalerDashboard from './pages/wholesaler/WholesalerDashboard';
import WholesalerProducts from './pages/wholesaler/WholesalerProducts';
import ProductForm from './pages/wholesaler/ProductForm';
import WholesalerOrders from './pages/wholesaler/WholesalerOrders';
import WholesalerComplaints from './pages/wholesaler/WholesalerComplaints';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminCategories from './pages/admin/AdminCategories';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-steel-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow animate-fadeIn">
              <Routes>
                {/* ─── Public Routes ─── */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ─── Customer Routes ─── */}
                <Route path="/cart" element={
                  <ProtectedRoute roles={['customer']}>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute roles={['customer']}>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute roles={['customer']}>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute roles={['customer']}>
                    <OrderDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/complaints" element={
                  <ProtectedRoute roles={['customer']}>
                    <ComplaintsPage />
                  </ProtectedRoute>
                } />
                <Route path="/complaints/:id" element={
                  <ProtectedRoute roles={['customer']}>
                    <ComplaintDetailPage />
                  </ProtectedRoute>
                } />

                {/* ─── Wholesaler Routes ─── */}
                <Route path="/wholesaler" element={
                  <ProtectedRoute roles={['wholesaler']}>
                    <WholesalerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/wholesaler/products" element={
                  <ProtectedRoute roles={['wholesaler']}>
                    <WholesalerProducts />
                  </ProtectedRoute>
                } />
                <Route path="/wholesaler/products/new" element={
                  <ProtectedRoute roles={['wholesaler']}>
                    <ProductForm />
                  </ProtectedRoute>
                } />
                <Route path="/wholesaler/products/edit/:id" element={
                  <ProtectedRoute roles={['wholesaler']}>
                    <ProductForm />
                  </ProtectedRoute>
                } />
                <Route path="/wholesaler/orders" element={
                  <ProtectedRoute roles={['wholesaler']}>
                    <WholesalerOrders />
                  </ProtectedRoute>
                } />
                <Route path="/wholesaler/complaints" element={
                  <ProtectedRoute roles={['wholesaler']}>
                    <WholesalerComplaints />
                  </ProtectedRoute>
                } />

                {/* ─── Admin Routes ─── */}
                <Route path="/admin" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminOrders />
                  </ProtectedRoute>
                } />
                <Route path="/admin/complaints" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminComplaints />
                  </ProtectedRoute>
                } />
                <Route path="/admin/categories" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminCategories />
                  </ProtectedRoute>
                } />

                {/* ─── 404 ─── */}
                <Route path="*" element={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center animate-fadeIn">
                      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
                      <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">🔍 Page not found</p>
                      <a href="/" className="btn-primary">
                        🏠 Go Home
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
