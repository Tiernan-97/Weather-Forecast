const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1';
const MAX_DAILY_FORECAST = 5;
var fiveDayForecast = document.getElementById('fiveDayForecastEl');

// create an array of searched locations

function getLocation() {
    var userLoc = locationIn.value;

    lookupLocation(userLoc);
}

const lookupLocation = (search) => {

    // Lookup the location to get the Lat/Lon
    var apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            document.getElementById('locationTitle').textContent = data[0].name;

            // Pick the First location from the results
            //const location = data[0];
            var lat = data[0].lat;
            var lon = data[0].lon;

            // Get the Weather for the cached location
            var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
            console.log(apiUrl);
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {

                    console.log(data);

                    // Display the Current Weather

                    document.getElementById('temperature').textContent = "Temperature: " + Math.floor(((data.current.temp)-32)*(5/9)) + ` \xB0C`;
                    document.getElementById('wind-speed').textContent = "Wind speed: " + data.current.wind_speed + "mph";
                    document.getElementById('uv').textContent = "UVI: " + data.current.uvi;
                    document.getElementById('humidity').textContent = "Humidity: " + data.current.humidity + "%";
                    

                    // Display the 5 Day Forecast

                    for (var i=0; i<MAX_DAILY_FORECAST; i++) {

                    fiveDayForecast.innerHTML += `<div class="fiveDays"><p>${Math.floor(((data.daily[i].temp.max)-32)*(5/9))} \xB0C</p><p>${data.daily[i].wind_speed} mph</p><p>${data.daily[i].uvi}</p><p>${data.daily[i].humidity} %</p></div>`
                    };


                });
        });
}


// Add an event handler for the search button
var locationIn = document.getElementById('location');
var searchButton = document.getElementById('search');

searchButton.addEventListener('click', getLocation)