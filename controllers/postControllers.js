const Post = require('../models/post');
const { post } = require('../router');

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