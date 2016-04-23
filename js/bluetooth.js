(function() {
  'use strict';

  function BluetoothService($http, $q) {
    var service = {};

    service.presentdevices = [];

	//~ for(var devs=0; devs < config.bluetooth.devices.length; devs++){
		//~ var newDevice=config.bluetooth.devices[devs];
		//~ newDevice.isPresent=false;
		//~ newDevice.watchdog=moment().year(-1);
		//~ newDevice.published=false;
		//~ service.presentdevices.push(newDevice); 
	//~ } 

    service.UpdatePresentDevices = function(ids) {
      service.presentdevices = [];
      return checkBluetoothIDPresent(config.bluetooth.devices);
    };

	var checkBluetoothIDPresent = function(devices) {
		var promises = [];
		console.log("checkBluetoothIDPresent entered...");
		const exec = require('child_process').exec;
		
		const child1 = exec("hciconfig", (error, stdout, stderr) => {
					console.log("hciconfig =>" + error + "####" + stdout + "####" + stderr);
				});	
				
		const child2 = exec("hcitool name 44:00:10:AE:5A:BD", (error, stdout, stderr) => {
					console.log("hcitool name =>" + error + "####" + stdout + "####" + stderr);
				});	
		
		// angular.forEach(devices, function(device) {
    //     var deferred = $q.defer();
    //     promises.push(deferred.promise);
    //     var command = 'hcitool name ' + device.id;
		// 		console.log("Trying: " + command); 
    //     const child = exec(command, (error, stdout, stderr) => {
		// 			if (error === null) {
		// 				deferred.resolve(stdout);
		// 			} else {
		// 				deferred.reject(error);
		// 			}
		// 		});		  
	  // });	 
	  
	  // When all promises ready...	  
	  return $q.all(promises).then(function(data) {        						
        var devices = [];
        console.log("promises ready...");
        for (var i = 0; i < promises.length; i++) {  
					console.log(data[i]);
					if(data[i] !== ''){
						console.log("bt-dev: "+data[i]);
						devices.push(config.bluetooth.devices[i].name);	
					}
				}
		
		service.presentdevices.push.apply(service.presentdevices, devices);
	  });

	};

    service.PresentDevices = function(ids) {
      return service.presentdevices;
    };   

    return service;
  }

  angular.module('SmartMirror').factory('BluetoothService', BluetoothService);
}());
