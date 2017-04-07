var express = require('express');
var nunjucks = require('nunjucks');
var callbook = require('./callbook.js')

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {
    res.render('index.html', {
        title: 'Hejsan',
    });
});

app.get('/callbook', function (req, res) {
    callbook.lookup(req.query, (result) => res.send(result));
});

app.listen(8081, function () {
  console.log('listening on port 8081!')
});
