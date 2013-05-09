
/**
 * Module dependencies.
 */

var express   = require('express')
  , app       = express()
  , server    = require('http').createServer(app)
  , io        = require('socket.io').listen(server)
  , fs        = require('fs')
  , routes    = require('./routes')
  , request   = require('request')
  , qs        = require('querystring')
  , path      = require('path')
  , moment    = require('moment')
  , jade      = require('jade')
  , timestamp
  , _socket


/**
 * Config
 * ================================ */
app.configure(function(){
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(require('less-middleware')({ src: __dirname + '/public' }))
  app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function(){
  app.use(express.errorHandler())
})

server.listen(3000)


/**
 * Routes
 * ================================ */

app.get('/', routes.index)


/**
 * Setup socket.io and templates
 * ================================ */

var path = __dirname + '/views/templates/article.jade'
  , template = fs.readFileSync(path, 'utf8')
  , options = { filename: path }
  , fn = jade.compile(template, options)

var locals = {article:{title:'Something new happened', body:'Today something new happened on the internet.', timestamp: timestamp}}
  , html = fn(locals)

io.sockets.on('connection', function(socket) {
  _socket = socket
  //setInterval(sendMessage, 20000)
  fetchProducts()
})



/**
 * Setup socket.io and templates
 * ================================ */

pushProduct = function(product, index) {
  if (!product) return
  setTimeout(function(){
    console.log(product);
    timestamp = new moment().format('MMM Do YYYY, h:mm:ss a')
    _socket.emit('news', {article: {title: product.title, price: '$' + product.fs_price, body:'', timestamp: timestamp }})
  }, (10000 * index))
}

// accepts an array of products
queueProducts = function(products) {
  if (!products) return
  for (var i= 0; i < products.length; i++) {
    pushProduct(products[i], i)
  }
}



/**
 * Our API call
 * ================================ */

var APP_ID = 'developer'
  , APP_KEY = '44e9e49d093d729c08309d80c570207c'

fetchProducts = function() {
  
  var url = 'http://dev.api.consumersearch.com/1/search/'
    , query = 'blender?'
    , params = {
        app_id: APP_ID
      , app_key: APP_KEY
      , content_type: 'product'
      , fieldlist: 'nextgen'
      }
    , json
  
  url += query += qs.stringify(params)
  
  console.log('request url is: ' + url)
    
  request.get(
    url,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('got the data')
        json = JSON.parse(body)
        queueProducts(json.response && json.response.docs)
      } else {
        console.log('there was error')
        console.log(response.statusCode)
        console.log(error)
      }
    }
  )
}

