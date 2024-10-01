const amqp = require('amqplib');

async function publishOrderCreatedEvent(order) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a topic exchange
    const exchange = 'order_exchange';
    await channel.assertExchange(exchange, 'topic', { durable: true });

    // Publish the message to the exchange with a routing key
    const event = {
      type: 'OrderCreated',
      timestamp: Date.now(),
      payload: order
    };
    const routingKey = 'order.created';
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)), { persistent: true });
    console.log('OrderCreated event sent to exchange:', event);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing event:', error);
  }
}

function createOrder(orderId, items, totalAmount) {
  console.log(`Order Created: ${orderId}`);
  const order = { orderId, items, totalAmount };
  publishOrderCreatedEvent(order);
}

module.exports = { createOrder };
