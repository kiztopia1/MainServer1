var express = require('express');
var router = express.Router();
const Bot = require('../models/bot')
/* GET home page. */
router.get('/', function(req, res, next) {
  Bot.find()
  .then(bots => {
    res.render( 'bots',{ title: 'bots', "bots": bots });
  })
});

module.exports = router;
