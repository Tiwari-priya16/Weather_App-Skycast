const API_KEY ='fbfe5d6fecdd44cb8b800838260302';
const weatherInfo = document.getElementById("weather-info");
const error= document.getElementById('error');
const loading= document.getElementById('loading');

async function getWeatherByCity(cityName){
    showLoading();

    try{
        const weatherUrl= `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&aqi=no&alerts=no`;

        const response= await fetch(weatherUrl);
        const data = await response.json();
        
        if(response.status !== 200 || data.error){
            throw new Error(data.error?.mmessage || "City Not Found");
        }
        displayWeather(data);
    }
    catch(err){
        showError(err.message);
    }
    loading.innerHTML='';
}

function getWeather(){
    const cityInput = document.getElementById('city-input').value;
    if(!cityInput) return;
    getWeatherByCity(cityInput);
}

function displayWeather(data){
    weatherInfo.style.display='block';
    error.style.display='none';
    error.style.display='none';

    const today = data.forecast.forecastday[0];
    const localTimestr=data.location.localtime;

    const dateObj= new Date(localTimestr.replace(" ","T"));
    const formattedDate = dateObj.toLocaleDateString("en-US",{
        weekday:"long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const formattedTime= dateObj.toLocaleTimeString("en-US",{
        hour:"numeric",
        minute: "2-digit",
        hour12 : true
    });

    document.getElementById('city-name').textContent= data.location.name;
    document.getElementById('date').innerHTML=`📅 ${formattedDate} <br>  ⏰ ${formattedTime}`;
    document.getElementById('region').textContent= data.location.region;
    document.getElementById('temperature').textContent= `${data.current.temp_c}°C`;
    document.getElementById('min-temp_value').textContent = `${today.day.mintemp_c}°C`;
    document.getElementById('max-temp_value').textContent = `${today.day.maxtemp_c}°C`;
    document.getElementById('sunrise_time').textContent = today.astro.sunrise;
    document.getElementById('sunset_time').textContent = today.astro.sunset;
    document.getElementById('weather-description').textContent= data.current.condition.text;
    document.getElementById('weather-icon').src= data.current.condition.icon;
    document.getElementById('feels-like').textContent = `${data.current.feelslike_c}°C`;
    document.getElementById('Humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.current.wind_kph}km/h`;
    document.getElementById('uv-index').textContent = `${today.day.uv}`;

    const forecastContainer= document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    data.forecast.forecastday.forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.className= 'forecast-day';
        forecastDay.innerHTML= `
            <h3>${new Date(day.date).toLocaleDateString('en-US', {weekday: 'long'})}</h3>
            <img class="forecast-icon" src="${day.day.condition.icon}" alt="Weather Icon">
            <p> ${Math.round(day.day.maxtemp_c)}°C / ${Math.round(day.day.mintemp_c)}°C </p>
            <p>${day.day.condition.text}</p>
        `;
        forecastContainer.appendChild(forecastDay);
    });
    
    // Changing Theme
    const temp = data.current.temp_c;
    const condition = data.current.condition.text.toLowerCase();

    applyWeatherTheme(temp, condition);

    //Night Mode
    const localTime = data.location.localtime; // "2025-02-26 18:30"
    const hour = parseInt(localTime.split(" ")[1].split(":")[0]);

    const isNight = hour >= 18 || hour < 6;

    if (isNight) {
    document.body.style.filter = "brightness(0.85)";
    } else {
    document.body.style.filter = "brightness(1)";
    }
}

function showError(message){
    error.style.display = 'block';
    error.textContent =message;
    weatherInfo.style.display= 'none';
    loading.style.display = 'none';
}

function showLoading(){
    loading.style.display = 'block';
    error.style.display = 'none';
    weatherInfo.style.display = 'none';
}

document.getElementById('city-input').addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        getWeather();
    }
});

window.addEventListener('load', ()=>{
    document.getElementById('city-input').value = 'London';
    getWeatherByCity("London");
});

// for background change based on temperature
function applyWeatherTheme(temp, condition) {
  document.body.className = ""; // reset

  if (condition.includes("rain")) {
    document.body.classList.add("rainy");
  } 
  else if (condition.includes("cloud")) {
    document.body.classList.add("cloudy");
  } 
  else if (temp >= 35) {
    document.body.classList.add("hot");
  } 
  else if (temp >= 20) {
    document.body.classList.add("warm");
  } 
  else {
    document.body.classList.add("cold");
  }
}
