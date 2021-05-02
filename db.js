var MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(!err)
    {
        module.exports = client;
        const app = require('./app');
        
        app.listen(process.env.PORT , ()=>{
            console.log("server is running");
        });
    }else{
        console.log(err);
    }
});

