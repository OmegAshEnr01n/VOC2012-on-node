var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/files');
    }
});
var upload = multer({
    storage: storage
});
// I had problems with getting multer working. remeber to add name tag to anything that you need in the html.


router.get(
    '/',
    checkWD,
    function (req, res) {

        
        res.render('vocapp/index.ejs',{
            layout: 'vocapp.ejs'
        });
    }
);

router.post(
    '/setWD',
    function(req, res){
        req.session.WD = req.body.data;
        res.redirect('/vocapp');
    }
);

router
    .get(
        '/uploadimg',
        checkWD,
        function(req, res){
            console.log();
            
            res.render('vocapp/uploadimg.ejs',{
                layout: 'vocapp.ejs'
            });
        }
    );

router
    .post(
        '/uploadimg',
        checkWD,
        upload.any(),
        function(req, res){
            var temp = req.files[0];
            if(temp.fieldname != 'data'){
                res.redirect('/');
            } else {
                res.redirect('/vocapp/modelresult');
            }
        }
    )
;
router.get(
    '/modelresult',
    checkWD,
    async function(req, res, next){
        var io = req.app.get('socketio');
        var e = {};
        e.num = 20;
        e.temp = 'temp';
        io.on('connection',function(socket){
            socket.on('joined', function(data) {
                console.log(data);
                socket.emit('acknowledge', e);
            });
            
        });
        
        res.render('vocapp/modelresult.ejs',{
            layout: 'vocapp.ejs' 
         });
        
    }
);

function checkWD(req, res, next){
    if(req.session.WD == null){
        res.redirect('/');
    } else {
        next();
    }
}
module.exports = router;