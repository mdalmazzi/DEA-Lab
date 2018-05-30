var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');

var Mappa = require('../models/mappa');

router.get('/:id', function(req, res, next) {
    Mappa.find({ 'numero_mappa': req.params.id },
            function(err, messages) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occured',
                        error: err
                    })
                }
            })
        .populate('user', 'firstName')
        .sort({ order: 1 })
        .exec(function(err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                message: ' Success',
                obj: messages
            })
        });

});

/* router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Non autenticato',
                error: err
            });
        }
        next();
    })

}); */

router.post('/', function(req, res, next) {
    /*  var decoded = jwt.decode(req.query.token);
   User.findById(decoded.user._id, function(err, user) {
      */


    User.findById(req.query.token, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred su POST',
                error: err
            })
        }
        var box = new Mappa({
            content: req.body.content,
            testo: req.body.testo,
            rectangle: req.body.rectangle,
            livello: req.body.livello,
            user: user,
            titolo: req.body.titolo,
            numero_mappa: req.body.numero_mappa,
            color: req.body.color,
            order: req.body.order,
            inMap: req.body.inMap,
            intestazione: req.body.intestazione,
            stato: req.body.stato


        });
        box.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred su POST',
                    error: err
                })
            }
            user.mappa.push(result);
            user.save();
            res.status(201).json({
                message: 'Box salvato',
                obj: result
            })
        });
    });
});


router.patch('/:id', function(req, res, next) {
    /*  var decoded = jwt.decode(req.query.token);
     Mappa.findById(req.params.id, function(err, message) {
      */

    Mappa.findById(req.params.id, function(err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Box Found',
                error: { message: 'Box not FOUND' }
            });
        }
        /*   if (message.user != decoded.user._id) {
              return res.status(401).json({
                  title: 'Non autenticato',
                  error: { message: 'user do not match' }
              });
          } */
        message.content = req.body.content;
        message.testo = req.body.testo;
        message.livello = req.body.livello;
        message.order = req.body.order;
        message.intestazione = req.body.intestazione;
        message.stato = req.body.stato;
        message.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Errore nell aggiornamento',
                    error: err
                })
            }
            res.status(200).json({
                message: 'Box Update',
                obj: result
            })
        });
    });
});

router.delete('/:id', function(req, res, next) {
    /*  var decoded = jwt.decode(req.query.token);
     Mappa.findById(req.params.id, function(err, message) {
      */

    Mappa.findById(req.params.id, function(err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Box Found',
                error: { message: 'Box not FOUND' }
            });
        }
        /* if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Non autenticato',
                error: { message: 'user do not match' }
            });
        } */
        message.remove(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Errore nell aggiornamento',
                    error: err
                })
            }
            res.status(200).json({
                message: 'Box Delete',
                obj: result
            })
        });
    });
});



module.exports = router;