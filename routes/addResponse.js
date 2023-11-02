var express = require('express');
var router = express.Router();
const Bot = require('../models/bot')
/* GET home page. */
router.post('/:id', function(req, res, next) {
    const id = req.params.id ;
    console.log(id)
    Bot.findOneAndUpdate({id: id}, {response: req.body.response})
    .then(response => {

        res.end()
    })
});

module.exports = router;