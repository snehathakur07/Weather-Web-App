import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import { configDotenv } from "dotenv";
configDotenv();

const apiKey=process.env.API_KEY;

console.log(apiKey)

console.log(`https://api.openweathermap.org/data/2.5/weather?q=london&appid=${apiKey}`)

const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const cities = ["New York", "New Delhi", "Mumbai", "London"]
const weather_cities = [];
const temperature = [];
const max = [];
const min = [];
const icon_src = []

try {
    for (let i = 0; i < cities.length; i++) {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=${apiKey}`)
        weather_cities[i] = result.data.weather[0].main
        temperature[i] = Math.floor(result.data.main.temp - 273.15)
        max[i] = Math.floor(result.data.main.temp_max - 273.15)
        min[i] = Math.floor(result.data.main.temp_min - 273.15)
        icon_src[i] = result.data.weather[0].icon
    }
    // for (let i = 0; i < cities.length; i++) {
    //     console.log(cities[i])
    //     console.log(weather_cities[i])
    // }
}
catch (error) {
    console.error("Error: ", error)
}

app.get("/", async (req, res) => {

    res.render("index.ejs", {
        cities: cities,
        weather_of_city: weather_cities,
        temperatures: temperature,
        max: max,
        min: min,
        icon_src: icon_src
    })
})

app.post("/", async (req, res) => {
    const city = req.body.city
    console.log(req.body.city)
    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)

        //collecting temperature 
        const temp = Math.floor(result.data.main.temp - 273.15)

        // collecting icon id
        const icon = `https://openweathermap.org/img/wn/${result.data.weather[0].icon}@2x.png`;

        //collecting weather
        const weather = result.data.weather[0].main;

        //collecting maxTemp
        const maxTemp = Math.floor(result.data.main.temp_max - 273.15)

        //collecting feels like
        const feels_like = Math.floor(result.data.main.feels_like - 273.15)

        //collecting minTemp
        const minTemp = Math.floor(result.data.main.temp_min - 273.15)

        //collecting humidity
        const humidity = result.data.main.humidity;

        //collecting wind speed
        const wind = result.data.wind.speed;

        //collecting visibility
        const visibility = result.data.visibility;

        //collecting pressure
        const pressure = result.data.main.pressure;

        //collecting sunrise
        const sunrise = new Date(result.data.sys.sunrise * 1000);
        const sunriseTime = `${sunrise.getHours()}:${sunrise.getMinutes()}:${sunrise.getSeconds()}`

        //collecting sunset
        const sunset = new Date(result.data.sys.sunset * 1000);
        const sunsetTime = `${sunset.getHours()}:${sunset.getMinutes()}:${sunset.getSeconds()}`

        // console.log("Sunrise Time:", sunriseTime);
        // console.log("Sunset Time:", sunsetTime);

        // console.log(city, weather, icon, temp, maxTemp, minTemp, humidity, wind, visibility, sunriseTime, sunsetTime, pressure)


        res.render("index.ejs", {
            cities: cities,
            weather_of_city: weather_cities,
            temperatures: temperature,
            max: max,
            min: min,
            icon_src: icon_src,
            city: city,
            weather: weather,
            icon: icon,
            temperature: temp,
            max_temp: maxTemp,
            min_temp: minTemp,
            feels_like:feels_like,
            humidity: humidity,
            wind_speed: wind,
            visibility: visibility,
            sunrise: sunriseTime,
            sunset: sunsetTime,
            pressure: pressure
        })
        // res.send(result.data.weather[0].main+temp)
    }
    catch (error) {
        console.error("Error: ", error.message)
        res.send(error.message)
    }
})
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
