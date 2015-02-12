// APP ROUTES

module.exports = function(app) {
    // Dependencies
    var GiftList            = require('./models/giftlist');
    var mongoose            = require('mongoose');
    var Gift                = require('./models/gift');
    var User                = require('./models/user');
    var Apac                = require('./apacQueries');
    var passport            = require('passport');
    var LocalStrategy       = require('passport-local').Strategy;

// ==============================================================
// ============= PASSPORT AUTHENTICATION CONFIG =================
// ==============================================================
    // Set up a local strategy for verifying login info
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ 'local.email' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user){
                return done(null, false, { message: 'Name taken' });
            }

            // user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, { message: 'Incorrect password.' });

            // successful user
            return done(null, user);
        });
        }
    ));

    // serialize user for session object
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Define a middleware function to be used for every secured routes
    var auth = function(req, res, next){
        if (!req.isAuthenticated())
            res.send(401);
        else
        next();
    };

    // Checks to see if a user is logged in
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // Uses passport to log a user in
    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.send(req.user);
    });

    // route to log out
    app.post('/logout', function(req, res){
        req.logOut();
        res.send(200);
    });

    // Allows users to register accounts
    app.post('/register', function(req, res) {
        // get params
        email = req.body.username;
        password = req.body.password;
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                res.send(err);

            // check to see if theres already a user with that email
            if (user) {
                res.send("Error, user exists");
            }
            else {
                var newUser            = new User();
                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    res.send(user);
                });
            }

        });
    });

// ==============================================================
// ======================== API ROUTES ==========================
// ==============================================================

    // GET /lists -> gets all gift lists for the current user and returns JSON object
    app.get('/api/giftlists', auth, function(req, res) {
        GiftList.getListsForUser(req.user, function(err, lists) {
            if (err)
                console.log("Error: " + err + " on server side");
            res.json(lists);
        });
    });

    //POST /lists -> creates a new empty list with a reference to the current user
    app.post('/api/giftlists', auth, function(req, res) {
        // build list
        var newList = new GiftList({
            owner: req.user._id,
            name : req.body.name,
            isfor  : req.body.isfor,
            gifts: []
        });

        newList.save(function(err, newList) {
            if (err)
                console.log("Error: " + err);
            else
                res.json(newList._id); // send the id of the new list so that we can update the client
        });
    });

    // GET /lists/:id -> single list by id
    app.get('/api/giftlists/:id', auth, function(req, res) {
        var user = req.user;

        // for security, ensure that we have the correct owner
        GiftList.getOwnerOfListWithId(req.params.id, function(owner) {

            // Get the list using REST url
            GiftList.getListById(req.params.id, function(err, list) {
                if (err)
                    console.log("Error: " + err + " on server");
                res.json(list);
            });
        });
    });

    // DELETE /lists/:id -> delete list by id. Will delete gifts contained within as well
    app.delete('/api/giftlists/:id', auth, function(req, res) {//isLoggedIn, function(req, res) {
        var user = req.user;

        // ensure we have correct owner
        GiftList.getOwnerOfListWithId(req.params.id, function(owner) {

            // remove list using REST parameters
            GiftList.removeOneById(req.params.id, function(err, list) {
                if (err)
                    console.log("Error: " + err + " on server");
                res.json(true);
            });
        });
    });

    //POST /lists/:id/gifts -> Create a new gift and tie to current list
    app.post('/api/giftlists/:id/gifts', auth, function(req, res) {//isLoggedIn, function(req, res) {
        var user = req.user;

        GiftList.getOwnerOfListWithId(req.params.id, function(owner) {

            Apac.getProductUrlAndImage(req.body.name, function(productUrl, imageUrl) {
                var gift = new Gift({
                    name: req.body.name,
                    note: req.body.note,
                    amazonlink: productUrl,
                    image: imageUrl
                });

                GiftList.addGiftToList(req.params.id, gift);
                res.json(gift);
            });
        });
    });

    // DELETE /lists/:id/gifts/:id -> Delete a single gift from the current list
    app.delete('/api/giftlists/:listid/gifts/:giftid', auth, function(req, res) {//isLoggedIn, function(req, res) {
        var user = req.user;

        GiftList.getOwnerOfListWithId(req.params.listid, function(owner) {
            if (user._id != owner.toString()) {
                res.send(401);
            }

            // Remove the gift
            GiftList.removeGiftFromList(req.params.listid, req.params.giftid, function(err) {
                if (err)
                    console.log("Error: " + err + " on server");
                res.json(true);
            });
        });
    });

    // UPDATE /lists/:id/gifts/:id -> Update 1 gifts data from current list
    app.put('/api/giftlists/:listid/gifts/:giftid', auth, function(req, res) {//isLoggedIn, function(req, res) {
        var user = req.user;

        GiftList.getOwnerOfListWithId(req.params.listid, function(owner) {

            // Security check
            if (user._id != owner.toString())
                res.send(401);

            // Update product info
            Apac.getProductUrlAndImage(req.body.name, function(productUrl, imageUrl) {
                var gift = new Gift({
                    name: req.body.name,
                    note: req.body.note,
                    amazonlink: productUrl,
                    image: imageUrl
                });

                gift._id = req.params.giftid;

                // Update gift
                GiftList.updateGiftInList(req.params.listid, gift, function(err) {
                    res.json(gift);
                });
            });
        });
    });

     // GET /ideas -> Return list of all current gift ideas
     app.get('/api/ideas', function(req, res) {
         var result = GiftList.getAllGifts(function(gifts) {
             res.json(gifts);
         });
     });

     // Server index so that angular can handle API calls
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });

};
