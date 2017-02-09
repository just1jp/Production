var router = require('express').Router();
var foursquare = (require('foursquarevenues'))('KA3ISFW5BXD0ROQ4WG5PITN1JD0YFBCQOVJVSYWSO5CXBB0E', 'O3OTPUF5ZHVLO0YALDCRQESTU0SZJADUA3OWCAGHNDBSSGJJ');



router.get('/api/foursquare', (req, res) => {
  console.log("req.query asdf: ", req.query);

  var params = req.query;
  console.log("params: ", params);

  foursquare.exploreVenues(params, (error, venues) => {
    if(!error) {
      console.log('Venues: ', venues);
      res.send(venues);
    }
  });

});

module.exports = router;