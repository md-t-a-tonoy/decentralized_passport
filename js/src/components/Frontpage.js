import React, { useEffect, useState } from 'react';
import '../styles/style.css';
import { Link } from 'react-router-dom';

const PassportLogin = () => {
  // const [weather, setWeather] = useState(null);

  // useEffect(() => {
  //   // Function to fetch weather data
  //   const fetchWeather = async () => {
  //     try {
  //       // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
  //       const apiKey = process.env.WEATHER_API_KEY;
  //       const response = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/YOUR_LOCATION_KEY?apikey=${apiKey}`);
  //       const data = await response.json();
  //       console.log(data);
  //       setWeather(data);
  //     } catch (error) {
  //       console.error('Error fetching weather data:', error);
  //     }
  //   };

  //   // Call fetchWeather function when component mounts
  //   fetchWeather();
  // }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="../styles/style.css" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@700&family=Fredoka&family=Koh+Santepheap:wght@300;400;700&family=Roboto+Condensed:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kelly+Slab&display=swap"
          rel="stylesheet"
        />
        <title>Passport System</title>
      </head>
      <body className="bg-background flex flex-col min-h-screen w">
        <div>
          <img src="../images/Passport.png" alt="LOGO" className="h-14 mt-5 mx-8" />
        </div>

        {/* <div className="flex ml-96 mt-28 space-x-40">
          <div>
            <a href="/user_login">
              <button className="bg-pink-here h-60 w-72 rounded-3xl border-4 border-white-here font-kelly text-4xl hover:border-4 hover:border-blue-here hover:text-5xl">User <br />Login
              </button>
            </a>
            <br /><br />
            <Link to="/visa_login">
              <a href="#">
                <button className="bg-pink-here h-60 w-72 rounded-3xl border-4 border-white-here font-kelly text-4xl hover:border-4 hover:border-blue-here hover:text-5xl">Visa Authority <br />Login
                </button>
              </a>
            </Link>
          </div>
          <div>
            <Link to="http://localhost:5000/">
              <button className="bg-pink-here h-60 w-72 rounded-3xl border-4 border-white-here font-kelly text-4xl hover:border-4 hover:border-blue-here hover:text-5xl">Government Login
              </button>
            </Link>  <br /><br />
            <Link to="/border_login">
              <a href="#">
                <button className="bg-pink-here h-60 w-72 rounded-3xl border-4 border-white-here font-kelly text-4xl hover:border-4 hover:border-blue-here hover:text-5xl">Border Authority Login
                </button>
              </a>
            </Link>
          </div>
        </div> */}
        <div ><h1 className='h-24 mt-4 text-8xl font-kelly text-center '>PORTAL</h1></div>

        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <div className="flex flex-col items-center space-y-6 lg:flex-row lg:space-x-8 lg:space-y-0">


              {/* user login */}

              <div className="ml-14 bg-gray-100 p-6 rounded-lg h-80 shadow-lg w-64">
                <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/original/user-icon-on-transparent-background-free-png.png" alt="LOGO" id="hello" className="h-14 mt-5 ml-[58px]" />
                <h2 className="mt-4 text-center text-lg font-semibold text-gray-900">User</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Login with your User ID , Username and Password to access your Passport Services and Account.
                </p>
                <Link to="/user_login">
                  <button className="mt-4 w-full bg-pink-here h-12 rounded-3xl border-4 border-white-here font-kelly text-lg hover:border-blue-here hover:text-xl">
                    Login
                  </button>
                </Link>
              </div>

              {/* Government Login */}
              <div className="bg-gray-100 h-80 p-6 rounded-lg shadow-lg w-64">
                <img src="https://seeklogo.com/images/I/indian-government-logo-1C3F1925AA-seeklogo.com.png" alt="LOGO" id="hello" className="h-14 mt-5 mr-8 ml-[86px]" />
                <h2 className="mt-4 text-center text-lg font-semibold text-gray-900">Government</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Login with your Government ID and Password to access your Government Services and <br />Account.
                </p>
                <Link to="http://localhost:5000/">
                  <button className="mt-4 w-full bg-pink-here h-12 rounded-3xl border-4 border-white-here font-kelly text-lg hover:border-blue-here hover:text-xl">
                    Login
                  </button>
                </Link>
              </div>

              {/* Visa Authority */}
              <div className="bg-gray-100 h-80 p-6 rounded-lg shadow-lg w-64">
                <img src="https://static.thenounproject.com/png/469-200.png" alt="LOGO" id="hello" className="h-14 mt-5 ml-[74px]" />
                <h2 className="mt-4 text-center text-lg font-semibold text-gray-900">Visa Authority</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Login with your Visa Authority ID and Password to access your Visa Services and <br />Account.
                </p>
                <Link to="/visa_login">
                  <button className="mt-4 w-full bg-pink-here h-12 rounded-3xl border-4 border-white-here font-kelly text-lg hover:border-blue-here hover:text-xl">
                    Login
                  </button>
                </Link>
              </div>

              {/* Border Authority */}
              <div className="bg-gray-100 h-80 p-6 rounded-lg shadow-lg w-64">
                <img id="hello" src="https://cdn2.iconfinder.com/data/icons/travel-178/100/Immigration-03-512.png" alt="LOGO" className="h-14 mt-5 mr-8 ml-[74px]" />
                <h2 className="mt-4 text-center text-lg font-semibold text-gray-900">Border Authority</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Login with your Border Authority ID and Password to access your Border Services and <br />Account.
                </p>
                <Link to="/border_login">
                  <button className="mt-4 w-full bg-pink-here h-12 rounded-3xl border-4 border-white-here font-kelly text-lg hover:border-blue-here hover:text-xl">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </div>


          {/* Weather display */}
          {/* <div className="bg-white shadow-2xl">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SunSnowIcon className="h-6 w-6 text-white" />
                <div className="ml-3 text-black">
                  <p className="text-sm font-medium">Current Weather</p>
                  {weather && weather.main && (
                    <>
                      <p className="text-xl font-bold">{weather.main.temp}°C</p>
                      <p className="text-sm">{weather.weather[0].description}</p>
                    </>
                  )}
                  {!weather && <p className="text-xl font-bold">Loading...</p>}
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-8" />
            </div>
          </div>
        </div> */}
        </div>


      </body>
    </html>
  );
};

export default PassportLogin;
