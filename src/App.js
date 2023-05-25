import './App.css';
import React, { useEffect, useState } from "react";
import Weather from './components/weather';
import { Dimmer, Loader } from 'semantic-ui-react';

export default function App() {
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const getPosition = () =>
                new Promise((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                );

            try {
                const position = await getPosition();
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setLat(latitude);
                setLong(longitude);

                const response = await fetch(`${process.env.REACT_APP_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`);
                const result = await response.json();
                setData(result);
                console.log(result);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            {typeof data.main !== 'undefined' ? (
                <Weather weatherData={data} />
            ) : (
                <div>
                    <Dimmer active>
                        <Loader>Loading..</Loader>
                    </Dimmer>
                </div>
            )}
        </div>
    );
}
