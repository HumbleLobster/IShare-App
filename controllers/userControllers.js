const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/follow');


exports.mustBeLoggedIn = function(req,res,next){
    if(req.session.username){
        return next();
    } else {
        req.flash('errors' , "You need to be Logged in");
        req.session.save((err)=>{
            res.redirect('/');
        })
    }
}

exports.login = function(req,res){
    let user = new User(req.body);
    user.login().then(function(result){
        req.session.username = result.username;
        req.session.avatar = result.avatar;
        req.session._id = result._id;
        req.session.save((err)=>{
            res.redirect('/');
        })
    }).catch(function(error){
        req.flash('errors' , error);
        req.session.save(function(){
            res.redirect('/');
        })
    })
}

exports.logout = function(req,res){
    req.session.destroy(err=>{
        res.redirect('/');
    });
}

exports.register = function(req,res){
    let user = new User(req.body);
    user.register().then(function(result){
        {
            req.session.username = result.username;
            req.session.avatar = result.avatar;
            req.session._id = result._id;
            req.session.save((err)=>{
                res.redirect('/');
            })
        }
    }).catch(function(error){
        req.flash("errors" , error);
        req.session.save(function(err){
            res.redirect("/");
        })
    });
}

exports.home = async function(req,res){
    if(req.session.username)
    {
        await User.findFeeds(req.session._id).then((feeds)=>{
            res.render('home-loggedin-no-result' , {feeds : feeds});
        }).catch(()=>{
            res.render('home-loggedin-no-result');
        })
    }else{
        res.render('home-guest');
    }
}

exports.userExist = function(req,res,next){
    let name = User.username_Exist(req.params.username).then((result)=>{
        req.profileUser = result;
        return next();
    }).catch(()=>{
        res.render('404');
    })
}


exports.profile = async function(req,res){
    let follows = false;
    await Follow.is_following(req.session._id , req.profileUser.id).then(()=>{
        follows = true;
    }).catch(()=>{
        follows = false;
    });
    
    let followers = [];
    let following = [];

    await Follow.followers(req.profileUser.id).then((result)=>{
        followers = result;
    }).catch(()=>{});
    await Follow.following(req.profileUser.id).then((result)=>{
        following = result;
    }).catch(()=>{});


    Post.findPostByAuthorId(req.profileUser.id).then((posts)=>{
        res.render("profile" , {obj : req.profileUser , post : posts , follows : follows , followers:followers , following:following});
    }).catch(()=>{
        res.render("404");
    })
}
    
