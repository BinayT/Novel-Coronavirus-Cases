import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function (tooltipItem) {
        return numeral(tooltipItem.value).format('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          format: 'MM/DD/YY',
          tooltipFormat: 'll',
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

const LineGraph = ({ caseType = 'cases' }) => {
  const [data, setData] = useState({});

  const buildChartData = (data, caseType = 'cases') => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newData = {
          x: date,
          y: data[caseType][date] - lastDataPoint,
        };
        chartData.push(newData);
      }
      lastDataPoint = data[caseType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await Axios.get(
        'https://disease.sh/v3/covid-19/historical/all?days=120'
      );
      const chartData = buildChartData(data, caseType);
      setData(chartData);
    };
    fetchData();
  }, [caseType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: 'rgba(204,16,52,0.5)',
                borderColor: '#CC1034',
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default LineGraph;
