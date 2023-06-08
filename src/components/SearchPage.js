import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import WeatherCard from './weather';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchData, setSearchData] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}?q=${searchQuery}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`);
            const result = await response.json();
            setSearchData(result);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter location"
            />
            <Button className="search-button" onClick={handleSearch}>Search</Button>


            {searchData && typeof searchData.main !== 'undefined' && (
                <WeatherCard weatherData={searchData} />
            )}
        </div>
    );
};

export default SearchPage;
