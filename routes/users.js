const express = require('express');
const router = express.Router();
const passport = require("passport");
// const middleware = require("../middleware");
const { isOwnerOfAccount } = require("../middleware");

const User = require("../models/User");
const Reservation = require("../models/Reservation");

router.get('/', isOwnerOfAccount, function(req, res) {
    User.find({}, function (err, users) {
        if(err){
            req.flash('error','Failed to get users list.');
            res.redirect('/');
        } else {
            res.render('users/users', {title: ' | Users', users});
        }
    });
});

router.get('/:id/show', isOwnerOfAccount, function (req,res) {
    User.findById(req.params.id, function(err,user) {
        if(err){
            console.error(err);
            req.flash('error', 'Failed to get user details');
            res.redirect('/users');
        }else {
            User.populate(user, "reservations", function (err, reservations) {
                if (err) {
                    console.error(err);
                    req.flash('error', 'Failed to get reservations');
                    // res.redirect('/users');
                    res.render('users/show', {title: " | User", user, reservations: []});
                } else {
                    // console.log(reservations);
                    User.populate(reservations, {
                        path: 'reservations.cottage',
                        model: 'Cottage'
                    }, function (err, populated) {
                        if (err) {
                            console.error(err);
                            req.flash('error', 'Failed to get reservations');
                            res.render('users/show', {title: " | User", user, reservations: []});
                            // res.redirect('/users');
                        } else {
                            // console.log(populated.reservations[0].cottage.toString());
                            res.render('users/show', {title: " | User", user, reservations: populated.reservations});
                        }
                    });
                }
            });
        }
    });
});

router.get('/:id/edit', isOwnerOfAccount, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if(err){
            console.error(err);
            req.flash('error', 'Could not get user details');
            res.redirect('/');
        } else {
            res.render('users/edit', {title: ' | Edit User', user});
        }
    });
});

router.post('/:id/edit', isOwnerOfAccount, function (req, res) {
    let updates = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        postalCode: req.body.postalcode,
        phone: req.body.phone,
        email: req.body.email,
    };
    User.findByIdAndUpdate(req.params.id, updates, {new: true}, function (err, user) {
        if(err){
            console.error(err);
            req.flash('error', 'Could not update user details');
        } else {
            res.redirect(`/users/${user.id}/show`);
        }
    });
});

router.get('/:id/delete', isOwnerOfAccount, function (req, res) {
    Reservation.find({user: req.params.id}, function (err, reservations) {
        if(err){
            console.error(err);
            req.flash('error','Could not get users reservations. Try canceling them first.');
            res.redirect(`/${req.param.id}/show`);
        } else {
            Reservation.populate(reservations,"cottage",function (err, populated) {
                if(err){
                    req.flash('error','Could not get reservation details.');
                    // res.redirect(`/${req.param.id}/show`);
                } else {
                    res.render('users/delete', {title: ' | Delete User', reservations, userId: req.params.id});
                }
            });
        }
    });
});

router.post('/:id/delete', isOwnerOfAccount, function (req, res) {
    User.findById(req.params.id,function (err,user) {
        if(err){
            console.log(err);
            req.flash('error',"Could not find user to delete.");
        } else {
            if(user.admin) {
                res.redirect('https://cdn.head-fi.org/a/9891211.png'); // HEH!
            } else {
                if (user.reservations && user.reservations.length > 0) {
                    Reservation.deleteMany({user: user.id}, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
                User.findByIdAndRemove(user.id, function (err) {
                    if (err) {
                        req.flash('error', "Could not remove user.");
                        res.redirect(`/users/${user.id}/delete`);
                    } else {
                        req.flash('success', "User removed successfully.");
                        res.redirect('/users');
                    }
                });
            }
        }
    });
});

router.get('/register', function (req, res) {
    res.render("users/register", {title: " | Register"});
});

router.post('/register', function (req, res) {
    const userDetails = {
        username: req.body.username,
        admin: false,
        firstname: req.body.firstname || "",
        lastname: req.body.lastname || "",
        address: req.body.address || "",
        postalCode: req.body.postalcode || null,
        phone: req.body.phone || null,
        email: req.body.email || "",
    };
    let newUser =  new User(userDetails);
    User.register(newUser, req.body.password, function (err) {
        console.log(typeof req.body.password);
        if(err){
            if(err.name === "UserExistsError"){
                req.flash("error", "Username already exists.");
            } else {
                req.flash("error", "Failed to register");
            }
            console.error(err);
            // req.flash("error", "Failed to register");
            return res.render('users/register', {title: " | Register", error: req.flash("error")});
        }
        passport.authenticate('Local')(req,res,function(){
            req.flash("success", "Thank you for registering. Please login with you new account.");
            res.redirect('/users/login');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('users/login',{title: " | Login"});
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/cottages',
        failureRedirect: '/users/login'
    }), function(req, res) {
});

router.get('/logout', function(req, res) {
    req.flash("success", "You are now logged out");
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;
