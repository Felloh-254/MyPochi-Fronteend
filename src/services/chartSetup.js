import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, ArcElement, CategoryScale, LinearScale, Filler, Legend, Tooltip)
