
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Exercise } from '../types';

interface WorkoutSummaryChartProps {
  data: Exercise[];
}

const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-md shadow-lg">
        <p className="label font-bold text-gray-800">{`${label}`}</p>
        <p className="intro text-blue-600">{`Volume : ${payload[0].value.toLocaleString()} lbs`}</p>
      </div>
    );
  }

  return null;
};

const WorkoutSummaryChart: React.FC<WorkoutSummaryChartProps> = ({ data }) => {
  const chartData = data.map(ex => ({
    name: ex.name,
    volume: ex.volume,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#4a5568' }}
            angle={-25}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis 
            tick={{ fill: '#4a5568' }} 
            label={{ value: 'Volume (lbs)', angle: -90, position: 'insideLeft', fill: '#4a5568', dx: -10 }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}/>
          <Bar dataKey="volume">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutSummaryChart;