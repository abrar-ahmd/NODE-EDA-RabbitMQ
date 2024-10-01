const { eventEmitter } = require('./orderService');

// Listen for OrderCreated events
eventEmitter.on('OrderCreated', (event) => {
  console.log(`Payment Service Received OrderCreated Event for Order: ${event.orderId}`);
  // Simulate payment processing
  processPayment(event.orderId, event.totalAmount);
});

function processPayment(orderId, amount) {
  console.log(`Processing Payment for Order: ${orderId}, Amount: ${amount}`);
  // After processing, emit a PaymentProcessed event (next step)
  // eventEmitter.emit('PaymentProcessed', { orderId });
}
