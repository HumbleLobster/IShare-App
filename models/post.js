const postCollections = require('../db').db().collection('posts');
const userCollections = require('../db').db().collection('users');
const objectId = require('mongodb').ObjectID;
const avatars = require("give-me-an-avatar");

const Post = function(data){
    this.clone = data;
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
                id : 1,
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

Post.prototype.update = function(){
    return promise = new Promise(async (resolve , reject)=> {
        //verify the post exist
        let results =await postCollections.aggregate([
            {$match : {_id :objectId(this.clone.params._id)}}]).toArray();
        if(results.length == 0)
        {
            reject("not found");
            return;
        }
        //verify if the user is the original poster
        if(!results[0].author.equals(this.data.author)){
            reject("not authorised");
            return;
        }
        
        await postCollections.updateOne({_id :objectId(this.clone.params._id)}, { $set: {title: this.data.title, body: this.data.body} }, function(err, res) {
            if (!err)
            {
               resolve("success");
               return;
            }
            else{
                reject("error");
                return;
            }
        })
    })
}

Post.prototype.delete = function(){
    return promise = new Promise(async (resolve , reject)=> {
        //verify the post exist
        let results =await postCollections.aggregate([
            {$match : {_id :objectId(this.clone.params._id)}}]).toArray();
        if(results.length == 0)
        {
            reject("not found");
            return;
        }
        //verify if the user is the original poster
        if(!results[0].author.equals(this.data.author)){
            reject("not authorised");
            return;
        }
        
        await postCollections.deleteOne({_id :objectId(this.clone.params._id)}, function(err, res) {
            if (!err)
            {
               resolve("success");
               return;
            }
            else{
                reject("error");
                return;
            }
        })
    })
}

module.exports = Post ; 