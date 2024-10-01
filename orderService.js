const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Simulate an order creation and emit the event
function createOrder(orderId, items, totalAmount) {
  console.log(`Order Created: ${orderId}`);
  const event = {
    type: 'OrderCreated',
    orderId: orderId,
    items: items,
    totalAmount: totalAmount
  };
  // Emit the event
  eventEmitter.emit('OrderCreated', event);
}

// Expose the createOrder function and event emitter
module.exports = { createOrder, eventEmitter };
