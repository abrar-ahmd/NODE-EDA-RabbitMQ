const amqp = require('amqplib');

async function publishOrderCreatedEvent(order) {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declare the queue to send the message to
    const queue = 'orderQueue';
    await channel.assertQueue(queue, { durable: true });

    // Send the order event as a message to the queue
    const event = {
      type: 'OrderCreated',
      timestamp: Date.now(),
      payload: order
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), { persistent: true });
    console.log('OrderCreated event sent:', event);

    // Close the channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing event:', error);
  }
}

// Create Order function that calls the publisher
function createOrder(orderId, items, totalAmount) {
  console.log(`Order Created: ${orderId}`);
  const order = { orderId, items, totalAmount };
  publishOrderCreatedEvent(order);
}

module.exports = { createOrder };
