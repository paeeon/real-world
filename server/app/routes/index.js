'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/game', require('./game').router);
router.use('/players', require('./players'));
router.use('/character', require('./character'));
router.use('/gameBuilder', require('./gameBuilder'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
