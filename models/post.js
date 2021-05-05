const postCollections = require('../db').db().collection('posts');
const userCollections = require('../db').db().collection('users');
const objectId = require('mongodb').ObjectID;
const avatars = require("give-me-an-avatar");

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
    return promise = new Promise(async (resolve,reject)=>{
        if(!objectId.isValid(req.params._id))
        {
            reject("404 not found");
            return ;
        }
        let results =await postCollections.aggregate([
            {$match : {_id :objectId(req.params._id)}},
            {$lookup : {from : "users" , localField :"author" ,foreignField : "_id", as : "details" }},
            {$project : {
                title : 1,
                body : 1,
                date : 1,
                author : {$arrayElemAt : ["$details", 0]},
            }}
        ]).toArray();

        

        if(results.length){
            results = results.map(function(result){
                result.author = {
                    username : result.author.username,
                    avatar : avatars.giveMeAnAvatar({
                        Name: "John Smith",
                        Size: 128
                    })
                }

                resolve(result);
            })
        } else {
            reject("Not found");
        }
        
    })
}

Post.findPostByAuthorId = function(author_id){
    id = objectId(author_id);
    return promise = new Promise(async (resolve,reject)=>{
        let posts = await postCollections.aggregate([
            {$match : {author : id}}
        ]).toArray();
        resolve(posts);
    })
}

module.exports = Post ; 