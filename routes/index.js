var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/resources', function(req, res, next) {
  res.render('resources', { title: 'Resources' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/thanks', function(req, res, next) {
  res.render('thanks', { title: 'Thanks' });
});


module.exports = router;
