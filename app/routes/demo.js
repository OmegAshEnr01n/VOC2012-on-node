var express = require('express')
var router = express.Router();
var unirest = require("unirest");

router.get(
    '/getData',
    function (req, res) {
        var room = req.query.room;
        var _ = unirest("GET", "https://14.142.86.144:3260/api/v1/sites/first/rooms/" + room);

        _.headers({
            "Postman-Token": "88df2252-e973-4dbe-bd36-2c8684d8f0fe",
            "Cache-Control": "no-cache",
            "Authorization": "Basic " + "YXBpdGVzdGVyOlBoaWxpcHMxMjNAQA=="
        });
        _.strictSSL(false);


        _.end(function (response) {
            if (response.error) res.send('Error was found. Check your room id');
            else {
                console.log(response.body)
                res.send('Done')
            }

        });
    }
);


module.exports = router;