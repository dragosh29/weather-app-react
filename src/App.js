import './App.css';
import React, { useEffect, useState } from 'react';
import Weather from './components/weather';
import SearchPage from './components/SearchPage';
import { Dimmer, Loader } from 'semantic-ui-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default function App() {
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getPosition = () =>
                    new Promise((resolve, reject) =>
                        navigator.geolocation.getCurrentPosition(resolve, reject)
                    );

                const position = await getPosition();
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setLat(latitude);
                setLong(longitude);

                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data.');
                }

                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="App">
                <Dimmer active>
                    <Loader>Loading..</Loader>
                </Dimmer>
            </div>
        );
    }

    if (error) {
        return (
            <div className="App">
                <h2>Error: {error.message}</h2>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <div className="nav">
                    <Link to="/" className="home">Home</Link>
                    <Link to="/search">Search</Link>
                </div>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Weather
                                weatherData={data}
                                lat={lat}
                                long={long}
                                isCurrentLocation={true}
                            />
                        }
                    />
                    <Route
                        path="/search"
                        element={<SearchPage lat={lat} long={long} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}
