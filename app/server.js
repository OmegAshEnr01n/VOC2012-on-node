var express = require('express');
var flash = require('connect-flash');
var session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var bodyParser = require('body-parser')
var routes = require('./routes/index');
var vocapp = require('./routes/vocapp');
var multer = require('multer');


var app = express();



app.set('views', path.join(__dirname,'views'))
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/',express.static(path.join(__dirname,'assets')));
app.use('/vocapp',express.static(path.join(__dirname,'assets')));
// Spend a lot of time on this. So I think every miniapp need to provide the virtual links to assets




app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm8' ,
    WD: null
}));
app.use(flash());


app.use('/', routes);
app.use('/vocapp', vocapp);

// Set Port
app.set('port', (process.env.PORT || 3000));



server = app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});

const io = require('socket.io')(server);
app.set('socketio',io);

module.exports = app;


