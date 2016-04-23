(function () {
  'use strict';

  function DistanceService($http, $q) {
    var service = {};

    service.distance = 0;
		var usonic = require('r-pi-usonic');
		var sensor = null;

		usonic.init(function (error) {
			if (error) {
				console.log('Error');
			} else {
				sensor = usonic.createSensor(14, 15, 450);
				console.log('usonic sensor initialised');
			}
		});

		var refreshDistance = function () {
			setTimeout(function () {
				service.distance = sensor().toFixed(2);
				console.log('Distance: ' + service.distance + ' cm');
			}, 60);
		}


		service.distance = function () {
			return service.distance;
		};

		return service;
  }

	angular.module('SmartMirror').factory('DistanceService', DistanceService);
} ());
