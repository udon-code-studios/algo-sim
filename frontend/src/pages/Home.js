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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function Home() {
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  return (
    <div className="flex flex-col justify-center items-center space-y-10">
      <pre className='pt-10 text-5xl font-bold font-serif'>Home</pre>
      <div className="h-80 w-3/4">
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }}
          data={{
            labels,
            datasets: [
              {
                label: 'Dataset 1',
                data: labels.map(() => 3.2),
                borderColor: '#E2B4BD',
                backgroundColor: '#E2B4BD80',
              },
              {
                label: 'Dataset 2',
                data: labels.map(() => 4),
                borderColor: '#94DBA0',
                backgroundColor: '#94DBA080',
              },
            ],
          }}
        />
      </div>

    </div>
  );
}