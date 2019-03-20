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
var shell = require('shelljs');
var fs = require('fs');
var base64Img = require('base64-img');
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
                shell.exec('python '+path.join(__dirname,'..','py','test.py')+' '+ path.join(__dirname,'..','py','Model2.pt')+' '+path.join(__dirname,'..','public','files',temp.filename))
                res.redirect('/vocapp/modelresult?file='+temp.filename);
            }
        }
    )
;
router.get(
    '/modelresult',
    checkWD,
    async function(req, res, next){
        var io = req.app.get('socketio');
        io.on('connection',function(socket){
            socket.on('joined', function(data) {
                socket.emit('acknowledge', 'done');
            });
            
            var f = path.join(__dirname,'..','public','files',req.query.file+'_res.txt');
            snd = {};
            console.log(f);
            fs.readFile(f, function(err, data){
                
                var lines=String(data).split('\n');
                lines.forEach(function(e){
                    var c = e.split(' ');
                    snd[c[0]] = c[1];
                });
                socket.emit('getdata',snd);
            });
            
            
            
        });
        var image = base64Img.base64Sync(path.join(__dirname,'..','public','files',req.query.file));

                    res.render('vocapp/modelresult.ejs',{
                        layout: 'vocapp.ejs',
                        image:  image
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