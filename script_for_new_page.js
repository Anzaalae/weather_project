const lat = parseFloat(localStorage.getItem("lat"));
const lon= parseFloat(localStorage.getItem("lon"));

// 전역 변수 선언
let timeList = [];
let temperatureList = [];

// // 그래프 생성 함수
// function createWeatherChart() {
//     const ctx = document.getElementById('weatherChart').getContext('2d');
//     new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: timeList,
//             datasets: [{
//                 label: '온도 (°C)',
//                 data: temperatureList,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 fill: true
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: false,
//                     title: {
//                         display: true,
//                         text: '온도 (°C)'
//                     }
//                 },
//                 x: {
//                     title: {
//                         display: true,
//                         text: '시간'
//                     }
//                 }
//             }
//         }
//     });
// }

// 데이터 가져오기 함수
async function fetchWeatherData() {
    try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        timeList = data.map(item => item.time);
        temperatureList = data.map(item => item.temperature);
        createWeatherChart();
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// 페이지 로드 시 데이터 가져오기
window.addEventListener('load', fetchWeatherData);


function getForecast(lat, lon) {
    const apiKey = '54915be7353444b12851944334c325ef'; // API 키
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.list && data.list.length > 0) {
                const hourlyForecast = data.list.slice(0, 5); // 3시간 가격으로 5개의 온도 데이터
                let forecastHeader = `<h2>기상 예보(3시간 단위)<h2>`;
                let forecastHtml = '';
                hourlyForecast.forEach(hour => {
                    const date = new Date(hour.dt * 1000);
                    const temperature = hour.main.temp;
                    forecastHtml += `<p>${date.toLocaleString()} - ${temperature}°C</p>`;
                    timeList.push(date.toLocaleString());
                    temperatureList.push(temperature);
                });
                document.getElementById('hourly-forecast').innerHTML = forecastHeader + forecastHtml;
                // document.getElementById('hourly-forecast').innerHTML = forecastHtml;
            } else {
                alert('Hourly forecast data not available');
            }
        })
        .catch(error => {
            console.error('Error fetching the hourly forecast:', error);
            alert('An error occurred while fetching the hourly forecast');
        });
}

getForecast(lat, lon);

