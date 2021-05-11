const express = require('express');
const router = express.Router();

const userControllers = require('./controllers/userControllers');
const postControllers = require('./controllers/postControllers');
const followControllers = require('./controllers/followControllers');

router.get('/' ,userControllers.home);
router.post('/register' , userControllers.register);
router.post('/login', userControllers.login);

router.post('/logout' , userControllers.logout);

router.get('/create-post' ,userControllers.mustBeLoggedIn, postControllers.createPost);
router.post('/create-post' , userControllers.mustBeLoggedIn , postControllers.savePost);

router.get('/post/:_id' , postControllers.viewSinglePost);

router.get('/profile/:username' ,userControllers.userExist ,userControllers.profile);


router.get('/edit/:_id' , postControllers.viewEditPost);
router.post('/edit/:_id' , postControllers.editPost);
router.post('/delete/:_id' , postControllers.deletePost);

router.post('/search' , postControllers.search);
router.post('/follow/:username' ,userControllers.mustBeLoggedIn ,userControllers.userExist, followControllers.addFollow);
router.post('/unfollow/:username' ,userControllers.mustBeLoggedIn ,userControllers.userExist, followControllers.removeFollow);

router.post('/username-exist' , userControllers.usernameTaken);
router.post('/email-exist' , userControllers.emailTaken);

module.exports = router;