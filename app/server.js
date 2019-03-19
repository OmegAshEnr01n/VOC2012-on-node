var express = require('express');
var path = require('path');
var http = require('http');


var app = express();

var routes = require('./routes/index');
var demo = require('./routes/demo');


app.use('/', routes);
app.use('/demo', demo);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});




