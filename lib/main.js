//main.js

var http = require("http");
var waveApiKey = "6b4EQPMJ138";
var testUrl = "http://haywirelabs.com";
var waveUri = "key=" + encodeURIComponent(waveApiKey) + "&url=" + encodeURIComponent(testUrl);
var waveUrl = "http://wave.webaim.org/api/request?" + waveUri;

/*
Main
*/

(function(){

  console.log("Accessibility Test on " + testUrl)

  var request = http.get(waveUrl, function(res){
    var buffer = '',
        data,
        route;

    res.on('data', function(chunk){
      buffer += chunk;
    });

    res.on("end", function(err){

      data = JSON.parse(buffer);

      if(data.status.success === true){
        console.log(data.statistics);
        console.log(data.categories)
      }

    })

  })

}).call(this);