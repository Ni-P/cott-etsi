const express = require('express');
const router = express.Router();

const Reservation = require('../models/Reservation');
const Cottage = require("../models/Cottage");
const User = require("../models/User");

const {
    isLoggedIn,
    isOwnerOfReservation,
    hasContactDetails
} = require("../middleware");

router.get('/', isLoggedIn, function (req, res) {
    Reservation.find(req.user.admin?{}:{user: req.user._id},function (err, reservations) {
        if(err) {
            console.error(err);
            res.redirect('/');
        } else {
            // if(!reservations) return res.render('reservations/reservations',
            //     {   reservations: [],
            //         title: " | Reservations"
            //     });
            Reservation.populate(reservations,[{ path: 'cottage', model: 'Cottage' },{ path: 'user', model: 'User' }],function (err, populated) {
                if (err) {
                    console.error(err);
                    res.redirect('/');
                } else {
                    // console.log(populated.toString());
                    res.render('reservations/reservations',
                        {   reservations: populated,
                            title: " | Reservations"
                        });
                }
            });
        }
    });
});

router.get('/:id/new', isLoggedIn, hasContactDetails, function (req, res) {
    Reservation.find({cottage: req.params.id},"date",function (err, dates) {
        if(err) {
            console.error(err);
        } else {
            // console.log(dates.toString());
            Cottage.findById(req.params.id,function (err, cottage) {
                if(err) {
                    console.error(err);
                } else {
                    let dateArr = [];
                    dates.forEach((date)=>{dateArr.push(date.date)});
                    // console.log(dateArr);
                    res.locals.dates = dateArr;
                    res.locals.cottage = cottage;
                    res.render('reservations/new', {title: " | Reservation"});
                }
            });
        }
    });
});

router.post('/:id/new', isLoggedIn, function (req, res) {
    const newReservation = {
        user: req.user._id,
        cottage: req.params.id,
        date: req.body.reservasionDay
    };

    Reservation.create(newReservation, function (err, newInsert) {
        if(err){
            console.error(err);
            req.flash('error', "There was an error in the reservation. Please try again later.");
            res.render(`/${req.params.id}/new`);
        } else {
            req.flash('success', "Thank you for your reservation.");
            User.findById(newReservation.user,function (err, newEntry) {
                if(err){
                    console.error(err);
                    res.redirect('/');
                } else {
                    newEntry.reservations.push(newInsert);
                    newEntry.save();
                    res.redirect('/reservations');
                }
            })
        }
    });
});

router.get('/:id/delete', isLoggedIn, isOwnerOfReservation, function (req, res) {
    Reservation.findById(req.params.id, function (err, reservation) {
        if(err){
            console.error(err);
            res.redirect('/');
        } else {
            Reservation.populate(reservation,"cottage",function (err, populated) {
                if(err){
                    console.error(err);
                    res.redirect('/');
                } else {
                    res.render('reservations/delete', {
                        title: ' | Cancel your reservation',
                        reservation: populated
                    });
                }
            })

        }
    });
});

router.post('/:id/delete', isLoggedIn, isOwnerOfReservation, function (req, res) {
    User.findById(req.user.id,"reservations",function (err, user) {
        if(err){
            console.error(err);
            res.redirect('/');
        } else {

            if(user.reservations.includes(req.params.id)) console.log('FOUND it');
            user.reservations.pop(req.params.id);

            user.save(function (err) {
                if(err){
                    console.error(err);
                    res.redirect('/');
                } else {
                    Reservation.findByIdAndDelete(req.params.id,function (err) {
                        if(err){
                            console.error(err);
                            res.redirect('/');
                        } else {
                            req.flash('success',"Reservation cancelled succesfully");
                            res.redirect('/reservations');
                        }
                    });
                }
            });
        }
    });
});

router.get('/:id/show', isLoggedIn, isOwnerOfReservation, function (req, res) {
    Reservation.findById(req.params.id, function (err, reservation) {
        if(err){
            console.error(err);
            res.redirect('/');
        } else {
            Reservation.populate(reservation,"cottage user",function (err, populated) {
                if(err){
                    console.error(err);
                    res.redirect('/');
                } else {
                    res.render('reservations/show', {
                        title: ' | Your reservation',
                        reservation: populated
                    });
                }
            });
        }
    });
});

module.exports = router;
