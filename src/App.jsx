import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; // Importa CartPage
import withAuth from './components/withAuth';

const AuthProduct = withAuth(ProductListPage);
const AuthCart = withAuth(CartPage); // Importa AuthCart
const AuthProductDetail = withAuth(ProductDetailPage);


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<AuthProduct />} />
        <Route path="/product/:id" element={<AuthProductDetail />} />
        <Route path="/cart" element={<AuthCart />} /> {/* Añade esta ruta */}
      </Routes>
    </Router>
  );
}

export default App;
