import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import axios from 'axios';

import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState([]);

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
    const url =
      selectedCountry === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/countries/all'
        : `https://disease.sh/v3/covid-19/countries/${selectedCountry}`;
    const { data } = await axios.get(url);
    setCountryInfo({
      casesToday: data.todayCases,
      deathsToday: data.todayDeaths,
      recoveredToday: data.todayRecovered,
      totalCases: data.cases,
      totalDeaths: data.deaths,
      totalRecovered: data.recovered,
    });
    setCountry(selectedCountry);
  };

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Novel-Corona-19</h1>

          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.name} key={country.name}>
                  {country.name}, {country.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox
            title='CoronaVirus Cases'
            cases={countryInfo.casesToday}
            total={countryInfo.totalCases}
          />
          <InfoBox
            title='Recovered'
            cases={countryInfo.recoveredToday}
            total={countryInfo.totalRecovered}
          />
          <InfoBox
            title='Deaths'
            cases={countryInfo.deathsToday}
            total={countryInfo.totalDeaths}
          />
        </div>

        <Map />
      </div>

      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
