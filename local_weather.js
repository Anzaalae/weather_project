let cityName, weather, temperature, feelsLike, humidity, 
windDirection, windSpeed, pressure, cloudiness, 
sunrise, sunset; // 날씨 정보 전역변수

let addButton, deleteButton;

let previewList;

let previewContainer = document.querySelector(".preview-container");

if(previewContainer.childElementCount < 1) {
    previewContainer.classList.remove("preview-container");
    previewContainer.classList.add("preview-container-init");
}
else {
    previewContainer.classList.remove("preview-container-init");
    previewContainer.classList.add("preview-container");
}

const searchButton = document.querySelector("#searchButton");
const currentLocation = document.querySelector("#currentLocation");

const addBtn = document.querySelector("#addBtn");

const searchEvent = function searchEvent(event) {
    event.preventDefault();
    const city = document.querySelector("#searchBar").value;
    const apiKey = '54915be7353444b12851944334c325ef'; // 날씨 검색 API 키
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
};

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
    const apiKey = '54915be7353444b12851944334c325ef'; // 날씨 검색 API 키
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

const displayWeather = function displayWeather(data) {
    cityName = data.name;
    weather = data.weather[0].description;

    temperature = data.main.temp;
    feelsLike = data.main.feels_like;
    humidity = data.main.humidity;

    windDirection = data.wind.deg;
    windSpeed = data.wind.speed;

    pressure = data.main.pressure;
    cloudiness = data.clouds.all;

    const detailLeft = document.querySelector(".detail-container-left");
    detailLeft.innerHTML = `
        <h2 class="city-name no-margin">${cityName}</h2>
        <p class="weather">Weather: ${weather}</p>
        <p class="data-time no-margin">Data Time: ${new Date(data.dt * 1000).toLocaleString()}</p>
    `;

    const temperatureContainer = document.querySelector(".temperature-container");
    temperatureContainer.innerHTML = `
        <p class="temperature no-margin">Temperature: ${temperature}°C</p>
        <p class="feels-like">Feels Like: ${feelsLike}</p>
        <p class="humidity">Humidity: ${humidity}%</p>
    `;

    const windContainer = document.querySelector(".wind-container");
    windContainer.innerHTML = `
        <p class="wind-direction no-margin">Wind Direction: ${windDirection}</p>
        <p class="wind-speed">Wind Speed: ${windSpeed}</p>
    `;

    const pressureContainer = document.querySelector(".pressure-container");
    pressureContainer.innerHTML = `
        <p class="pressure no-margin">Pressure: ${pressure}</p>
        <p class="cloudiness">Cloudiness: ${cloudiness}</p>
    `;

    // 검색된 날씨에 따라 배경 이미지를 다르게 설정
    detailLeft.removeAttribute("class");
    detailLeft.classList.add("detail-container-left");

    switch (weather) {
        case "clear sky":
            detailLeft.classList.add("clear-sky");
            break;
        case "few clouds":
            detailLeft.classList.add("few-clouds");
            break;
        case "scattered clouds":
            detailLeft.classList.add("scattered-clouds");
            break;
        case "broken clouds":
            detailLeft.classList.add("broken-clouds");
            break;
        case "overcast clouds":
            detailLeft.classList.add("overcast-clouds");
            break;
        case "mist":
            detailLeft.classList.add("mist");
            break;
        case "fog":
            detailLeft.classList.add("fog");
            break;
        case "haze":
            detailLeft.classList.add("haze");
            break;
        case "light rain":
            detailLeft.classList.add("light-rain");
            break;
        case "moderate rain":
            detailLeft.classList.add("moderate-rain");
            break;
        case "heavy intensity rain":
            detailLeft.classList.add("heavy-intensity-rain");
            break;
        default:
    }

    addButton = document.createElement("button");
    addButton.classList.add("add-button");
    document.querySelector(".detail-container-left").appendChild(addButton);

    addButton.appendChild(document.createTextNode("ADD"));

    addButton.addEventListener("click", addEvent);
};

