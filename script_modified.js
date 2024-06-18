let cityName, temperature, weather, humidity, windSpeed, feelsLike, temp_min, temp_max, pressure, windDirection, cloudiness, sunrise, sunset, visibility, dataTime; // 날씨 정보 전역변수
let lat, lon;   // 지역 정보 전역변수

let addButton = document.createElement("button"); // 추가 버튼 노드
    addButton.classList.add("add-button");
    document.querySelector(".container").appendChild(addButton);
    addButton.appendChild(document.createTextNode("ADD"));

let deleteButton; // 삭제 버튼 노드

let previewList; // 카드 리스트

let previewContainerLeft = document.querySelector(".preview-container-left");
let previewContainerRight = document.querySelector(".preview-container-right");

document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    const apiKey = '54915be7353444b12851944334c325ef'; // API 키
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                lat = data.coord.lat;
                lon = data.coord.lon;
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
    lat = position.coords.latitude;
    lon = position.coords.longitude;
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
    `;

    cityName = data.name;
    temperature = data.main.temp;
    weather = weatherDescription;
    humidity = data.main.humidity;
    windSpeed = data.wind.speed;
    feelsLike = data.main.feels_like;
    temp_min = data.main.temp_min;
    temp_max = data.main.temp_max;
    pressure = data.main.pressure;
    windDirection = data.wind.deg;
    cloudiness = data.clouds.all;
    sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    sunset = new Date(data.sys.sunset * 1000).toLocaleString();
    visibility = data.visibility;
    dataTime = new Date(data.dt * 1000).toLocaleString();
    lat = data.coord.lat;
    lon = data.coord.lon;

    addButton.addEventListener("click", addEvent);
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

// 추가 버튼 클릭 시 실행되는 함수
const addEvent = function addEvent(data) {
    // 추가하려는 지역과 기존의 지역의 중복 검사
    previewList = document.querySelectorAll(".preview-box");

    for (let i = 0; i < previewList.length; i++) {
        if (this.parentNode.children[2].children[0].innerText 
            == previewList[i].children[0].children[0].innerText) {
                alert("The city is already in preview list");
                return;
        }
    }

    let preview = document.createElement("div");
    preview.classList.add("preview");
    // preview.setAttribute("id", "preview");

    preview.innerHTML = `
    <h3 class="city-name-preview">${cityName}</h3>
    <p class="temperature-preview">${temperature}°C</p>
    <p class="display-none">${weather}</p>
    <p class="display-none">${humidity}</p>
    <p class="display-none">${windSpeed}</p>
    <p class="display-none">${feelsLike}</p>
    <p class="display-none">${temp_min}</p>
    <p class="display-none">${temp_max}</p>
    <p class="display-none">${pressure}</p>
    <p class="display-none">${windDirection}</p>
    <p class="display-none">${cloudiness}</p>
    <p class="display-none">${sunrise}</p>
    <p class="display-none">${sunset}</p>
    <p class="display-none">${visibility}</p>
    <p class="display-none">${dataTime}</p>
    <p class="display-none">${lat}</p>
    <p class="display-none">${lon}</p>
    `

    switch (weather) {
        case "clear sky":
            preview.classList.add("clear-sky");
            break;
        case "cloud":
            preview.classList.add("cloud");
            break;
        case "mist":
            preview.classList.add("mist");
            break;
        case "dust":
            preview.classList.add("dust");
            break;
        case "drizzle":
            preview.classList.add("drizzle");
            break;
        case "rain":
            preview.classList.add("rain");
            break;
        case "breeze":
            preview.classList.add("breeze");
            break;
        case "thunderstorm":
            preview.classList.add("thunderstorm");
        default:
            break;
    }

    let previewBox = document.createElement("div");
    previewBox.classList.add("preview-box");

    previewBox.appendChild(preview);

    previewList = document.querySelectorAll(".preview-box"); // 지역이 추가됨에 따라 previewList 갱신

    if (previewList.length < 2) {
        previewContainerLeft.appendChild(previewBox);
    }
    else if (previewList.length >= 2 && previewList.length < 4) {
        //////////
        let i = 0;
        while (previewContainerLeft.childElementCount < 2) {
            let temp = previewContainerRight.children[i];
            previewContainerRight.removeChild(temp);
            previewContainerLeft.appendChild(temp);
            i++;
        }
        previewContainerRight.appendChild(previewBox);
    }
    //////////////
    else {
        alert("The preview list is already full");
    }

    deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("DELETE"));
    deleteButton.classList.add("delete-button");

    previewBox.appendChild(deleteButton);
    previewList = document.querySelectorAll(".preview-box");
    for(let i = 0; i < previewList.length; i++) {
        previewList[i].firstChild.addEventListener("click", setBackground);
    }

    for(let i = 0; i < previewList.length; i++) {
        previewList[i].firstChild.addEventListener("dblclick", openNewPage);
    }

    deleteButton.addEventListener("click", deleteEvent);

};

// DELETE 클릭 시 실행되는 함수
const deleteEvent = function deleteEvent(event) {
    event.preventDefault();
    let count = 0;
    let previewBox = this.parentNode;

    previewBox.parentNode.removeChild(previewBox);

    let i = 0;
    while (previewContainerLeft.childElementCount < 2) {
        let temp = previewContainerRight.children[i];
        previewContainerRight.removeChild(temp);
        previewContainerLeft.appendChild(temp);
        i++;
    }
};

// 카드를 한 번 클릭 시 실행되는 함수
const setBackground = function setBackground() {
    let weatherInfo = this.children[2].innerText;

    if(weatherInfo == "clear sky") {
        weatherInfo = "clear-sky";
    }
    document.body.setAttribute("class", weatherInfo);
};

const openNewPage = function openNewPage() {
    const cityName = this.querySelector('.city-name-preview').innerText;
    const temperature = this.querySelector('.temperature-preview').innerText;
    const weather = this.querySelectorAll('.display-none')[0].innerText;
    const humidity = this.querySelectorAll('.display-none')[1].innerText;
    const windSpeed = this.querySelectorAll('.display-none')[2].innerText;
    const feelsLike = this.querySelectorAll('.display-none')[3].innerText;
    const temp_min = this.querySelectorAll('.display-none')[4].innerText;
    const temp_max = this.querySelectorAll('.display-none')[5].innerText;
    const pressure = this.querySelectorAll('.display-none')[6].innerText;
    const windDirection = this.querySelectorAll('.display-none')[7].innerText;
    const cloudiness = this.querySelectorAll('.display-none')[8].innerText;
    // const sunrise = this.querySelectorAll('.display-none')[9].innerText;
    // const sunset = this.querySelectorAll('.display-none')[10].innerText;
    const visibility = this.querySelectorAll('.display-none')[11].innerText;
    // const dataTime = this.querySelectorAll('.display-none')[12].innerText;
    const lat = this.querySelectorAll('.display-none')[13].innerText;
    const lon = this.querySelectorAll('.display-none')[14].innerText;

    // 추가 정보를 localStorage에 저장
    localStorage.setItem("cityName", cityName);
    localStorage.setItem("temperature", temperature);
    localStorage.setItem("weather", weather);
    localStorage.setItem("humidity", humidity);
    localStorage.setItem("windSpeed", windSpeed);
    localStorage.setItem("feelsLike", feelsLike);
    localStorage.setItem("temp_min", temp_min);
    localStorage.setItem("temp_max", temp_max);
    localStorage.setItem("pressure", pressure);
    localStorage.setItem("windDirection", windDirection);
    localStorage.setItem("cloudiness", cloudiness);
    // localStorage.setItem("sunrise", sunrise);
    // localStorage.setItem("sunset", sunset);
    localStorage.setItem("visibility", visibility);
    // localStorage.setItem("dataTime", dataTime);
    // 날짜와 관련된 sunrise, sunset, dataTime의 값이 올바르지 않아 제외

    localStorage.setItem("lat", lat);
    localStorage.setItem("lon", lon);

    window.open(`new_page.html?lat=${lat}&lon=${lon}`, '_blank'); // new_page.html로 lat, lon 값을 전달하도록 URL 수정
};
