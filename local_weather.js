let cityName, temperature, weather, humidity, windSpeed; // 날씨 정보 전역변수
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
const addBtn = document.querySelector("#addBtn");

const searchEvent = function searchEvent(event) {
    event.preventDefault();
    const city = document.querySelector("#searchBar").value;
    const apiKey = '54915be7353444b12851944334c325ef';                                                    // 제 API키 입니다
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                cityName = data.name;
                temperature = data.main.temp;
                weather = data.weather[0].description;
                humidity = data.main.humidity;
                windSpeed = data.wind.speed;

                const detailLeft = document.querySelector(".detail-container-left");
                detailLeft.innerHTML = `
                    <h2 class="city-name">${cityName}</h2>
                    <p class="weather">Weather: ${weather}</p>
                `;

                const temperatureContainer = document.querySelector(".temperature-container");
                temperatureContainer.innerHTML = `
                    <h2 class="no-margin">Temperature: ${temperature}°C</h2>
                `;

                const humidityContainer = document.querySelector(".humidity-container");
                humidityContainer.innerHTML = `
                    <h2 class="no-margin">Humidity: ${humidity}%</h2>
                `;

                const windSpeedContainer = document.querySelector(".wind-speed-container");
                windSpeedContainer.innerHTML = `
                    <h2 class="no-margin">Wind Speed: ${windSpeed}m/s</h2>
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

                addButton.appendChild(document.createTextNode("추가"));

                addButton.addEventListener("click", addEvent);

            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            alert('An error occurred while fetching the weather data');
        });
};

const addEvent = function addEvent(event) {
    event.preventDefault();
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
    deleteButton.appendChild(document.createTextNode("삭제"));
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

const checkDetailEvent = function checkDetailEvent(event) {
    event.preventDefault();

    cityName = this.children[0].innerText;
    temperature = this.children[1].innerText;
    weather = this.children[2].innerText;
    humidity = this.children[3].innerText;
    windSpeed = this.children[4].innerText;

        const detailLeft = document.querySelector(".detail-container-left");
        detailLeft.innerHTML = `
            <h2 class="city-name">${cityName}</h2>
            <p class="weather">${weather}</p>
        `;

        const temperatureContainer = document.querySelector(".temperature-container");
        temperatureContainer.innerHTML = `
            <h2 class="no-margin">${temperature}</h2>
        `;

        const humidityContainer = document.querySelector(".humidity-container");
        humidityContainer.innerHTML = `
            <h2 class="no-margin">${humidity}</h2>
        `;

        const windSpeedContainer = document.querySelector(".wind-speed-container");
        windSpeedContainer.innerHTML = `
            <h2 class="no-margin">${windSpeed}</h2>
        `;

        // 검색된 날씨에 따라 배경 이미지를 다르게 설정
        detailLeft.removeAttribute("class");
        detailLeft.classList.add("detail-container-left");

        if (weather.includes("clear sky") === true) {
            detailLeft.classList.add("clear-sky");
        }
        else if (weather.includes("few clouds") === true) {
            detailLeft.classList.add("few-clouds");
        }
        else if (weather.includes("scattered clouds") === true) {
            detailLeft.classList.add("scattered-clouds");
        }
        else if (weather.includes("broken clouds") === true) {
            detailLeft.classList.add("broken-clouds");
        }
        else if (weather.includes("overcast clouds") === true) {
            detailLeft.classList.add("overcast-clouds");
        }
        else if (weather.includes("mist") === true) {
            detailLeft.classList.add("mist");
        }
        else if (weather.includes("fog") === true) {
            detailLeft.classList.add("fog");
        }
        else if (weather.includes("haze") === true) {
            detailLeft.classList.add("haze");
        }
        else if (weather.includes("light rain") === true) {
            detailLeft.classList.add("light-rain");
        }
        else if (weather.includes("moderate rain") === true) {
            detailLeft.classList.add("moderate-rain");
        }
        else if (weather.includes("heavy intensity rain") === true) {
            detailLeft.classList.add("heavy-intensity-rain");
        }
};

searchButton.addEventListener("click", searchEvent);
