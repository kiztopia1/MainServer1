var express = require('express');
var router = express.Router();
const Bot = require('../models/bot')
/* GET home page. */
router.post('/:id', function(req, res, next) {
    const id = req.params.id ;

    const bot = new Bot({
        id: id, 
        name: req.body.name,
    })
    bot.save()
    .then(bot => {

        res.end();
    })
});

module.exports = router;
