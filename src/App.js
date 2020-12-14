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
import Table from './components/Table/Table';

function App() {
  const [countriesName, setCountriesName] = useState([]); // Gets the country names for dropdown
  const [selectedCountry, setSelectedCountry] = useState('worldwide'); // Fetches the selected country to display on the dom
  const [countryInfo, setCountryInfo] = useState({}); // Fetches the country info
  const [countryName, setCountryName] = useState('WorldWide');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    async function getData() {
      let fetchCountries = await axios.get(
        'https://disease.sh/v3/covid-19/all'
      );
      setCountryInfo(fetchCountries.data);

      let { data } = await axios.get(
        'https://disease.sh/v3/covid-19/countries'
      );
      setTableData(data.sort((a, b) => b.cases - a.cases));
      setCountriesName(
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
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${selectedCountry}`;
    const { data } = await axios.get(url);
    setCountryName(selectedCountry);
    setCountryInfo(data);
    setSelectedCountry(selectedCountry);
  };

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Novel-Corona-19</h1>

          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countriesName.map((country) => (
                <MenuItem value={country.name} key={country.name}>
                  {country.name}, {country.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app__countryname'>
          You're looking at live stats of --&gt; <h4>{countryName}</h4>
        </div>
        <div className='app__stats'>
          <InfoBox
            title='CoronaVirus Cases'
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title='Recovered'
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title='Deaths'
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map />
      </div>

      <Card className='app__right'>
        <CardContent>
          <h3 className={{ textAlign: 'center' }}>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
