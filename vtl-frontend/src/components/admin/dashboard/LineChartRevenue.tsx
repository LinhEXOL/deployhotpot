import React from "react";
import { Line } from "react-chartjs-2";
import { formatCurrencyVND } from "@/utils";

interface LineChartRevenueProps {
  data: number[];
  labels: string[];
  title: string;
  color: string;
  backgroundColor: string;
}

const LineChartRevenue: React.FC<LineChartRevenueProps> = ({
  data,
  labels,
  title,
  color,
  backgroundColor,
}) => {
  // Calculate total revenue
  const totalRevenue = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor,
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
        text: `${title} - Total: ${formatCurrencyVND(totalRevenue)}`,
        font: {
          size: 25, // Kích thước chữ
        },
        color: "#5D87FF", // Màu chữ
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChartRevenue;
