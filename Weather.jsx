import React, { useEffect, useState } from 'react'
import './Weather.css'

import axios from 'axios';


export default function Weather() {
    const [city,setCity]=useState('');
    const [weather,setWeather]=useState();
    const [date,setDate]=useState();
    const [time,setTime]=useState();
    const [theme, setTheme] = useState('light');
    const [searchHistory, setSearchHistory] = useState([]);

const updateSearchHistory = (cityName) => {
  setSearchHistory(prevHistory => {
    const updatedHistory = [cityName, ...prevHistory.filter(item => item.toLowerCase() !== cityName.toLowerCase())];
    return updatedHistory.slice(0, 5); // Only keep last 5 unique cities
  });
};


    const handleCityChange=(e)=>{
        setCity(e.target.value)

    }

    const getCurrentTime=()=>{
        const now=new Date();
        let hours=now.getHours();
        let min=now.getMinutes();
        let sec=now.getSeconds();

        hours=hours<10 ? `0${hours}` : hours
        min=min<10 ? `0${min}` : min
        sec=sec<10 ? `0${sec}` : sec

        return `${hours}: ${min} : ${sec}`

    }

    const handleRefresh = () => {
      if (city.trim() !== '') {
          fetchWeather();
      } else {
          alert('Please enter a city first.');
      }
  };

   
  

    useEffect( ()=>{
        const interval=setInterval( ()=>{setTime(getCurrentTime())},1000)

        return ()=>clearInterval(interval);
    },[])

    useEffect(()=>{
      document.body.className = theme;

    },[theme]);

    const handleThemeChange = (e) => {
      e.preventDefault(); // Prevent page reload
      setTheme(theme === 'light' ? 'dark' : 'light');
  };

    const fetchWeather=async()=>{
        try{
            const response=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'029a97ed7e4851d9a8bdd7e514f08544'}`)
       console.log(response)
       if(response.data.name.toLowerCase()!=city.trim().toLowerCase()){
        alert('City name is not correct Please Enter correct name');
       }
            setWeather(response);
            setDate(dateBuilder(new Date()))
            updateSearchHistory(city);
       
        }
       catch(err){
        console.log("Error fetching in weather data ",err);

       }
    }
    const handleClick=()=>{
      if(city.trim()==''){
        alert('Enter correct city name');
return;      
      }
      fetchWeather();


         
    }
  return (
    <>
    <div className='weather-container'>

   

      <div className='data'>
  
        <input type='text' className='input'   placeholder='Enter City 'onChange={handleCityChange} value={city} />
        {searchHistory.length > 0 && (
  <div className="history-container">
    <ul className="history-list">
      {searchHistory.map((item, index) => (
        <li
          key={index}
          className="history-item"
          onClick={() => {
            setCity(item);
            fetchWeather();
          }}
          style={{ cursor: 'pointer', color: 'blue' }}
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
)}


       
       <div className='search' onClick={handleClick}>

        {weather && <>
        <div className='weather-info'>
          <h3>{weather.data.name } , {weather.data.sys.country}</h3>
          <p className='desc'>{weather.data.weather[0].description}</p>

          <div className='cloud' >
          <img
    src={`http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
    alt={weather.data.weather[0].description}
 
  />
          </div>

          <p className='temp'>{Math.round(weather.data.main.temp - 273.15)}°C</p>
          <p className='wind-text'> Wind</p>

          <p className='wind'>{weather.data.wind.speed}Km/h</p>
          <div className='windIcon'></div>

          <p className='humidity'>Humidity</p>
          <p className='humidity-data humidity' > {weather.data.main.humidity}%</p>
          <div className='humidityIcon'></div>


          <p className='pressure'>Pressure</p>
          <p className='pressure-data pressure' > {weather.data.main.pressure} hPa</p>
          <div className='pressureIcon'></div>

<div className='time'>
  {/* <h1> {time}</h1> */}
</div>
<div className='date'>
<h1>{date}</h1>

</div>
        </div>
        </>
        
        }
       </div>

       <button className="btn btn-primary refresh" onClick={handleRefresh}>Refresh</button>

      </div>
      
      {/* <input type='search'  placeholder="Enter city Name "  value={city} onChange={handleCityChange}/>
      
      <button className="btn btn-primary" onClick={handleClick}>Get Weather</button>
  {weather && <>
  
  <div className='weather-info'>
    <h3>{weather.data.name}</h3>
    <p>{date}</p>
    <p>{time}</p>
    <p>Temperature is  {Math.round(weather.data.main.temp - 273.15)}°C</p>
    <p>{weather.data.weather[0].description}</p>
    <p>Country is {weather.data.sys.country}</p>
<p>Wind speed is {weather.data.wind.speed}</p>
  </div>
  </>} */}
  
    </div>
    </>

  )
}