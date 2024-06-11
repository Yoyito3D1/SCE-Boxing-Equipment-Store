import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import '../styles/OrderHistoryPage.css'; // Asegúrate de tener el archivo CSS para estilos

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/shopping-cart/history', {
          withCredentials: true, // Aquí estamos configurando axios para enviar las cookies
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching order history: {error.message}</div>;
  }

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h2>Order ID: {order.id}</h2>
            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <h3>Products:</h3>
            <div className="products-list">
              {order.products.map((product) => (
                <Card key={product.productId} className="product-card">
                  <div className="image-container">
                    <CardMedia
                      component="img"
                      image={`/images/${product.imageUrl}`} // Construir la ruta completa de la imagen
                      alt={product.productName}
                    />
                  </div>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {product.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: €{product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal: €{(product.price * product.quantity).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
            <h3>Total: €{order.total.toFixed(2)}</h3>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;
