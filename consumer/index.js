import express from 'express'
const app = express()
const mongoose = require('mongoose')

const startUp = () => {

    try {
        const mongoose = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const amqplib = require('amqplib');

        (async () => {
            const queue = 'tasks';
            const conn = await amqplib.connect(process.env.RABBIT_URI);

            const ch1 = await conn.createChannel();
            await ch1.assertQueue(queue);

            // Listener
            ch1.consume(queue, (msg) => {
                if (msg !== null) {
                    console.log('Received:', msg.content.toString());
                    ch1.ack(msg);
                } else {
                    console.log('Consumer cancelled by server');
                }
            });
        })();
    }

    catch (err) {
        console.warn(err);
    }

}

setTimeout(startUp, 40000);

app.get("/", (req, res) => {
    res.json({
        message: 'Hello from Consumer... '
    });
});

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Consumer Running at PORT: `);

})


//   // Sender
//   const ch2 = await conn.createChannel();

//   setInterval(() => {
//       ch2.sendToQueue(queue, Buffer.from('something to do'));
//   }, 1000);