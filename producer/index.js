import express from 'express'
const app = express()
const sequelize = require('sequelize')

const startUp = () => {

    try {
        const sequelize = new Sequelize(process.env.PG_URI);
        sequelize.authenticate().then(conn => {
            console.log("Consumer Connected to Postgres!")
        })
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
const sendToQueue = async (msg, res) => {
    try {
        const ch2 = await conn.createChannel();

        setInterval(() => {
            ch2.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        }, 1000);
    } catch (error) {
        console.log(error)
    }
}
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