var MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(err => {
    if(!err)
    {
        module.exports = client;
        
        const app = require('./app');

        let port = process.env.PORT;
        if (port == null || port == "") {
        port = 3000;
        }
        app.listen(port);
    }else{
        console.log(err);
    }
});




// client.db().collection('sessions').drop(function(err,resp){
        //     if(!err)
        //         console.log("success");
        //     else console.log(err);
        // });