import React from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate User Type Data
function createData(userType, count) {
  return { userType, count };
}

const data = [
  createData('User Type 1', 15),
  createData('User Type 2', 25),
  createData('User Type 3', 10),
];

export default function Chart() {
  const theme = useTheme();

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
            dataKey="count"
            fill={theme.palette.primary.main}
          />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