document.addEventListener("DOMContentLoaded", function() {
    const cityName = localStorage.getItem("cityName");
    document.getElementById("city-name").innerText = cityName;

    const temperature = parseFloat(localStorage.getItem("temperature"));
    const weather = localStorage.getItem("weather");
    const humidity = localStorage.getItem("humidity");
    const windSpeed = localStorage.getItem("windSpeed");
    const feelsLike = localStorage.getItem("feelsLike");
    const minTemp = localStorage.getItem("temp_min");
    const maxTemp = localStorage.getItem("temp_max");
    const pressure = localStorage.getItem("pressure");
    const windDirection = localStorage.getItem("windDirection");
    const cloudiness = localStorage.getItem("cloudiness");
    const visibility = localStorage.getItem("visibility");
    const weatherDetails = `
        <p class="weather-text"><img src="./icons_img/wi-celsius.jpg" alt="">Temperature: ${temperature}°C</p>
        <p class="weather-text"><img src="./icons_img/wi-day-sunny.jpg" alt="">Weather: ${weather}</p>
        <p class="weather-text"><img src="./icons_img/wi-humidity.jpg" alt="">Humidity: ${humidity}%</p>
        <p class="weather-text"><img src="./icons_img/wi-gale-warning.jpg" alt="">Wind Speed: ${windSpeed} m/s</p>
        <p class="weather-text"><img src="./icons_img/wi-thermometer-internal.jpg" alt="">Feels Like: ${feelsLike}°C</p>
        <p class="weather-text"><img src="./icons_img/wi-thermometer-exterior.jpg" alt="">Min Temperature: ${minTemp}°C</p>
        <p class="weather-text"><img src="./icons_img/wi-thermometer.jpg" alt="">Max Temperature: ${maxTemp}°C</p>
        <p class="weather-text"><img src="./icons_img/wi-tornado.jpg" alt="">Pressure: ${pressure} hPa</p>
        <p class="weather-text"><img src="./icons_img/wi-strong-wind.jpg" alt="">Wind Direction: ${windDirection}°</p>
        <p class="weather-text"><img src="./icons_img/wi-cloudy.jpg" alt="">Cloudiness: ${cloudiness}%</p>
        <p class="weather-text"><img src="./icons_img/wi-fog.jpg" alt="">Visibility: ${visibility} m</p>
    `;
    document.getElementById("weather-details").innerHTML = weatherDetails;

    const allElements = document.getElementsByClassName('weather-container');
    for (let i = 0; i < allElements.length; i++) {
        if (temperature >= 25) {
            allElements[i].style.color = '#ff0000'; // 빨간색으로 변경
        } else if (temperature >= 15) {
            allElements[i].style.color = '#FFBB00'; // 주황색으로 변경
        } else if (temperature >= 5) {
            allElements[i].style.color = '#00D8FF'; // 하늘색으로 변경
        } else {
            allElements[i].style.color = '#0054FF'; // 파랑색으로 변경
        }
    }

    // 날씨 상태에 따른 배경 이미지 변경
    let backgroundImage = '';
    let info = ''
    switch (weather.toLowerCase()) {
        case 'clear sky':
            backgroundImage = 'url("./daytime/clear_sky.jpg")';
            info = '오늘은 구름 한 점 없이 맑은 하늘이 펼쳐져 있습니다. 따듯한 햇살 아래 야외에서 산책이나 운동을 즐기기에 최적의 날씨입니다. 햇살이 좋아 기분 좋은 하루를 보내실 수 있을 것 같습니다.'
            break;
        case 'cloud':
            backgroundImage = 'url("./daytime/cloud.jpg")';
            info = '하늘에 구름이 가득하지만, 비가 올 것 같지는 않습니다. 실내에서 편안하게 휴식을 취하거나 취미 활동을 즐기기에 좋은 날씨입니다. 실내 공간에서 여유로운 시간을 보내세요.'
            break;
        case 'rain':
            backgroundImage = 'url("./daytime/rain.jpg")';
            info = '오늘은 비가 내리고 있어 야외 활동이 어려울 수 있습니다. 우산이나 우비를 준비하고 실내에서 편안하게 휴식을 취하는 것이 좋겠습니다. 실내에서 영화 감상이나 독서 등 다양한 활동을 즐기세요.'
            break;
        case 'mist':
            backgroundImage = 'url("./daytime/mist.jpg")';
            info = '안개가 낮게 낮게 깔려있어 시야가 좋지 않습니다. 운전 시 안전에 각별히 유의하시고, 실내에서 편안한 시간을 보내는 것이 좋겠습니다. 가족이나 친구들과 함께 즐거운 시간을 가져보세요.'
            break;
        case 'dust':
            backgroundImage = 'url("./daytime/dust.jpg")';
            info = '오늘은 공기 중에 먼지가 많아 외출 시 마스크 착용이 필요합니다. 실내에 머무르며 건강관리에 신경 쓰시고, 공기청정기 사용 등 실내 환경 관리에 신경 써주세요.'
            break;
        case 'drizzle':
            backgroundImage = 'url("./daytime/drizzle.jpg")';
            info = '가벼운 이슬비가 내리고 있습니다. 야외 활동보다는 실내에서 여유로운 시간을 가지는 것이 좋겠습니다. 따듯한 음료를 마시며 편안한 책 읽기나 음악 감상을 즐겨보세요.'
            break;
        case 'breeze':
            backgroundImage = 'url("./daytime/breeze.png")';
            info = '상쾌한 산들바람이 불고 있습니다. 야외에서 산책이나 운동을 즐기기에 좋은 날씨입니다. 공원이나 산책로를 찾아 가벼운 운동을 해보세요.'
            break;
        case 'thunderstorm':
            backgroundImage = 'url("./daytime/thunderstorm.jpg")';
            info = '천둥, 번개를 동반한 강한 폭풍이 예상되니 야외 활동은 자제하시고 안전한 장소에 머무르시기 바랍니다. 실내에서 TV 시청이나 게임 등 가벼운 실내 활동을 즐기세요.'
            break;
        default:
            break;
    }

    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.opacity = '0.8'; // 배경 이미지의 투명도를 0.7로 설정

    const weatherForecast = `
        <p id="hourly-forecast"></p>
    `

    document.querySelector(".weather-forecast").innerHTML = weatherForecast;

    document.querySelector(".info").innerHTML = info;
});