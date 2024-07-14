// components/LineChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  doneData: number[];
  cancelData: number[];
  totalData: number[];
  labels: string[];
}

const LineChart: React.FC<LineChartProps> = ({
  doneData,
  cancelData,
  totalData,
  labels,
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: "done",
        data: doneData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Cancel",
        data: cancelData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Total",
        data: totalData,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Order Status",
        font: {
          size: 20, // Kích thước chữ
        },
        color: "#2A3547",
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
