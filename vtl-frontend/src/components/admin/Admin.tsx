import React, { useState, useEffect } from "react";
import LineChart from "./dashboard/LineChart";
import useAdmin from "@/controllers/useAdmin";
import { format, addMonths, getDaysInMonth } from "date-fns"; // Import date-fns functions

type Order = {
  id: string;
  fullName: string;
  phoneNumber: string;
  resDate: string;
  resTime: string;
  people: number;
  resStatus: string;
  depositAmount: number;
  totalAmount: number;
};

const Home = () => {
  const [doneData, setdoneData] = useState<number[]>([]);
  const [cancelData, setCancelData] = useState<number[]>([]);
  const [totalData, setTotalData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  ); // Track selected month
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // Track selected year

  const [orders, setOrders] = useState<Order[]>([]);
  const { getAllOrders } = useAdmin();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getAllOrders();
      if (response.status !== 200) {
        console.log("Failed to fetch orders.");
        return;
      }
      let tmp: Order[] = response.data.map((element: any) => ({
        id: element.id,
        fullName: element.fullName,
        phoneNumber: element.phoneNumber,
        resDate: element.resDate,
        resTime: element.resTime,
        people: element.people,
        resStatus: element.resStatus,
        depositAmount: element.depositAmount,
        totalAmount: element.totalAmount,
      }));
      setOrders(tmp);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllOrders(); // Assuming this function fetches data
      const data: any[] = res.data; // Format data as needed

      // Calculate number of days in the selected month and year
      const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth));

      // Create an array of all days in the selected month
      const fullLabels: string[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        fullLabels.push(
          `${selectedYear}-${selectedMonth + 1}-${day
            .toString()
            .padStart(2, "0")}`
        );
      }

      // Initialize done, cancel, and total data arrays with zeros
      const done: number[] = Array(daysInMonth).fill(0);
      const cancel: number[] = Array(daysInMonth).fill(0);
      const total: number[] = Array(daysInMonth).fill(0);

      // Fill in actual data where available
      data.forEach((item: Order) => {
        const itemDate = new Date(item.resDate);
        if (
          itemDate.getMonth() === selectedMonth &&
          itemDate.getFullYear() === selectedYear
        ) {
          const dayIndex = itemDate.getDate() - 1; // Zero-based index
          if (item.resStatus === "done") {
            done[dayIndex]++;
          } else if (item.resStatus === "cancel") {
            cancel[dayIndex]++;
          }
        }
      });

      // Update total data
      for (let i = 0; i < daysInMonth; i++) {
        total[i] = done[i] + cancel[i];
      }

      setdoneData(done);
      setCancelData(cancel);
      setTotalData(total);
      setLabels(fullLabels);
    };

    fetchData();
  }, [selectedMonth, selectedYear]); // Update data when selectedMonth or selectedYear changes

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  return (
    <div>
      <h1>Reservation Status Overview</h1>
      <div>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value={0}>January</option>
          <option value={1}>February</option>
          <option value={2}>March</option>
          <option value={3}>April</option>
          <option value={4}>May</option>
          <option value={5}>June</option>
          <option value={6}>July</option>
          <option value={7}>August</option>
          <option value={8}>September</option>
          <option value={9}>October</option>
          <option value={10}>November</option>
          <option value={11}>December</option>
        </select>
        <select value={selectedYear} onChange={handleYearChange}>
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <LineChart
        doneData={doneData}
        cancelData={cancelData}
        totalData={totalData}
        labels={labels}
      />
    </div>
  );
};

export default Home;
