import { useEffect, useState } from 'react';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import axios from 'axios';

import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    async function getData() {
      let { data } = await axios.get(
        'https://disease.sh/v3/covid-19/countries'
      );
      setCountries(
        data.map((el) => ({
          name: el.country,
          value: el.countryInfo.iso2,
        }))
      );
    }
    getData();
  }, []);

  const onCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
  };

  return (
    <div className='app'>
      <div className='app__header'>
        <h1>Novel-Corona-19</h1>
        <FormControl className='app__dropdown'>
          <Select variant='outlined' value={country} onChange={onCountryChange}>
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value} key={country.name}>
                {country.name}, {country.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Header */}

      {/* Title+Select input dropdown field */}

      {/* InfoBoxes */}
      {/* InfoBoxes */}
      {/* InfoBoxes */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
