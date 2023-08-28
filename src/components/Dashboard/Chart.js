import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import axios from 'axios'; // Import axios for making API requests

export default function Chart() {
  const theme = useTheme();
  const [data, setData] = useState([]); // State to store fetched data

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://localhost:64888/api/ChartData/GetProjectByUserType')
      .then(response => {
        // Assuming the API response is an array of objects with "userType" and "countOfProjects" properties
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <React.Fragment>
      <Title>Project Count by User Type</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="userType"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Project Count
            </Label>
          </YAxis>
          <Bar
            dataKey="countOfProjects"
            fill={theme.palette.primary.main}
          />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
