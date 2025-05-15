// BarChartComponent.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = () => {
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 15000, 8000, 18000, 10000, 16000, 20000],
        backgroundColor: [
          '#87CEEB', // Monday
          '#36a2eb', // Tuesday
          '#ffce56', // Wednesday
          '#4bc0c0', // Thursday
          '#9966ff', // Friday
          '#ff9f40', // Saturday
        ],
        borderColor: '#303f9f',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        display: false, // Hides the 'Sales' legend
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#666', // X-axis label color
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#666', // Y-axis label color
        },
        grid: {
          color: '#eee',
        },
      },
    },
  };

  return (
    <div className='text-center h-[230px]'> 
      <h2 className="text-lg font-bold mb-4">Team Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartComponent;
