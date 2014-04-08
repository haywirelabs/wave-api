//main.js

var http = require("http");
var waveApiKey = "6b4EQPMJ138";
var testUrl = "https://www.healthcare.gov/find-premium-estimates/";
var reportType = 3;
var waveUri = "key=" + encodeURIComponent(waveApiKey) + "&url=" + encodeURIComponent(testUrl) + "&reporttype=" + reportType;
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
        var testPageTitle = data.statistics.pagetitle;
        var testPageUrl = data.statistics.pageurl;
        var testTime = data.statistics.time;
        var testsFailed = data.statistics.allitemcount;
        var totalNumberOfTests = data.statistics.totalelements;
        var creditsRemaining = data.statistics.creditsremaining;
        var waveBrowserUrl = data.statistics.waveurl;

        console.log("Test Page Title: " + testPageTitle);
        console.log("Test Page URL: " + testPageUrl);
        console.log("Test Page Time: " + testTime);
        console.log("Tests Failed: " + testsFailed);
        console.log("Total Number of Tests: " + totalNumberOfTests);
        console.log("Credits Remaining: " + creditsRemaining);
        console.log("WAVE Browser URL: " + waveBrowserUrl);

        var errorsReturned = data.categories.error;
        var alertsReturned = data.categories.alert;
        var featuresReturned = data.categories.feature;
        var structureReturned = data.categories.structure;
        var html5Returned = data.categories.html5;
        var contrastReturned = data.categories.contrast;

        console.log(errorsReturned);
        console.log(alertsReturned);
        console.log(featuresReturned);
        console.log(structureReturned);
        console.log(html5Returned);
        console.log(contrastReturned);
      }
      else{
        console.log("Accessibility Test was unsuccessful.");
      }

    })

  })

}).call(this);