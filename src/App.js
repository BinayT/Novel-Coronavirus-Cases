import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './components/InfoBox/InfoBox';
import LineGraph from './components/LineGraph';
import Table from './components/Table/Table';
import { prettyPrintStat } from './util';
import numeral from 'numeral';
import Map from './components/Map/Map';
import 'leaflet/dist/leaflet.css';

function App() {
  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
          setMapCountries(data);
          setTableData(data.sort((a, b) => b.cases - a.cases));
        });
    };

    getCountriesData();
  }, []);

  // console.log(casesType);

  const onCountryChange = async (e) => {
    const selectedCountry = e.target.value;

    const url =
      selectedCountry === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${selectedCountry}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(selectedCountry);
        setCountryInfo(data);
        if (selectedCountry === 'worldwide') {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };
  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Novel Corona-19 Cases</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox
            onClick={(e) => setCasesType('cases')}
            title='Coronavirus Cases'
            isRed
            active={casesType === 'cases'}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format('0.0a')}
          />
          <InfoBox
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            active={casesType === 'recovered'}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format('0.0a')}
          />
          <InfoBox
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            isRed
            active={casesType === 'deaths'}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format('0.0a')}
          />
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className='app__right'>
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>WorldWide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>
      {/* Graph */}
      {/* <Footer/> */}
      <div class='social-icons'>
        <a
          class='social-icon-link facebook'
          href='/'
          target='_blank'
          aria-label='Facebook'
        >
          <i class='fab fa-facebook-f' />
        </a>
        <a
          class='social-icon-link instagram'
          href='/'
          target='_blank'
          aria-label='Instagram'
        >
          <i class='fab fa-instagram' />
        </a>
        <a
          class='social-icon-link youtube'
          href='/'
          target='_blank'
          aria-label='Youtube'
        >
          <i class='fab fa-youtube' />
        </a>
        <a
          class='social-icon-link twitter'
          href='/'
          target='_blank'
          aria-label='Twitter'
        >
          <i class='fab fa-twitter' />
        </a>
      </div>
    </div>
  );
}

export default App;
