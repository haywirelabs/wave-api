//main.js

var http = require("http");
var waveApiKey = "6b4EQPMJ138";
var testUrl = "https://www.healthcare.gov/find-premium-estimates/";
var reportType = 3;
var waveUri = "key=" + encodeURIComponent(waveApiKey) + "&url=" + encodeURIComponent(testUrl) + "&reporttype=" + reportType;
var waveUrl = "http://wave.webaim.org/api/request?" + waveUri;

/*
Read in CLI arguments
 */

 var ArgumentParser = require('argparse').ArgumentParser;
  var parser = new ArgumentParser({ addHelp: true, description: 'Format to JUnit Options' });
  parser.addArgument([ '-t', '--to' ], {help: 'Path to where the XML file should write'});
  var args = parser.parseArgs();

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
/*
        console.log("Test Page Title: " + testPageTitle);
        console.log("Test Page URL: " + testPageUrl);
        console.log("Test Page Time: " + testTime);
        console.log("Tests Failed: " + testsFailed);
        console.log("Total Number of Tests: " + totalNumberOfTests);
        console.log("Credits Remaining: " + creditsRemaining);
        console.log("WAVE Browser URL: " + waveBrowserUrl);
*/
        var errorsReturned = data.categories.error;
        var alertsReturned = data.categories.alert;
        var featuresReturned = data.categories.feature;
        var structureReturned = data.categories.structure;
        var html5Returned = data.categories.html5;
        var contrastReturned = data.categories.contrast;

        console.log(errorsReturned);
/*
        console.log(alertsReturned);
        console.log(featuresReturned);
        console.log(structureReturned);
        console.log(html5Returned);
        console.log(contrastReturned);
*/

        /*
        Set up XML Document
         */
        var counter = 1;
        var docBuilder = require('xmlbuilder');
        var xml = docBuilder.create('testsuite', {version: '1.0', encoding: 'UTF-8'}, {errors: testsFailed, tests: totalNumberOfTests});
        xml.att('errors', testsFailed);
        xml.att('tests', totalNumberOfTests);
        xml.att('time', testTime);
        xml.att('failures', testsFailed);
        xml.att('name', 'WAVE API Results');

        var xmlProperty = xml.ele('properties')
        .att('value','Java(TM) 2 Runtime Environment, Standard Edition')
        .att('name','java.runtime.name')
          .ele('property')
          .att('value', 'UnicodeBig')
          .att('name', 'sun.io.unicode.encoding');

        for(var item in errorsReturned.items){
          for(var i in errorsReturned.items[item]){
            if(i === 'id'){
              var failType = errorsReturned.items[item][i];
            }
            if(i === 'description'){
              var failDescription = errorsReturned.items[item][i];
            }
            if(i === 'count'){
              var failCount = errorsReturned.items[item][i];
            }
          }

          for(var i = 0; i < failCount; i++){
            var testCaseName = 'error' + counter;
            var xmlTestCase = xml.ele('testcase')
              .att('time', '0')
              .att('name', testCaseName)
              .ele('failure',{'type':'junit.framework.AssertionFailedError', 'message': failType}, failDescription);
            counter++;
          }
        }

        xmlString = xml.end();

        console.log(xmlString);

      }
      else{
        console.log("Accessibility Test was unsuccessful.");
      }

    })

  })

}).call(this);