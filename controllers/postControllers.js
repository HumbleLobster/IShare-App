const { ReplSet } = require('mongodb');
const { post } = require('../app');
const Post = require('../models/post');


exports.createPost = function(req,res){
    res.render('create-post');
}

exports.savePost = function(req,res){
    const post = new Post(req);
    post.save().then(()=>{
        res.send("success");
    }).catch(()=>{
        res.send("failed");
    });
}

exports.viewSinglePost = function(req,res){
    try{
        const post = Post.queryPost(req).then((result)=>{
            res.render('view-single-post' , {title : result.title , body : result.body , date : result.date , author : result.postedBy});
        }).catch((err)=>{
            res.send(err);
        });
    } catch {
        res.send("404");
    }
    
}