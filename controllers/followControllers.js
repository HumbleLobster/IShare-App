const Follow = require('../models/follow');

exports.addFollow =  function(req,res){
    const follow = new Follow(req);
    follow.addUser().then(()=>{
        req.flash('success' , "Started Following User "+req.profileUser.username);
        req.session.save((err)=>{
            res.redirect("/profile/"+req.profileUser.username);
        })
    }).catch(()=>{
        res.render("404")
    });
}

exports.removeFollow =  function(req,res){
    const follow = new Follow(req);
    follow.removeUser().then(()=>{
        req.flash('errors' , "Unfollowed User  "+req.profileUser.username);
        req.session.save((err)=>{
            res.redirect("/profile/"+req.profileUser.username);
        })
    }).catch(()=>{
        res.render("404")
    });
}