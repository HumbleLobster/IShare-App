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

exports.viewSinglePost =async function(req,res){
    try{
        const post =await Post.queryPost(req).then((result)=>{
            // console.log(result);
            res.render('view-single-post' , {id: result._id, title : result.title , body : result.body , date : result.date , author : result.author.username , useravatar : result.author.avatar});
        })
    } catch {
        res.render("404");
    }
}

exports.viewEditPost = function(req,res){
    Post.queryPost(req).then((result)=>{
        res.render("edit-post" , {_id : result._id , title : result.title , body : result.body});
    }).catch(()=>{
        res.render("404");
    });
}

exports.editPost = function(req,res){
    let post = new Post(req);
    post.update().then(()=>{
        res.redirect("/profile/"+req.session.username)
    }).catch(()=>{
        res.render("404");
    })
}