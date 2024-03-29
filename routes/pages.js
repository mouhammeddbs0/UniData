const express = require('express');
const authController = require('../controllers/auth');
const friendsController = require("../controllers/friends");  
const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('home', {
            user: req.user
        });
    } else {
        res.render('index');
    }
    
});

router.get('/home', authController.isLoggedIn, (req, res) => {
    res.render('home', {
        user: req.user
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('profile',{
            user:req.user
        });
    } else {
        res.redirect('/login');
    }

})

router.get('/friends', authController.isLoggedIn, (req, res) => {
    if (!req.user) {
        res.redirect('/login');
    }else{
        console.log(friendsController.showFriends(req.user.id));
        friendsController.showFriends(req.user.id).then((result)=> {
            res.render('friends',result);
        });
    }
})
module.exports = router;