const { ReplSet } = require('mongodb');
const { post } = require('../app');
const Post = require('../models/post');


exports.createPost = function(req,res){
    res.render('create-post');
}

exports.savePost = function(req,res){
    const post = new Post(req);
    post.save().then(()=>{
        req.flash("success" , "Post Saved Successfully");
        req.session.save((err)=>{
            res.redirect(`/profile/${req.session.username}`);
        })
    }).catch(()=>{
        res.render("404");
    });
}

exports.viewSinglePost =async function(req,res){
    try{
        const post =await Post.queryPost(req).then((result)=>{
            res.render('view-single-post' , {id: result._id, title : result.title , body : result.body , date : result.date , author : result.author.username , useravatar : result.author.avatar});
        })
    } catch {
        res.render("404");
    }
}

exports.viewEditPost = function(req,res){
    Post.queryPost(req).then((result)=>{
        if(result.author.username != req.session.username)
        {
            req.flash("errors" , "Unauthorized Action")
            req.session.save((err)=>{
                res.redirect("/profile/"+req.session.username)
            })
        }
        else{
            res.render("edit-post" , {_id : result._id , title : result.title , body : result.body});
        }   
    }).catch(()=>{
        res.render("404");
    });
}

exports.editPost = function(req,res){
    let post = new Post(req);
    post.update().then(()=>{
        req.flash("success" , "Post Edited Successfully");
        req.session.save((err)=>{
            res.redirect("/profile/"+req.session.username)
        })
    }).catch(()=>{
        res.render("404");
    })
}

exports.deletePost = function(req,res){
    let post = new Post(req);
    post.delete().then(()=>{
        req.flash("success" , "Post Deleted Successfully");
        req.session.save((err)=>{
            res.redirect("/profile/"+req.session.username)
        })
    }).catch(()=>{
        res.render("404");
    })
}