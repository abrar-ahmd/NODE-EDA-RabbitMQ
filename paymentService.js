const amqp = require('amqplib');

async function consumeOrderCreatedEvents() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare the queue to consume messages from
    const queue = 'orderQueue';
    await channel.assertQueue(queue, { durable: true });

    console.log('Waiting for OrderCreated events...');
    
    // Consume messages from the queue
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log('Payment Service received event:', event);

        // Process payment based on the event
        processPayment(event.payload.orderId, event.payload.totalAmount);

        // Acknowledge the message
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error consuming events:', error);
  }
}

function processPayment(orderId, amount) {
  console.log(`Processing payment for Order: ${orderId}, Amount: ${amount}`);
  // Payment processed, further events can be emitted here (e.g., PaymentProcessed)
}

// Start consuming events
consumeOrderCreatedEvents();
