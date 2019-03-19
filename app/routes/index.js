var express = require('express')
var router = express.Router();


router.get('/', function(req, res){
  res.render('index.ejs', {
      layout: 'indexLayout.ejs'
  });
});
module.exports = router;
