var express = require('express');
var router = express.Router();
const Bot = require('../models/bot')
/* GET home page. */
router.post('/:id', function(req, res, next) {
    const id = req.params.id ;
    console.log(id)
    Bot.findOneAndUpdate({id: id}, {command: req.body.command})
    .then(response => {

        res.redirect('/bot/'+id)
    })
});

module.exports = router;
