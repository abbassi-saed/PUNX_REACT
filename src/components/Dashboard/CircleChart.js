import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import apiClient from '../../Api';

Chart.register(ArcElement);

const CircleChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    apiClient.get('/api/ChartData')
      .then(response => {
        const { labels, data, backgroundColor } = response.data;

        setChartData({
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColor,
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.datasets[0].data,
        backgroundColor: chartData.datasets[0].backgroundColor,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="chart-container">
        <Pie data={data} />
        <span style={{ color: '#FFCE56' }}>Sheets</span> /{' '}
        <span style={{ color: '#FF6384' }}>Users</span> /{' '}
        <span style={{ color: '#36A2EB' }}>Jobs</span>
      </div>
    </div>
  );
};

export default CircleChart;
