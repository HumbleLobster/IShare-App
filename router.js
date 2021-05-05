const express = require('express');
const router = express.Router();


const userControllers = require('./controllers/userControllers');
const postControllers = require('./controllers/postControllers');

router.get('/' ,userControllers.home);
router.post('/register' , userControllers.register);
router.post('/login', userControllers.login);

router.post('/logout' , userControllers.logout);

router.get('/create-post' ,userControllers.mustBeLoggedIn, postControllers.createPost);
router.post('/create-post' , userControllers.mustBeLoggedIn , postControllers.savePost);

router.get('/post/:_id' , postControllers.viewSinglePost);

router.get('/profile/:username' ,userControllers.userExist ,userControllers.profile);

module.exports = router;