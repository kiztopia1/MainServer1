var express = require('express');
const { modelName } = require('../models/bot');
var router = express.Router();
const Bot = require('../models/bot')
/* GET home page. */
router.get('/:id', function(req, res, next) {
  const id = req.params.id ;
  Bot.findOne({id: id})
  .then(bot => {
    res.render('bot', { title: 'bot', bot: bot });
  })
});

module.exports = router;
