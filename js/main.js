// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoianVsaWFudmJlZWsiLCJhIjoiY2s5MThhMTVvMDFyYTNmcGE5ZjZibHVvNSJ9.UoGDKfnuLU7II6M4UDeiQw';

// Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/julianvbeek/ck99vbjlf0pgd1ipde1dn2863',
  center: [5.395168, 52.170216],
  zoom: 6.5,
  pitch: 35,
});

map.addControl(new mapboxgl.NavigationControl());

var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = 'c14156390c8a60455701c3cc7dfc524a';

var cities = [
    {
        name: 'Amsterdam',
        coordinates: [4.895168, 52.380216]
    },
    {
        name: 'Rotterdam',
        coordinates: [4.48917, 51.9225]
    },
    {
        name: 'Nijmegen',
        coordinates: [5.85278, 51.8425]
    },
    {
        name: 'Maastricht',
        coordinates: [5.68889, 50.84833]
    },
    {
        name: 'Groningen',
        coordinates: [6.56667, 53.21917]
    },
    {
        name: 'Enschede',
        coordinates: [6.89583, 52.21833]
    },
];

map.on('load', function() {
    cities.forEach(function(city) {
        var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];
        
        fetch(request)
        .then(function(response) {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(function(data) {
            var iconNumber = data['weather'][0]['icon'];
            var temperature = Math.round(data['main']['temp'] - 272.15) + ' °C';
            var weatherDescription = data['weather'][0]['description'];
            var windSpeed = Math.round(data['wind']['speed'] * 3.6);
            
            if (windSpeed < 35) {
                var message = '<b class="safe">It is safe to land in ' + city.name + '</b>';
            } else {
                var message = '<b class="danger">It is dangerous to land in ' + city.name + '</b>';
            }
            
            
            var popupMessage = new mapboxgl.Popup().setHTML(
                '<div>' +
                '<img class="weatherIcon" src="http://openweathermap.org/img/w/' + iconNumber + '.png" />' +
                '<h3>' + city.name +'</h3>' +
                '</div>' +
                '<span class="temperature">'+ temperature +' </span>' +
                '<span class="description"><b>Sky:</b> '+ weatherDescription +' </span>' +
                '<span class="windSpeed"><b>Wind Speed:</b> '+ windSpeed +' Km/h</span>' +
                message);
            
            new mapboxgl.Marker()
            .setLngLat(city.coordinates)
            .setPopup(popupMessage)
            .addTo(map)
        })
        .catch(function (error) {
            console.log('ERROR:', error);
        })
    });
});