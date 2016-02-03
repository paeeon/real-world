'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Firebase = require('firebase');
var Character = mongoose.model('Character');

router.get('/:characterId',function (req, res, next) {
	Character.find({_id:req.params.characterId}).exec()
	.then(function(character){
		res.status(200).json(character)
	}).then(null, next);
})
module.exports = router;