function getForecast(lat, lon) {
    const apiKey = '54915be7353444b12851944334c325ef'; // API 키
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    console.log(lat);
    console.log(lon);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.list && data.list.length > 0) {
                const hourlyForecast = data.list.slice(0, 5); // 3시간 간격으로 5개의 온도 데이터
                let forecastHtml = '';
                hourlyForecast.forEach(hour => {
                    const date = new Date(hour.dt * 1000);
                    const hours = date.getHours();
                    const temperature = hour.main.temp;
                    forecastHtml += `<p class="forecast-data">${date.toLocaleString()} - ${temperature}°C</p>`;
                });
                document.querySelector(".forecast-container").innerHTML = `
                    <h2 class="forecast-header">Forecast(3 Hourly)</h2>
                ` + forecastHtml;
            } else {
                alert('Hourly forecast data not available');
            }
        })
        .catch(error => {
            console.error('Error fetching the hourly forecast:', error);
            alert('An error occurred while fetching the hourly forecast');
        });
}

const addEvent = function addEvent(data) {
    // 추가하려는 지역과 기존의 지역의 중복 검사
    previewList = document.querySelectorAll(".preview-box");

    for (let i = 0; i < previewList.length; i++) {
        if (this.parentNode.children[0].innerText 
            == previewList[i].children[0].children[0].innerText) {
                alert("The city is already in preview list");
                return;
        }
    }

    previewContainer.classList.remove("preview-container-init");
    previewContainer.classList.add("preview-container");

    let preview = document.createElement("div");
    preview.classList.add("preview");
    preview.setAttribute("id", "preview");

    preview.innerHTML = `
    <h3 class="city-name-preview">${cityName}</h3>
    <p class="temperature-preview">${temperature}°C</p>
    <p class="display-none">${weather}</p>
    <p class="display-none">${humidity}</p>
    <p class="display-none">${windSpeed}</p>
    `

    switch (weather) {
        case "clear sky":
            preview.classList.add("clear-sky");
            break;
        case "few clouds":
            preview.classList.add("few-clouds");
            break;
        case "scattered clouds":
            preview.classList.add("scattered-clouds");
            break;
        case "broken clouds":
            preview.classList.add("broken-clouds");
            break;
        case "overcast clouds":
            preview.classList.add("overcast-clouds");
            break;
        case "mist":
            preview.classList.add("mist");
            break;
        case "fog":
            preview.classList.add("fog");
            break;
        case "haze":
            preview.classList.add("haze");
            break;
        case "light rain":
            preview.classList.add("light-rain");
            break;
        case "moderate rain":
            preview.classList.add("moderate-rain");
            break;
        case "heavy intensity rain":
            preview.classList.add("heavy-intensity-rain");
            break;
        default:
    }

    let previewBox = document.createElement("div");
    previewBox.classList.add("preview-box");

    previewBox.appendChild(preview);

    previewContainer.appendChild(previewBox);

    deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("DELETE"));
    deleteButton.classList.add("delete-button");

    previewBox.appendChild(deleteButton);

    previewList = document.querySelectorAll(".preview-box"); // 지역이 추가됨에 따라 previewList 갱신
    for(let i = 0; i < previewList.length; i++) {
        previewList[i].children[0].addEventListener("click", checkDetailEvent);
    }

    deleteButton.addEventListener("click", deleteEvent);

};

const deleteEvent = function deleteEvent(event) {
    event.preventDefault();
    let count = 0;
    let preview = this.parentNode;

    previewContainer.removeChild(preview);

    for (let i = 0; i < previewContainer.childElementCount; i++) {
        if (previewContainer.children[i].getAttribute("class") == "preview-box") {
            count++;
        }
    }

    if(count < 1) {
        previewContainer.setAttribute("class", "preview-container-init");
    }
};

const checkDetailEvent = function checkDetailEvent() {
    const city = this.children[0].innerText;
    const apiKey = '54915be7353444b12851944334c325ef'; // 날씨 검색 API 키
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
};

searchButton.addEventListener("click", searchEvent);
currentLocation.addEventListener("click", getLocation);
