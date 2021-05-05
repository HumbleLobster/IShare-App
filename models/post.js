const postCollections = require('../db').db().collection('posts');
const userCollections = require('../db').db().collection('users');
const objectId = require('mongodb').ObjectID;

const Post = function(data){
    this.data = {
        title : data.body.title,
        body : data.body.body,
        date : new Date(),
        author : objectId(data.session._id)
    },
    this.errors = []
}


Post.prototype.noHack = function(){
    if(typeof(this.data.title) != "string"){this.data.title = ""}
    if(typeof(this.data.body) != "string"){this.data.body = ""}
}

Post.prototype.validate = function(){
    if(this.data.title == ""){this.errors.push("Invalid title")}
    if(this.data.body == ""){this.errors.push("Invalid body Content")}
}

Post.prototype.save = function(){
    return promise = new Promise((resolve,reject)=> {
        this.noHack();
        this.validate();
        if(this.errors.length){
            reject(this.errors);
        } else {
            postCollections.insertOne(this.data).then(()=>{
                resolve();
            }).catch(()=>{
                reject("Invalid type");
            })
        }

    })
}

Post.queryPost = function(req){
    return promise = new Promise((resolve,reject)=>{
        postCollections.findOne({_id : objectId(req.params._id)}).then((result)=>{
            userCollections.findOne({_id : objectId(result.author)}).then((value)=>{
                const queryResult = {
                    postedBy : value.username,
                    title : result.title,
                    body : result.body,
                    date : result.date
                }
                resolve(queryResult);
            }).catch();
        }).catch((err)=>{
            reject(err);
        })
    })
}

module.exports = Post ; 