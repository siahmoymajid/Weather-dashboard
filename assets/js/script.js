
let input = document.querySelector('input');
let search = document.getElementById('search');
let current = document.getElementById('current');
let forecast = document.getElementById('forecast');

const handleSearch = async () => {
  let city = input.value;
  if(!city) return;
  
  let url = `https://api.openweathermap.org/data/2.5/forecast?&appid=${apiKey}&units=imperial&q=${city}`;

  let {list} = await (await fetch(url)).json();
  let { dt, main:{temp,humidity},wind:{speed},weather:[{icon}]} = list[0];

  current.innerHTML = `
    <h1>${city} (${new Date(dt*1000).toDateString()}) <img src="https://openweathermap.org/img/w/${icon}.png" >
    <h3>Temp: ${temp}</h3>
    <h3>Wind: ${speed}</h3>
    <h3>Humidity: ${humidity}</h3>
  `;
}


search.onclick = handleSearch;