import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getCart, removeFromCart, updateCartItemQuantity } from '../services/cartService';
import { createOrder } from '../services/orderService';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart', error);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      setCart(cart.filter((product) => product.productId !== productId));
    } catch (error) {
      console.error('Error removing product from cart', error);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCartItemQuantity(productId, quantity);
      setCart(cart.map((product) => 
        product.productId === productId ? { ...product, quantity: product.quantity + quantity } : product
      ));
    } catch (error) {
      console.error('Error updating product quantity', error);
    }
  };

  const handleCheckout = async () => {
    const productIds = cart.map(product => product.productId);
    const quantities = cart.map(product => product.quantity);
    try {
      await createOrder(productIds, quantities);
      alert('Order created successfully!');
      setCart([]); // Limpiar el carrito después del checkout
    } catch (error) {
      console.error('Error creating order', error);
      alert('Failed to create order');
    }
  };

  return (
    <Box className="cart-page" display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" component="div" gutterBottom>
        Cart
      </Typography>
      {cart.map((product) => (
        <Card key={product.productId} className="cart-item" sx={{ width: '80%', marginBottom: '16px' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {product.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: €{product.product.price * product.quantity}
            </Typography>
            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
              Quantity: 
              <IconButton onClick={() => handleUpdateQuantity(product.productId, -1)}>
                <RemoveIcon />
              </IconButton>
              {product.quantity}
              <IconButton onClick={() => handleUpdateQuantity(product.productId, 1)}>
                <AddIcon />
              </IconButton>
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => handleRemoveFromCart(product.productId)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Typography variant="h6" component="div" gutterBottom>
        Total: €{cart.reduce((total, product) => total + product.product.price * product.quantity, 0)}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ marginTop: '16px' }}>
        Checkout
      </Button>
    </Box>
  );
};

export default CartPage;
