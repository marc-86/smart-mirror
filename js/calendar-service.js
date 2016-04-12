(function(annyang) {
  'use strict';

  function CalendarService($window, $http, $q) {
    var service = {};

    service.events = [];

    service.getCalendarEvents = function() {
      service.events = []; 
      return loadFile(config.calendar.icals);
    };

  function CustomizeEvents(events){
	angular.forEach(events, function(event){
		event.start = moment(event.start);
		event.end = moment(event.end);
		
		var isToday = event.start.isSame(moment(), 'day') || event.start.isBefore(moment());
		var isTomorrow = event.start.isSame(moment().add(1, 'd'), 'day');
		var isThisWeek = event.start.isSame(moment(),'week');
		if(isToday){
			event.dayText = 'Heute';
		}else if(isTomorrow){
			event.dayText = 'Morgen';
		}else if(isThisWeek){
			event.dayText = event.start.format('dd');
		}else{
			event.dayText = event.start.format('Do');
		}
		
		//Write a better text for details to be displayed
		var fromText = "";
		var toText = "";
		var isDayEvent = event.start.hour()===0 && event.start.minute()===0;
		//~ console.log(event);
		if(isDayEvent){
			if(!event.start.isSame(event.end, 'day')){
				fromText = event.start.format('dddd, Do');
			}else{
				fromText = event.start.format('dddd, Do MMMM YYYY');
			}
		}
		else{
			fromText = event.start.format('dddd, Do MMMM YYYY HH:mm');
		}
		
		if(!event.start.isSame(moment(event.end), 'day')){
			toText = " - " + event.end.second(-1).format('dddd, Do MMMM YYYY');
		}else if(!isDayEvent){
			toText = " - " + event.end.format('HH:mm');
		}
		
		event.detailText = fromText + toText;
	});
	}

    var loadFile = function(urls) {
      var promises = [];
	  var ical = require('ical');
	  
	  // Load every url and create promise
	  angular.forEach(urls, function(url) {
        var deferred = $q.defer();
        promises.push(deferred.promise);
        ical.fromURL(url, {}, function(err, data){
			if(err){
				deferred.reject(err)
			}else{
				deferred.resolve(data);
			}
		  });
	  });	 
	  
	  // When all promises ready...	  
	  return $q.all(promises).then(function(data) {        
        
        for (var i = 0; i < promises.length; i++) {
		  var events = [];
		   
		  for(var k in data[i]){
		    if(data[i].hasOwnProperty(k)){
			  var ev = data[i][k];
			  //~ console.log(ev);
			  ev.end = moment(ev.end);
			  ev.start = moment(ev.start);
			  events.push(ev);
			}
		  }
		  
		  service.events.push.apply(service.events, events);
		};
      
      CustomizeEvents(service.events);
      
      });
    };


    service.getEvents = function(events) {
      return service.events;
    }

    service.getFutureEvents = function() {
      var future_events = [],
        current_date = new moment(),
        end_date = new moment().add(config.calendar.maxDays, 'days');
		
      service.events.forEach(function(itm) {
        //If the event started before current time but ends after the current time or
        // if there is no end time and the event starts between today and the max number of days add it.
        if ((itm.end != undefined && (itm.end.isAfter(current_date) && itm.start.isBefore(current_date))) || itm.start.isBetween(current_date, end_date)){
          future_events.push(itm);
        }
      });
      future_events = sortAscending(future_events);
      return future_events.slice(0, config.calendar.maxResults);
    }

    var sortAscending = function(events) {
      return events.sort(function(a, b) {
        var key1 = a.start;
        var key2 = b.start;

        if (key1.isBefore(key2)) {
          return -1;
        } else if (key1.isSame(key2)) {
          return 0;
        } else {
          return 1;
        }
      });
    }

    service.getPastEvents = function(events) {
      var past_events = [],
        current_date = new moment();

      service.events.forEach(function(itm) {
        //If the event ended before the current time, add it to the array to return.
        if (itm.end != undefined && itm.end.isBefore(current_date)){
            past_events.push(itm);
        }
      });
      return past_events.reverse();
    }

    return service;
  }

  angular.module('SmartMirror')
    .factory('CalendarService', CalendarService);
}(window.annyang));
