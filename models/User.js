const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const md5 = require('md5');
const avatars = require("give-me-an-avatar");

let userCollections = require('../db').db().collection('users');
let followCollections = require('../db').db().collection('follows');
const postCollections = require('../db').db().collection('posts');

const alert = require('alert');
const validator = require('validator');
const e = require('express');
const { ObjectId } = require('bson');

const User = function(data){
    this.data = data;

    this.errors = [];
    // this.details = function(){ }
}
User.prototype.noHack = function(){
    if(typeof(this.data.username) != "string"){this.data.username = ""}
    if(typeof(this.data.password) != "string"){this.data.password = ""}
    if(typeof(this.data.email) != "string"){this.data.email = ""}
}

User.prototype.validate = function(){
    return new Promise(async (resolve,reject) =>{
        if(this.data.password.length<8){this.errors.push("Not valid password ")}
        if(!validator.isEmail(this.data.email)){this.errors.push("Not valid email")}
        if(!validator.isAlphanumeric(this.data.username) ||  this.data.username.length == 0 || this.data.username.length >=30){this.errors.push("Not valid username")}
    
        if(validator.isAlphanumeric(this.data.username) && this.data.username.length >1 && this.data.username.length<31)
        {
            await User.username_Exist(this.data.username).then((result)=>{
                    this.errors.push("username already taken");
            }).catch((err)=>{

            })
        }
    
        if(validator.isEmail(this.data.email))
        {
            await User.email_Exist(this.data.email).then(()=>{
                this.errors.push("email is already taken");
            }).catch(()=>{

            })
        }
        resolve();
    })
}

User.prototype.register =function(){
    return new Promise( async (resolve,reject) => {
        // step #1 : validate the user input
        this.noHack();
        await this.validate();
    
        // step #2 : insert into the database
        if(!this.errors.length){
            this.data.password = bcrypt.hashSync(this.data.password, salt);
            this.getAvatar();
            userCollections.insertOne(this.data,(err,userCreated)=>{
                if(!err)
                {
                    result = {
                        username : userCreated.ops[0].username,
                        avatar : this.avatar,
                        _id : userCreated.ops[0]._id
                    }
                    resolve(result);
                }
                else reject("error");
            });
        }else{
            reject(this.errors);
        }
    })
}

User.prototype.login = function(){
    return new Promise((resolve,reject) => {
        this.noHack();
        userCollections.findOne({username : this.data.username}).then( (result)=>{
            if(result==null){
                reject("Invalid user");
            }else if(!bcrypt.compareSync(this.data.password, result.password)){
                    reject("Invalid password");
            }else {
                this.getAvatar();
                resolve({
                    username : result.username,
                    avatar : this.avatar,
                    _id : result._id
                });
            }
        }).catch((err) => {
            reject("Invalid request");
        })
    })
}

User.prototype.getAvatar = function(){
    this.avatar =  avatars.giveMeAnAvatar({
        Name: "John Smith",
        Size: 128
    });
}

User.username_Exist = function(name){
    return promise = new Promise(async (resolve, reject)=>{
        let usernameExists = await userCollections.findOne({username : name});
        if(usernameExists)
        {
            usernameExists = {
                id : usernameExists._id,
                username : usernameExists.username,
                avatar : avatars.giveMeAnAvatar({
                    Name : usernameExists.username,
                    Size : 128
                })
            }
            resolve(usernameExists);
            return;
        } else {
            reject("error");
            return;
        }
    })
}

User.email_Exist = function(name){
    return promise = new Promise(async (resolve, reject)=>{
        let emailExists = await userCollections.findOne({email : name});
        if(emailExists)
        {
            resolve(emailExists);
            return;
        } else {
            reject("error");
            return;
        }
    })
}

User.findFeeds = function(author_id){
    return new Promise (async ( resolve , reject) =>{
        let followedId = await followCollections.aggregate([
            {$match : {author_id : ObjectId(author_id)}},
        ]).toArray();

        followedId = followedId.map((user)=>{
            return user.followed_id;
        })

        let feeds = await postCollections.aggregate([
            {$match : {author : {$in : followedId}}},
            {$lookup : {from: 'users' , localField : "author" , foreignField : "_id" , as: "userDetail"}},
            {$project :
                {
                    title : 1,
                    body : 1,
                    date : 1,
                    username : { $arrayElemAt: [ "$userDetail.username", 0 ] }
                }
            },
            {$sort : {date : -1}}
        ]).toArray();
        feeds = feeds.map((feed)=>{
            feed = {
                _id : feed._id,
                title : feed.title , 
                body  : feed.body,
                username : feed.username,
                avatar : avatars.giveMeAnAvatar({
                    Name: feed.username,
                    Size: 128
                }),
                date : feed.date
            }
            return feed;
        })
        resolve(feeds);
    })
}

module.exports = User

