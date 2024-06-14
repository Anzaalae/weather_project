document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    const apiKey = '54915be7353444b12851944334c325ef'; // API 키
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                displayWeather(data);
                getHourlyForecast(lat, lon);
            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            alert('An error occurred while fetching the weather data');
        });
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherByCoordinates(lat, lon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function getWeatherByCoordinates(lat, lon) {
    const apiKey = '54915be7353444b12851944334c325ef'; // API 키
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                getHourlyForecast(lat, lon);
            } else {
                alert('Weather data not found for your location');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            alert('An error occurred while fetching the weather data');
        });
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weather-result');
    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Feels Like: ${data.main.feels_like}°C</p>
        <p>Min Temperature: ${data.main.temp_min}°C</p>
        <p>Max Temperature: ${data.main.temp_max}°C</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
        <p>Wind Direction: ${data.wind.deg}°</p>
        <p>Cloudiness: ${data.clouds.all}%</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
        <p>Visibility: ${data.visibility} m</p>
        <p>Data Time: ${new Date(data.dt * 1000).toLocaleString()}</p>
        <h2>Hourly Forecast</h2>
        <div id="hourly-forecast"></div>
    `;
}

function getHourlyForecast(lat, lon) {
    const apiKey = '54915be7353444b12851944334c325ef'; // API 키
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.hourly && data.hourly.length > 0) {
                const hourlyForecast = data.hourly.slice(0, 5); // 5시간 예보 가져오기
                let forecastHtml = '';
                hourlyForecast.forEach(hour => {
                    const date = new Date(hour.dt * 1000);
                    const hours = date.getHours();
                    const temperature = hour.temp;
                    forecastHtml += `<p>${hours}:00 - ${temperature}°C</p>`;
                });
                document.getElementById('hourly-forecast').innerHTML = forecastHtml;
            } else {
                alert('Hourly forecast data not available');
            }
        })
        .catch(error => {
            console.error('Error fetching the hourly forecast:', error);
            alert('An error occurred while fetching the hourly forecast');
        });
}
