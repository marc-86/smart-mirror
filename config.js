var config = {

    // Lenguage for the mirror
    language : "de", //must also manually update locales/X.js bower component in index.html
    layout: "main",
    //greeting : ["Hi, sexy!"], // An array of greetings to randomly choose from
    
    // Alternativly you can have greetings that appear based on the time of day
    
    greeting : {
       night: ["Betti?", "zZzzZz", "Bubbu machen!.."],
       morning: ["Guten Morgen!","Morjeeen!"],
       midday: ["HeyHey!", "Hola!", "Tach!"],
       evening: ["N'Abend!"]
    },

	bluetooth: {
		devices : [{id:"44:00:10:AE:5A:BD", name:"Hüsi"},
			{id:"28:5A:EB:8D:3E:2F", name:"juLe*DeluXe"}],
		refreshTime: 15, //Every refreshTime ist checked for new devices
		timout: 120, //After timeout a device is marked as away
		publishTime: 60 //For publishTime a device is shown on the screen
	},

    // forcast.io
    forcast : {
        key : "292999be438274ecda565430f532b557", // Your forcast.io api key
        units : "auto" // See forcast.io documentation if you are getting the wrong units
    },
    // Philips Hue
    hue : {
        ip : "", // The IP address of your hue base
        uername : "", // The username used to control your hue
        group : "0" // The group you'd like the mirror to control (0 is all hue lights connected to your hub)
    },
    // Calendar (An array of iCals)
    calendar: {
      icals : ["https://calendar.google.com/calendar/ical/1ongjafuhtohge0om9q0p70nbo%40group.calendar.google.com/private-3e265cd53bc6e4198e56d25a98b52734/basic.ics"],
      maxResults: 9, // Number of calender events to display (Defaults is 9)
      maxDays: 365 // Number of days to display (Default is one year)
    },
    // Giphy
    giphy: {
      key : "" // Your Gliphy API key
    },
    traffic: {
      key : "AuQA8BX3Y6AfpA2CzydPdc6_ig4Z2r_bXFU2nJ316o6ykuBlm0J-e--wfBk9s-yA", // Bing Maps API Key
      mode : "Driving", // Possibilities: Driving / Transit / Walking
      origin : "Martin-Luther-Strasse 28, Eschweiler, Deutschland", // Start of your trip. Human readable address.
      destination : "Hansemannplatz Aachen, Deutschland", // Destination of your trip. Human readable address.
      name : "Hansemannplatz", // Name of your destination ex: "work"
      reload_interval : 5 // Number of minutes the information is refreshed
    }
};
