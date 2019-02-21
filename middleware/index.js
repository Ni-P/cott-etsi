const User = require("../models/User");
const Reservation = require("../models/Reservation");

const isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    else {
        req.flash("error", "You must be logged in to see this page.");
        res.redirect('/users/login');
    }
};

const isLoggedAsAdmin = async function (req, res, next) {
    if (req.isAuthenticated()) {
        let isAdmin = false;
        await User.findOne({ username: req.session.passport.user }, "admin", (err, result) => {
            // console.log(result);
            if (err) console.error(err);
            else isAdmin = result.admin;
        });
        if (isAdmin) return next();
        else {
            req.flash("error", "You must be logged in as administrator to see this page.");
            return res.redirect('/users/login');
        }
    } else {
        req.flash("error", "You must be logged in as administrator to see this page.");
        return res.redirect('/users/login');
    }
};

// checks if currently loggedin user ownes the reservation 
const isOwnerOfReservation = function (req, res, next) {
    if (req.user.admin) return next();
    Reservation.findById(req.params.id, "user", function (err, reservation) {
        if (err) {
            console.error(err);
            res.redirect('/');
        } else {
            if (reservation.user == req.user.id) {
                return next();
            } else {
                req.flash('error', "You are not the owner of this reservation.");
                res.redirect('/reservations');
            }

        }
    });
};

// checks if user is trying to modify another account
const isOwnerOfAccount = function (req, res, next) {
    if (req.user && req.user.admin) return next();
    if (req.user && req.params.id !== req.user.id) return res.redirect(`/users/${req.user.id}/show`);
    if (req.user && req.user.id === req.params.id) {
        // console.log('id match');
        return next();
    } else {
        res.redirect(req.user && req.user.id ? `/users/${req.user.id}/show` : "/");
    }
};

// this checks if the user has provided personal info before making a reservation
const hasContactDetails = function (req, res, next) {
    User.findById(req.user.id, function (err, user) {
        if (err) {
            console.error(err);
            res.redirect('/');
        } else {
            console.log(user);
            if (user.firstname && user.lastname && user.address && user.postalCode && user.phone && user.email) {
                next();
            } else {
                req.flash('warning', "You must provide all your contact information before making a reservation.");
                res.redirect(`/users/${req.user.id}/edit`);
            }
        }
    })
};

module.exports = {
    isLoggedIn,
    isLoggedAsAdmin,
    isOwnerOfReservation,
    isOwnerOfAccount,
    hasContactDetails
};