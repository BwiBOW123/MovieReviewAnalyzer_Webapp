// Importing necessary modules
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registering Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

interface Sentiment{
  cmt_id:number
  Positive:number
  Negative:number
}

// Props for the PieChart component
type Props = {
  width: number;
  height: number;
  Data:Sentiment
};

// Functional component for the PieChart
function DoughnutChart({ width, height,Data }: Props) {

  const data = {
    datasets: [
      {
        label: '# of Votes',
        data: [Data.Negative,Data.Positive],
        backgroundColor: [
          'rgba(200,64,64,1)',
          'rgba(60,164,85,1)',
        ],
        borderColor: [
          'rgba(200,64,64,1)',
          'rgba(60,164,85,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: false,
    plugins: {
      legend: {
        display: true, 
      },
    },
  };

  return (
    <Doughnut width={width} height={height} data={data} options={options} />
  );
}

// Exporting the PieChart component
export default DoughnutChart;
