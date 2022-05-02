// Set variables
let forecast = document.getElementById("forecast");
let fiveDayForecast = document.getElementById("fiveDay");
let searchBtn = document.getElementById("submit");
let history = document.getElementById("history");
let historyId = 0;

// Event listener for the history buttons
$("#history").on("click", "button", function(event) {
    let cityName = $(this)
    .text()
    // Replaces the spaces in the string with "&" so it can be used in the location api
    let searchName = cityName.replace(" ","&");
    findCity(searchName,cityName);
});

// Puts the search history on the page
let historySetupHandler = function() {
    // Loops through the local storage
    for (let i = 0; i < localStorage.length; i++) {
        let historySearch = "cityName"+[i];
        let historyGet = localStorage.getItem(historySearch);
        historyId = historyId + 1;
        // Creates a button for each item in the search history
        let historyItem = document.createElement("button");
        historyItem.textContent = historyGet;
        historyItem.classList = "form-control bg-secondary text-white";
        history.appendChild(historyItem);
    }
}

// Converts the search input into a string that can be used in the api url
let searchHandler = function() {
    let cityName = document.getElementById("searchArea").value;
    // Adds to the search history
    let historyItem = document.createElement("button");
    historyItem.textContent = cityName;
    historyItem.classList = "form-control bg-secondary text-white";
    history.appendChild(historyItem);
    localStorage.setItem("cityName"+historyId,cityName);
    historyId = historyId + 1;
    // Replaces the spaces in the string with "&" so it can be used in the location api
    searchName = cityName.trim();
    searchName = searchName.replace(" ","&");
    findCity(searchName,cityName);
}

// Generates the weather forecast based on the location of the city
let weatherDataHandler = function(Lat,Lng,name) {
    // Clears the forecast div
    forecast.innerHTML = ""

    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + Lat + "&lon=" + Lng + "&exclude=alerts&appid=15a51a2904ebe1ce98208b42e328c7f1";
    // Fetch the weather data
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                // Sort relevant the data into an object
                let today = {
                    name: name,
                    temp: data.current.temp,
                    wind: data.current.wind_speed,
                    humidity: data.current.humidity,
                    uv: data.current.uvi
                }
                // Put the forecast on the screen
                let forecastName = document.createElement("h5");
                forecastName.textContent = today.name + " " + moment().format('l');
                forecast.appendChild(forecastName);

                let forecastTemp = document.createElement("p");
                forecastTemp.textContent = "Temp: " + today.temp;
                forecast.appendChild(forecastTemp);

                let forecastWind = document.createElement("p");
                forecastWind.textContent = "Wind: " + today.wind;
                forecast.appendChild(forecastWind);

                let forecastHumidity = document.createElement("p");
                forecastHumidity.textContent = "Humidity: " + today.humidity;
                forecast.appendChild(forecastHumidity);

                let forecastUv = document.createElement("p");
                forecastUv.textContent = "UV Index: " + today.uv;
                // Adds a class to the UV index based on how high it is
                if (today.uv > 3) {
                    forecastUv.classList = "bg-warning";
                }
                else if (today.uv > 5) {
                    forecastUv.classList = "bg-danger";
                }
                else {
                    forecastUv.classList = "bg-success";
                }
                forecast.appendChild(forecastUv);

                // Clears the div before adding to it
                fiveDay.innerHTML = " ";
                // Loops for each of the five days
                for (let i = 0; i < 5; i++) {
                    // Set up an object to hold the data for the day
                    let fiveDay = {
                        temp: data.daily[i].temp.day,
                        wind: data.daily[i].wind_speed,
                        humidity: data.daily[i].humidity,
                        uv: data.daily[i].uvi
                    }
                    // creates a card
                    let fiveDayCard = document.createElement("div");
                    fiveDayCard.classList = "card col"

                    let fiveDayName = document.createElement("h6");
                    fiveDayName.textContent = moment().add(i+1, 'days').calendar();
                    fiveDayCard.appendChild(fiveDayName);

                    let fiveDayTemp = document.createElement("p");
                    fiveDayTemp.textContent = "Temp: " + fiveDay.temp;
                    fiveDayCard.appendChild(fiveDayTemp);

                    let fiveDayWind = document.createElement("p");
                    fiveDayWind.textContent = "Wind: " + fiveDay.wind;
                    fiveDayCard.appendChild(fiveDayWind);

                    let fiveDayHumidity = document.createElement("p");
                    fiveDayHumidity.textContent = "Humidity: " + fiveDay.humidity;
                    fiveDayCard.appendChild(fiveDayHumidity);

                    let fiveDayUv = document.createElement("p");
                    fiveDayUv.textContent = "UV Index: " + fiveDay.uv;
                    fiveDayCard.appendChild(fiveDayUv);
                    // Appends the card to the div
                    fiveDayForecast.appendChild(fiveDayCard);
                }
            })}})
}

// Finds the coordinates of the city
let findCity = function(searchName,cityName) {
    
    fetch("https://trueway-places.p.rapidapi.com/FindPlaceByText?text=" + searchName +"&language=en", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "trueway-places.p.rapidapi.com",
            "x-rapidapi-key": "69268d97d3msh988353c1fdc00fdp162c1ejsna7d9abc476a6"
        }
    })
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                // pick out the impostant parts of the data returned
                let cityLat = (data.results[0].location.lat);
                let cityLng = (data.results[0].location.lng);
                // Calls the next function
                weatherDataHandler(cityLat,cityLng,cityName);
        })}});
        
    }

// Event listener for the search button
searchBtn.addEventListener("click",searchHandler);
// Calls the historySetupHandler function to add the search history buttons to the page
historySetupHandler();