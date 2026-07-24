import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, ArcElement, BarElement, CategoryScale, LinearScale, Filler, Legend, Tooltip)
