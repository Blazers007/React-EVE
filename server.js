// 基本模块
var path            = require('path');

// 第三方
var express         = require('express');
var logger		      = require('morgan');
var bodyParser      = require('body-parser');
var favicon         = require('serve-favicon');

// React
var swig  		      = require('swig');
var React 		      = require('react');
var ReactDOM        = require('react-dom/server');
var Router          = require('react-router');
var routes          = require('./app/routes');
var RoutingContext  = Router.RoutingContext;

// 数据库
var mongoose        = require('mongoose');
var config          = require('./config');

mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', function(){
  console.info('Error: Could not connect to MongoDB');
});
db.once('open', function callback(){
   console.log('Connected to MongoDB'); 
});
module.exports.db = db;

// 开始...
var app = express();

// Express 中间件
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// API 路由中间件
app.use(require('./routes/api/characters'));

// React 中间件 用React的Router组件作为入口 并处理路由问题
app.use(function(req, res) {
  Router.match({ routes: routes, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(<RoutingContext {...renderProps} />);
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

// Socket IO ***
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

// 开启服务
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});