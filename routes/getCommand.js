var express = require('express');
var router = express.Router();
const Bot = require('../models/bot')
/* GET home page. */
router.get('/:id', function(req, res, next) {
    const id = req.params.id ;
    console.log(id)
    Bot.findOne({id: id})
    .then(response => {

        res.json({"response": response.command})
    })
});

module.exports = router;
