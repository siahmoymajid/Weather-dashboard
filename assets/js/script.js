(function ($) {
  let input = document.querySelector("input");
  let searchBtn = document.getElementById("search");
  let current = document.getElementById("current");
  let forecast = document.getElementById("forecast");
  let storage = JSON.parse(localStorage.getItem("history")) || [];
  const today = dayjs().format();
  const apiKey = "431dd6371869dd989989366774b6e8c7";

  const handleSearch = async (city) => {
    current.innerHTML = "";
    // if (!city) return;

    let url = `https://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}&units=imperial&q=${city}`;

    let data = await (await fetch(url)).json();
    console.log(data);
    let {
      dt,
      coord: { lat, lon },
      main: { temp, humidity },
      wind: { speed },
      weather: [{ icon }],
    } = data;

    //if city is in localstorage, do nothing, otherwise push
    if (storage.indexOf(city) === -1) {
      storage.push(city);
    }
    localStorage.setItem("history", JSON.stringify(storage));
    displayRecent(storage); //display list of cities from local storage

    createFiveDays(lat, lon);
    // creaet a div
    // place the city name in the textcontent
    // append div to the contianer
    // localStorage.setItem("lastSearchedCity", city)

    current.innerHTML = `
	<div class="text-start p-3 bg-light border-info border-2 shadow-sm rounded-3 bg-opacity-50">
	<h2 class="display-3 text-capitalize">${city} </h2> 
	<p class="text-dark-subtle lead">${new Date(
    dt * 1000
  ).toDateString()}</p> <img src="https://openweathermap.org/img/w/${icon}.png" >
    <p>Temp: ${temp}</p> 
    <p>Wind: ${speed}</p>
    <p>Humidity: ${humidity}</p></div>
		`;
  };
  function createFiveDays(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?&appid=${apiKey}&units=imperial&lat=${lat}&lon=${lon}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        fiveDays(data);
      });
  }

  function displayRecent(arr) {
    let listGroup = $("#search-history");
    listGroup.html("");

    for (const element of arr) {
      let listGroupItem = $("<button>");
      listGroupItem.addClass("list-group-item text-capitalize recent");
      listGroupItem.text(element);
      listGroup.append(listGroupItem);
    }
  }
  //display 5 days data
  function fiveDays(data) {
    $("#forecast").html("");
    let dataRow = $("<div>");
    let title = $("<h3>").addClass("text-light text-center");

    for (let i = 0; i < data.list.length; i++) {
      let dataCol = $("<div>");
      dataCol.addClass(
        "text-center p-3 bg-light border-info border-2 shadow-sm rounded-3 bg-opacity-50"
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
        $("#forecast").append(dataCol);
      }
    }
  }

  displayRecent(storage);
  $("#searchBtn").on("click", function () {
    let city = input.value.trim();
    handleSearch(city);
  });
  $("body").on("click", ".recent", function () {
    handleSearch($(this).text());
  });
})(jQuery);
