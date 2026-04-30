// Importing necessary modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.defaults.font.size = 18;
ChartJS.defaults.font.weight = 'bold';
ChartJS.defaults.color = 'white';
// Registering Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Sentiment {
  cmt_id: number;
  Positive: number;
  Negative: number;
}

// Props for the LineChart component
type Props = {
  width: number,
  height: number;
};

const labels: string[] = [];

for (let i = 0; i < 5; i++) {
  const today = new Date();
  today.setDate(today.getDate() - i);
  const dayMonth = `${today.getDate()}/${today.getMonth() + 1}`;
  labels.unshift(dayMonth); // เพิ่มรายการในบรรทัดแรกของอาร์เรย์
}

function LineChart({ width, height}: Props) {
  const data = {
    labels,
    datasets: [
      {
        label:'sentiment',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgba(255,204,0,1)',
        tension: 0,
        point: {
          radius: 5, // ขนาดของจุด
          backgroundColor: 'rgba(600,164,0,1)', // สีของจุด
          hoverRadius: 8,
          stlye:'circle',
        },
        borderWidth:3,
      },
    ],
  };

  var options = {
    scales: {
      x: {
        grid: {
          color: 'white'
        },
          title: {
            display: true,
            text: 'day'
          }
      },
      y: {
        grid: {
          color: 'white' 
        },
          title: {
            display: true,
            text: 'percentage(%)'
          }
      }
  },
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        font: {
          size: 20
        }
      },

    }
   
  };

  return <Line width={width} height={height} data={data} options={options}/>;
}

// Exporting the LineChart component
export default LineChart;
