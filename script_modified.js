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
                getForecast(lat, lon);
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
                getForecast(lat, lon);
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
    const weatherDescription = getWeatherDescription(data.weather[0].id);
    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${weatherDescription}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Feels Like: ${data.main.feels_like}°C</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
        <p>Wind Direction: ${data.wind.deg}°</p>
        <p>Cloudiness: ${data.clouds.all}%</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
        <p>Visibility: ${data.visibility} m</p>
        <p>Data Time: ${new Date(data.dt * 1000).toLocaleString()}</p>
        <h2>3-Hourly Forecast</h2>
        <div id="hourly-forecast"></div>
    `;
}

function getWeatherDescription(weatherId) {
    if (weatherId >= 200 && weatherId <= 232) {
        return "thunderstorm";
    } else if (weatherId >= 300 && weatherId <= 321) {
        return "drizzle";
    } else if (weatherId >= 500 && weatherId <= 531) {
        return "rain";
    } else if (weatherId >= 600 && weatherId <= 622) {
        return "snow";
    } else if (weatherId === 701) {
        return "mist";
    } else if (weatherId === 711 || weatherId === 721 || weatherId === 731 || weatherId === 741) {
        return "smoke";
    } else if (weatherId === 751 || weatherId === 761) {
        return "dust";
    } else if (weatherId === 800) {
        return "clear sky";
    } else if (weatherId >= 801 && weatherId <= 804) {
        return "cloud";
    } else if (weatherId >= 952 && weatherId <= 956) {
        return "breeze";
    } else {
        return "unknown";
    }
}

function getForecast(lat, lon) {
    const apiKey = '54915be7353444b12851944334c325ef'; // API 키
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.list && data.list.length > 0) {
                const hourlyForecast = data.list.slice(0, 5); // 5개의 3시간 간격의 예보 가져오기
                let minTemp = hourlyForecast[0].main.temp_min;
                let maxTemp = hourlyForecast[0].main.temp_max;
                let forecastHtml = '';

                hourlyForecast.forEach(hour => {
                    const date = new Date(hour.dt * 1000);
                    const temperature = hour.main.temp;

                    // 받아온 온도들 중 최고, 최저 출력하도록(132번줄 내용에서 나온거 중)
                    if (hour.main.temp_min < minTemp) {
                        minTemp = hour.main.temp_min;
                    }
                    if (hour.main.temp_max > maxTemp) {
                        maxTemp = hour.main.temp_max;
                    }

                    forecastHtml += `<p>${date.toLocaleString()} - ${temperature}°C</p>`;
                });

                document.getElementById('hourly-forecast').innerHTML = `
                    ${forecastHtml}
                    <p>Min Temperature: ${minTemp}°C</p>
                    <p>Max Temperature: ${maxTemp}°C</p>
                `;
            } else {
                alert('Hourly forecast data not available');
            }
        })
        .catch(error => {
            console.error('Error fetching the hourly forecast:', error);
            alert('An error occurred while fetching the hourly forecast');
        });
}

// getLocation 호출, 화면에 날씨 출력
window.onload = function() {
    getLocation();
};