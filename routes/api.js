let plantAgeSeconds = 3*60;

var express = require('express');
var router = express.Router();
var moment = require('moment');
var Plant = require('../models/plant')
var plantTypeJson = require('../public/json/plantTypes.json');

router.get('/plants', function(req, res, next) {
  res.render('plants', { title: 'Plants', plantTypes: plantTypeJson });
});

router.get('/dig/beauty', function(req, res, next) {
  res.render('digging', { title: 'Dig', plantType: plantTypeJson[0] });
});

router.get('/dig/clasping', function(req, res, next) {
  res.render('digging', { title: 'Dig', plantType: plantTypeJson[1] });
});

router.get('/dig/lizard', function(req, res, next) {
  res.render('digging', { title: 'Dig', plantType: plantTypeJson[2] });
});

router.get('/dig/obedient', function(req, res, next) {
  res.render('digging', { title: 'Dig', plantType: plantTypeJson[3]  });
});

router.get('/dig/stokes', function(req, res, next) {
  res.render('digging', { title: 'Dig', plantType: plantTypeJson[4]  });
});

router.post('/spawn', function(req, res, next) {
  var plant = req.body;
  console.log("spawn new plant type: " + plant.short_name, plant.x, plant.y);

  Plant.create(plant, (err) => {
    if (err) throw err;
    console.log(plant.short_name, "planted!");
    res.json({});
  });
});


router.get('/allspawned', function(req, res, next) {
  Plant
  .find({spawned:true})
  .exec(function (err, docs) {
    if (err) {
      res.send(err);
    }

    if (docs != null) {
      let i = 0;
      plants = [];
      for(let plant of docs) {

        let born = moment(plant.created_at, "YYYY-mm-ddTHH:MM:ssZ");
        let diff = moment().diff(born);
        let seconds = diff/1000;
        if (seconds < plantAgeSeconds) {
          plants.push({
            plant: plant,
            age: seconds,
            type: plantTypeJson[plant.name]
          });
        }
      }
      res.json(plants);
    }
    else {
      res.json({});
    }

  });
});

// router.post('/spawnplant/:id', function(req, res, next) {
//   var id = req.params.id;
//   Plant
//   .findOne({code:id}, function (err, plant) {
//     if (err) {
//       res.send(err);
//     }
//     if (plant != null) {
//       plant.spawned = true;
//       plant.created_at = new Date();
//       plant.save();
//       return res.status(201).send({
//         success: 'true',
//         message: 'plant spawned successfully', plant
//       })
//     }
//     return res.status(400).send({
//       success: 'false',
//       message: 'no plant found'
//     });
//
//   });
// });

// router.get('/:id', function(req, res, next) {
//   var id = req.params.id;
//   console.log("id: " + id);
//   Plant
//   .findOne({code:id})
//   .exec(function (err, doc) {
//     if (err) {
//       console.log("not working: " + error);
//       return console.error(err);
//     }
//     else {
//       if (doc) {
//
//         res.render('plant', {
//           plant: doc,
//           plantType: plantTypeJson[doc.name],
//           moment: moment
//         });
//       }
//       else {
//         res.render('notfound', {error: "no such plant"});
//       }
//     }
//   });
//   // res.render('plant', { plant: id });
// });

module.exports = router;
