const apiRouter = require('express').Router();
const userControllers = require('./controllers/apiUserControllers');
const postControllers = require('./controllers/postControllers');
const followControllers = require('./controllers/followControllers');


apiRouter.get("/login" , userControllers.apiLogin);
apiRouter.post("/create-posts" , userControllers.apiMustBeLoggedIn, userControllers.apiCreate);
apiRouter.get("/get-feeds" , userControllers.apiMustBeLoggedIn , userControllers.apiGetFeeds);

module.exports = apiRouter;