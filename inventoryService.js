const amqp = require('amqplib');

async function consumeOrderCreatedEvents() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a topic exchange and bind a queue to it
    const exchange = 'order_exchange';
    const queue = 'inventory_queue';
    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertQueue(queue, { durable: true });

    // Bind the queue to the exchange with the routing key
    const routingKey = 'order.created';
    await channel.bindQueue(queue, exchange, routingKey);

    console.log('Inventory Service waiting for OrderCreated events...');
    
    // Consume messages from the queue
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log('Inventory Service received event:', event);

        reserveStock(event.payload.orderId, event.payload.items);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error consuming events:', error);
  }
}

function reserveStock(orderId, items) {
  console.log(`Reserving stock for Order: ${orderId}, Items: ${items}`);
}

// Start consuming events
consumeOrderCreatedEvents();
