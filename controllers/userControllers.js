const User = require('../models/User');
const alert = require('alert');

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
        res.render('home-loggedin-no-result',{username: req.session.username , avatar : req.session.avatar});
    }else{
        res.render('home-guest' , {errors : req.flash('errors')});
    }
}

