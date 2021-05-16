var MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(err => {
        module.exports = client;
        
        const app = require('./app');

        let port = process.env.PORT;
        app.listen(port);
});
