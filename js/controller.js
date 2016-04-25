(function (angular) {
    'use strict';

    function MirrorCtrl(
        GeolocationService,
        WeatherService,
        FitbitService,
        MapService,
        HueService,
        CalendarService,
        GiphyService,
        TrafficService,
        BluetoothService,
        // DistanceService,
        $rootScope, $scope, $timeout, $interval, tmhDynamicLocale, $translate) {
        var _this = this;
        $scope.listening = false;
        $scope.debug = false;
        $scope.focus = "default";
        $scope.user = {};
        $scope.commands = [];
        /*$translate('home.commands').then(function (translation) {
            $scope.interimResult = translation;
        });*/
        $scope.interimResult = $translate.instant('home.commands');
        $scope.layoutName = 'main';

        $scope.fitbitEnabled = false;
        if (typeof config.fitbit != 'undefined') {
            $scope.fitbitEnabled = true;
        }

        //set lang
        $scope.locale = config.language;
        tmhDynamicLocale.set(config.language.toLowerCase());
        moment.locale(config.language);
        console.log('moment local', moment.locale());

        //Update the time
        function updateTime() {
            $scope.date = new moment();
        }

        // Reset the command text
        var restCommand = function () {
            $translate('home.commands').then(function (translation) {
                $scope.interimResult = translation;
            });
        };

        _this.init = function () {
            var tick = $interval(updateTime, 1000);
            updateTime();
            GeolocationService.getLocation({ enableHighAccuracy: true }).then(function (geoposition) {
                console.log("Geoposition", geoposition);
                $scope.map = MapService.generateMap(geoposition.coords.latitude + ',' + geoposition.coords.longitude);
            });
            restCommand();

            var refreshMirrorData = function () {
                //Get our location and then get the weather for our location
                GeolocationService.getLocation({ enableHighAccuracy: true }).then(function (geoposition) {
                    console.log("Geoposition", geoposition);
                    WeatherService.init(geoposition).then(function () {
                        $scope.currentForcast = WeatherService.currentForcast();
                        $scope.weeklyForcast = WeatherService.weeklyForcast();
                        $scope.hourlyForcast = WeatherService.hourlyForcast();
                        console.log("Current", $scope.currentForcast);
                        console.log("Weekly", $scope.weeklyForcast);
                        console.log("Hourly", $scope.hourlyForcast);

                        var skycons = new Skycons({ "color": "#aaa" });
                        skycons.add("icon_weather_current", $scope.currentForcast.iconAnimation);

                        skycons.play();

                        $scope.iconLoad = function (elementId, iconAnimation) {
                            skycons.add(document.getElementById(elementId), iconAnimation);
                            skycons.play();
                        };

                    });


                }, function (error) {
                    console.log(error);
                });

                CalendarService.getCalendarEvents().then(function (response) {
                    $scope.calendar = CalendarService.getFutureEvents();
                }, function (error) {
                    console.log(error);
                });

                if ($scope.fitbitEnabled) {
                    setTimeout(function () { refreshFitbitData(); }, 5000);
                }
            };

            var refreshFitbitData = function () {
                console.log('refreshing fitbit data');
                FitbitService.profileSummary(function (response) {
                    $scope.fbDailyAverage = response;
                });

                FitbitService.todaySummary(function (response) {
                    $scope.fbToday = response;
                });
            };

            refreshMirrorData();
            $interval(refreshMirrorData, 1500000);

            // var checkPresence = function () {                
            //     console.log("New Distance" + DistanceService.distance);    
            // }
            // $interval(checkPresence, 1000);

            var greetingUpdater = function () {
                if (!Array.isArray(config.greeting) && typeof config.greeting.midday != 'undefined') {
                    var hour = moment().hour();
                    var geetingTime = "midday";

                    if (hour > 4 && hour < 11) {
                        geetingTime = "morning";
                    } else if (hour > 18 && hour < 23) {
                        geetingTime = "evening";
                    } else if (hour >= 23 || hour < 4) {
                        geetingTime = "night";
                    }

                    $scope.greeting = config.greeting[geetingTime][Math.floor(Math.random() * config.greeting.morning.length)];
                } else if (Array.isArray(config.greeting)) {
                    $scope.greeting = config.greeting[Math.floor(Math.random() * config.greeting.length)];
                }
            };
            greetingUpdater();
            $interval(greetingUpdater, 120000);

            var refreshTrafficData = function () {
                TrafficService.getDurationForTrips().then(function (tripsWithTraffic) {
                    console.log("Traffic", tripsWithTraffic);
                    //Todo this needs to be an array of traffic objects -> $trips[]
                    $scope.trips = tripsWithTraffic;
                }, function (error) {
                    $scope.traffic = { error: error };
                });
            };

            refreshTrafficData();
            $interval(refreshTrafficData, config.traffic.reload_interval * 60000);

            var refreshBluetoothPresentDevices = function () {
                BluetoothService.UpdatePresentDevices().then(function (response) {
                    $scope.bluetoothDevices = BluetoothService.PresentDevices();
                }, function (error) {
                    console.log(error);
                });
            }
            // $interval(refreshBluetoothPresentDevices, config.bluetooth.refreshTime * 1000);
        };

        _this.init();
    }

    angular.module('SmartMirror')
        .controller('MirrorCtrl', MirrorCtrl);

    function themeController($scope) {
        $scope.layoutName = (typeof config.layout != 'undefined' && config.layout) ? config.layout : 'main';
    }

    angular.module('SmartMirror')
        .controller('Theme', themeController);

} (window.angular));
