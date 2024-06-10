import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService'; // Importa el servicio del carrito
import '../styles/ProductDetailPage.css'; // Importa los estilos CSS
import { Button, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from '../components/Navbar'; // Importa el component Navbar

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para la navegación
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity); // Añade al carrito utilizando el servicio
      alert('Product added to cart!');
      navigate('/cart'); // Redirigir al carrito
    } catch (error) {
      console.error('Error adding product to cart', error);
      alert('Failed to add product to cart');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="product-detail-container">
        
        <h1>{product.name}</h1>
        <img src={`/images/${product.image}`} alt={product.name} /> {/* Ajustar la ruta de la imagen */}
        <p>{product.description}</p>
        <p>Price: €{product.price}</p>
        <p className={product.stock > 0 ? 'stock-available' : 'stock-unavailable'}>
          {product.stock > 0 ? 'Stock available' : 'Stock unavailable'}
        </p>
        {product.stock > 0 && (
          <Box display="flex" alignItems="center" mt={2}>
            <IconButton onClick={() => setQuantity(Math.max(quantity - 1, 1))}>
              <RemoveIcon />
            </IconButton>
            <span>{quantity}</span>
            <IconButton onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}>
              <AddIcon />
            </IconButton>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
