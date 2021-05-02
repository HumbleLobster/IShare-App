const User = require('../models/User');
const alert = require('alert');

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
        req.session.username = user.data.username;
        req.session.avatar = user.avatar;
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
    user.register().then(function(){
        {
            req.session.username = user.data.username;
            req.session.avatar = user.avatar;
            req.session.save((err)=>{
                res.redirect('/');
            })
        }
    }).catch(function(error){
        req.flash('errors' , error);
        req.session.save(function(){
            res.redirect("/");
        })
    });
}

exports.home = function(req,res){
    if(req.session.username)
    {
        res.render('home-loggedin-no-result');
    }else{
        res.render('home-guest' , {errors : req.flash('errors')});
    }
}

