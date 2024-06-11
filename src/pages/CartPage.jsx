import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getCart, removeFromCart, updateCartItemQuantity } from '../services/cartService';
import { getProductById } from '../services/productService'; // Make sure to adjust the import path accordingly
import axios from 'axios';

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

  const handleUpdateQuantity = async (productId, quantityChange) => {
    try {
      const updatedProduct = cart.find(product => product.productId === productId);
      if (updatedProduct.quantity + quantityChange < 1) {
        return; // Prevent updating quantity to less than 1
      }
      await updateCartItemQuantity(productId, quantityChange);
      setCart(cart.map((product) => 
        product.productId === productId ? { ...product, quantity: product.quantity + quantityChange } : product
      ));
    } catch (error) {
      console.error('Error updating product quantity', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const productDetailsPromises = cart.map(product => getProductById(product.productId));
      const productDetailsResponses = await Promise.all(productDetailsPromises);
      const productDetails = productDetailsResponses.map(response => response.data);
  
      const lineItems = productDetails.map(product => ({
        price: product.stripePriceId,
        quantity: cart.find(item => item.productId === product.id).quantity
      }));
  
      console.log("Line Items:", lineItems); // Debug log for line items
  
      // Create Stripe checkout session
      const response = await axios.post('http://localhost:3000/api/stripe/create-checkout-session', 
        { line_items: lineItems }, 
        { withCredentials: true }
      );
  
      console.log("Response Status:", response.status); // Debug log for response status
      console.log("Response Data:", response.data); // Debug log for response data
  
      if (response.data && response.data.url) {
        window.open(response.data.url, '_self'); // Opens the URL in a new tab
      } else {
        console.error('No URL returned in the response', response.data);
        alert('Failed to create checkout session: No URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error.response ? error.response.data : error.message);
      alert('Failed to create checkout session: ' + (error.response ? error.response.data.message : error.message));
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
