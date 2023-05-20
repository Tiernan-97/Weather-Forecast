const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = '3770aa61038a0816864d556d797ecb9f';

//'f23ee9deb4e1a7450f3157c44ed020e1'
const MAX_DAILY_FORECAST = 6;
var fiveDayForecast = document.getElementById('fiveDayForecastEl');

// create an array of searched locations

function getLocation() {
    var userLoc = locationIn.value;
    localStorage.setItem(locationIn.value, userLoc);

    lookupLocation(userLoc);
};

const lookupLocation = (search) => {


    document.getElementById('fiveDayForecastEl').innerHTML = '';
    // Lookup the location to get the Lat/Lon
    var apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data[0].name) {
                document.getElementById('error').textContent = "Please enter a valid location."

                setTimeout(function() {
                    document.getElementById('error').textContent = ""
                }, 5000);
            };
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
                    var iconCode = data.current.weather[0].icon;
                    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

                    document.getElementById('weatherCurrentIcon').innerHTML = `<img src='${iconUrl}'></img>`
                    document.getElementById('dateToday').textContent = new Date(data.current.dt * 1000).toLocaleDateString('en-GB', { weekday: 'long'});
                    document.getElementById('temperature').textContent = "Temperature: " + Math.floor(((data.current.temp)-32)*(5/9)) + ` \xB0C`;
                    document.getElementById('wind-speed').textContent = "Wind speed: " + data.current.wind_speed + "mph";
                    document.getElementById('uv').textContent = "UVI: " + data.current.uvi;
                    document.getElementById('humidity').textContent = "Humidity: " + data.current.humidity + "%";

                    fiveDayForecast.innterHTML = ``;
                    

                    // Display the 5 Day Forecast

                    for (var i=1; i<MAX_DAILY_FORECAST; i++) {

                    var iconCode = data.daily[i].weather[0].icon;
                    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

                    fiveDayForecast.innerHTML += `<div class="fiveDays"><img src='${iconUrl}' style="width: 50px"></img><p>${new Date(data.daily[i].dt*1000).toLocaleDateString('en-GB', {weekday: 'long'})}</p><p>Temperature: ${Math.floor(((data.daily[i].temp.max)-32)*(5/9))} \xB0C</p><p>Wind Speed: ${data.daily[i].wind_speed} mph</p><p>UVI: ${data.daily[i].uvi}</p><p>Humidity: ${data.daily[i].humidity} %</p></div>`
                    };


                });
        });
};

function init() {
    for (i=0; i<5; i++) {
        var recents = localStorage.key(i);
        var places = localStorage.getItem(recents);

        document.getElementById('recentSearches').innerHTML += `<button>${places}</button>`
        var recentButtons = document.querySelectorAll("#recentSearches button");
        recentButtons.forEach(button => button.addEventListener("click", onRecentClick));
    }
};

function onRecentClick (event) {
    var clickedPlace = event.target;
    var buttonContent = clickedPlace.innerText;
    console.log(`Recent Search: ${buttonContent}`);
    lookupLocation(buttonContent);
    
};

init();


// Add an event handler for the search button
var locationIn = document.getElementById('location');
var searchButton = document.getElementById('search');

searchButton.addEventListener('click', getLocation)