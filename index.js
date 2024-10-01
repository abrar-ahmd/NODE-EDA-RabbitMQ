const express = require('express');
const { createOrder } = require('./orderService');
const app = express();

app.use(express.json());

// API endpoint to create a new order
app.post('/order', (req, res) => {
  const { orderId, items, totalAmount } = req.body;
  createOrder(orderId, items, totalAmount);
  res.send({ message: 'Order Created', orderId });
});

app.listen(3000, () => {
  console.log('Order service running on port 3000');
});

// Import payment service to start consuming messages from RabbitMQ
require('./paymentService');
