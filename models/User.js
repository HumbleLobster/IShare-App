const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const md5 = require('md5');
const avatars = require("give-me-an-avatar");

let userCollections = require('../db').db().collection('users');

const alert = require('alert');
const validator = require('validator');

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
            const usernameExists = await userCollections.findOne({username : this.data.username});
            if(usernameExists)
            {
                this.errors.push("UserName already taken");
            }
        }
    
        if(validator.isEmail(this.data.email))
        {
            const emailExists = await userCollections.findOne({email : this.data.email});
            if(emailExists)
            {
                this.errors.push("email already taken");
            }
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
            userCollections.insertOne(this.data,function(){
                resolve();
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

module.exports = User