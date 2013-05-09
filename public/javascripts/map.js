;(function($){
  
  var map
    , marker
    , i
  
  var defaults = {
    center: new google.maps.LatLng(37.775, -122.4183)
    , zoom: 12
  }
  
  // the map class
  var googleMap = function(element, options) {
    this.element = element
    this.options = $.extend({}, defaults, options)
    this.init(this.options)
  }
  
  // the map prototype
  googleMap.prototype = {
    
    constructor: googleMap
    
    , init: function(options) {
            
        var mapOptions = {
          zoom: options.zoom
          , center: options.center
          , mapTypeId: google.maps.MapTypeId.ROADMAP
        }
                
        map = new google.maps.Map(this.element, mapOptions)
        
        this.plotMarkers(this.getMarkers())
      }
    
    , getMarkers: function() {
        // get the markers from a source, db, api, etc
        // make some fake ones for now
        var latLng = new google.maps.LatLng(37.775, -122.4183)        
        markers = [
          {
            'latlng': latLng
            , 'title': 'Kittens'
            , animation: google.maps.Animation.DROP
          }
        ]
        return markers
      }
    
    , plotMarkers: function(markers) {        
        for (i = 0; i < markers.length; i++) {
          marker = new google.maps.Marker({
            position: markers[i].latlng
            , map: map
            , title: markers[i].title
          })
        }
      }
  }
  
  // the jquery plugin definition
  $.fn.googlemap = function(options) {
    return this.each(function() {
      new googleMap(this, options)
    })
  }

})(window.jQuery);