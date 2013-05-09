var socket = io.connect('http://localhost')

socket.on('template', function(data) {
  console.log(data)
})


socket.on('news', function(data) {
  
  console.log('data received is ' + JSON.stringify(data))
  
  var article = '<div class="article" style="display:none"><h5 class="timestamp">' +
                'UPDATED: <%= timestamp %></h5><h2><%= title %></h2><h2 class="price">' +
                '<small>from</small> <%= price %></h2>' +
                '<p><%= body %></p></div>'

  var html = _.template(article, data.article)
  
  $(html)
    .prependTo('#news')
    .slideDown()
    .addClass('highlighted')
  
})