let followCollections = require('../db').db().collection('follows');
const objectId = require('mongodb').ObjectID;
const avatars = require("give-me-an-avatar");

const Follow = function(data){
    this.data = data;
}

Follow.prototype.addUser = function(){
    return new Promise((resolve,reject)=>{
        const obj = {
            author_id : objectId(this.data.session._id),
            followed_id :objectId(this.data.profileUser.id)
        }
        followCollections.insertOne(obj , (err)=>{
            if(!err)
                resolve();
            else reject();
        });
    })
}

Follow.prototype.removeUser = function(){
    return new Promise((resolve , reject)=>{
        const obj = {
            author_id : objectId(this.data.session._id),
            followed_id :objectId(this.data.profileUser.id)
        }
        followCollections.deleteOne(obj , (err)=>{
            if(!err)
                resolve();
            else
                reject();
        })
    })
}

Follow.is_following = function(author_id,followed_id){
    return new Promise(async (resolve,reject)=>{
        let follows =await followCollections.aggregate([
            {$match : {author_id : objectId(author_id) , followed_id :objectId(followed_id)} }
        ]).toArray();
        if(follows.length){
            resolve("true");
        }
        else reject("false");
    })
}

Follow.followers = function(followed_id){
    return new Promise(async (resolve , reject)=>{
        let result =await followCollections.aggregate([
            {$match : {followed_id : objectId(followed_id)} },
            {$lookup : {from : "users",localField: "author_id" , foreignField: "_id" , as : "details" }},
            {$sort : {"details.username" : 1}}
        ]).toArray();
        let followers = [];

        result.map((current)=>{
            current = {
                username : current.details[0].username,
                userId : current.author_id,
                avatar : avatars.giveMeAnAvatar({
                    Name: current.details[0].username,
                    Size: 128
                })
            }
            followers.push(current);
        });

        if(followers.length){
            resolve(followers);
        }
        else reject("");
    })
}

Follow.following = function(author_id){
    return new Promise(async(resolve,reject)=>{
        let result =await followCollections.aggregate([
            {$match : {author_id : objectId(author_id)} },
            {$lookup : {from : "users",localField: "followed_id" , foreignField: "_id" , as : "details" }},
            {$sort : {"details.username" : 1}}
        ]).toArray();
        let following = [];

        result.map((current)=>{
            current = {
                username : current.details[0].username,
                userId : current.followed_id,
                avatar : avatars.giveMeAnAvatar({
                    Name: current.details[0].username,
                    Size: 128
                })
            }
            following.push(current);
        });
        if(following.length){
            resolve(following);
        }
        else reject();
    })
}

module.exports = Follow;