const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))//to handle a pre-flight request
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    //retrieving the favorite document for logged in user
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorites => { 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
        // User's list of favorites exists but doesn't include the specified campsite
        req.body.forEach((faves) => {
            if (!favorite.campsites.includes(faves._id)) {
                favorite.campsites.push(faves._id);
            }
        });
        favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
    } else {
        // User's list of favorites doesn't exist yet!
        Favorite.create({ user: req.user._id, campsites: req.body })
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
            })
            .catch((err) => next(err));
    }
})
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Favorite.deleteMany()
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
          favorite.remove()
            .then(favorite => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch(err => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You do not have any favorites to delete.');
        }
      })
      .catch(err => next(err));
  });

//specific campsite with Id
favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))//to handle a pre-flight request
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
            if (favorite) {
                // User's list of favorites exists but doesn't include the specified campsite
                if (!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId);
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    // favorite already exist
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(`That campsite is ${req.params.campsiteId} already in the list of favorites!`)
                }
            } else {
                // User's list of favorites doesn't exist yet!
                Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorites);
                    })
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(`User ID Checking ${req.user._id}`)
    Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
            if (favorite) {
                // User's list of favorites exists but doesn't include the specified campsite
                const index = favorite.campsites.indexOf(req.params.campsiteId);
                console.log(`campsite id checking: ${req.params.campsiteId}`)
                if (index >= 0) {
                    favorite.campsites.splice(index, 1);
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    // favorite already exist
                    res.statusCode = 200
                    res.end(`That campsite: ${req.params.campsiteId} doesn't exist in the list of favorites!`)
                }
            } else {
                //User's list of favorites doesn't exist yet! 
                res.statusCode = 200
                res.end(`That campsite: ${req.params.campsiteId} has no favorite to delete!`)
            }
        })
        .catch((err) => next(err));
});
module.exports = favoriteRouter;