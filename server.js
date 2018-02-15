var express = require('express');
var cookie = require('cookie');
var bodyParser = require('body-parser')
var PORT = 8090;
var app = express();
var session = new Object();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', express.static(__dirname));
var server = app.listen(PORT);

app.get('/aurelia', function(req, res){
  console.log('se ha solicitado la direccion aurelia parametro abc: '+req.query.abc.firstName);
  res.send('Hola desde el server en nodejs ');
})
