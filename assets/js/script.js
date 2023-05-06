(function($) {

	let input = document.querySelector("input");
	let search = document.getElementById("search");
	let current = document.getElementById("current");
	let forecast = document.getElementById("forecast");
	let storage = JSON.parse(localStorage.getItem("history")) || [];
	const today =  dayjs().format();

	const handleSearch = async () => {
		let city = input.value;
		if (!city) return;
		
		let url = `https://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}&units=imperial&q=${city}`;
		
		let data = await (await fetch(url)).json();
  let {
		dt,
		coord: {lat, lon},
    main: { temp, humidity },
    wind: { speed },
    weather: [{ icon }],
  } = data;
	createFiveDays(lat,lon)
	// creaet a div
	// place the city name in the textcontent
	// append div to the contianer
	// localStorage.setItem("lastSearchedCity", city)
	
  current.innerHTML = `
	<h1>${city} (${new Date(
		dt * 1000
		).toDateString()}) <img src="https://openweathermap.org/img/w/${icon}.png" >
    <h3>Temp: ${temp}</h3>
    <h3>Wind: ${speed}</h3>
    <h3>Humidity: ${humidity}</h3>
		`;
	};
	function createFiveDays (lat,lon) { 
		let url = `https://api.openweathermap.org/data/2.5/forecast?&appid=${apiKey}&units=imperial&lat=${lat}&lon=${lon}`;
		fetch (url)
		.then(response => response.json())
		.then(data => {
			fiveDays(data)}
			);
		}
		
		
		function diplayRecent(arr) {
			let listGroup = $(".history");
			listGroup.html("");
			
			for (const element of arr) {
				let listGroupItem = $("<li>");
				let linkName = $("<a>");
				listGroupItem.addClass("list-group-item text-capitalize");
				linkName.attr("href", "#");
				linkName.addClass("recent");
				linkName.attr("data-name", element);
				linkName.text(element);
				listGroup.append(listGroupItem);
				listGroupItem.append(linkName);
			}
		}
		
		//display 5 days data
		function fiveDays(data) {
			let dataRow = $("<div>");
			let title = $("<h3>").addClass("text-light text-center");
			
			dataRow.addClass("row my-3 justify-content-between");
			
			for (let i = 0; i < data.list.length; i++) {
				let dataCol = $("<div>");
				dataCol.addClass(
					"col-md-2 five-days mx-2 rounded text-dark p-3 text-center border"
					);
					let icon = `<img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">`;
					if (data.list[i].dt_txt.includes("18:00:00")) {
						let date = data.list[i].dt_txt;
						dataCol.html(`
						
						<h6>${dayjs(date).format("ddd, MMM Do")}</h6>
						<div class="m-0">${icon}</div>
						<ul class="list-unstyled m-0">
						<li>Temp: <b>${data.list[i].main.temp} °F</b></li>
						<li>Humidity:<b> ${data.list[i].main.humidity} %</b></li>
						</ul>
						
						`);
						
						//console.log(data.list[i]);
						dataRow.append(dataCol);
						$("#forecast").append(dataRow)
					}
				}
			}
			
			const lastSearchedCity = localStorage.getItem("lastSearchedCity");
			if (lastSearchedCity) {
				input.value = lastSearchedCity;
				handleSearch();
			}
			
			search.onclick = handleSearch;
			
		})(jQuery)