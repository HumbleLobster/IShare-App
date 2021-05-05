var MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(err => {
    if(!err)
    {
        module.exports = client;
        // client.db().collection('sessions').drop(function(err,resp){
        //     if(!err)
        //         console.log("success");
        //     else console.log(err);
        // });
        const app = require('./app');
        
        app.listen(process.env.PORT , ()=>{
            console.log("server is running");
        });
    }else{
        console.log(err);
    }
});


