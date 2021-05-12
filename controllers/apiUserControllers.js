const User = require('../models/User');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

exports.apiLogin = function(req,res){
    let user = new User(req.body);
    user.login().then(function(result){
        let token = jwt.sign({_id: result._id}, process.env.SECRETJWT , {expiresIn: '1h'});
        res.json(token);
    }).catch(function(error){
        res.json("unauthorised");
    })
}

exports.apiMustBeLoggedIn = function(req,res,next){
    try{
        const _id = jwt.verify(req.body.token, process.env.SECRETJWT);
        req.session = {
            _id : _id._id
        }
        next();
    } catch {
        res.json("unauthorized");
    }
}

exports.apiCreate = function(req,res){
        const post = new Post(req);
        post.save().then(()=>{
            res.json("successfully created a post");
        }).catch(()=>{
            res.json("unknown error");
        })
}

exports.apiGetFeeds = function(req,res){
    User.findFeeds(req.session._id).then((feeds)=>{
        res.json(feeds);
    }).catch(()=>{
        res.json("no feed");
    })
}