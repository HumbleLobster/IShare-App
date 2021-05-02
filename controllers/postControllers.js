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
    res.render('view-single-post');
}