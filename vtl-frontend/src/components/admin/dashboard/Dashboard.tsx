import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import useAdmin from "@/controllers/useAdmin";
import { fetchOrderDetail } from "@/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Image from "next/legacy/image";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import LineChart from "./LineChart";
import LineChartRevenue from "./LineChartRevenue";
import { getDaysInMonth } from "date-fns"; // Import date-fns functions

ChartJS.register(ArcElement, Tooltip, Legend);

type OrderItem = {
  id?: number;
  dishId: number;
  dishName: string;
  total: number;
  quantity: number;
};

type Dish = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: number;
  isSelect: boolean;
};

type Table = {
  id: number;
  name: string;
  capacity: number;
  position: string;
  description: string;
};

type Order = {
  order: {
    id: number;
    resDate: string;
    resTime: string;
    people: number;
    resStatus: string;
    depositAmount: number;
    restaurantId: number;
    fullName: string;
    phoneNumber: string;
    cusId?: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    paymentStatus: string;
    email: string;
  };
  orderItems: OrderItem[];
  tables: Table[];
};

type Order1 = {
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

const OrderItemsChart = () => {
  const [chartData, setChartData] = useState<any>({});
  const [topDishes, setTopDishes] = useState<any[]>([]);
  const { getAllOrders } = useAdmin();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const [doneData, setdoneData] = useState<number[]>([]);
  const [cancelData, setCancelData] = useState<number[]>([]);
  const [totalData, setTotalData] = useState<number[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order1[]>([]);

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getAllOrders();
      if (response.status !== 200) {
        console.log("Failed to fetch orders.");
        return;
      }
      let tmp: Order1[] = response.data.map((element: any) => ({
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
      const revenue: number[] = Array(daysInMonth).fill(0);

      // Fill in actual data where available
      data.forEach((item: Order1) => {
        const itemDate = new Date(item.resDate);
        if (
          itemDate.getMonth() === selectedMonth &&
          itemDate.getFullYear() === selectedYear
        ) {
          const dayIndex = itemDate.getDate() - 1; // Zero-based index
          if (item.resStatus === "done") {
            done[dayIndex]++;
            revenue[dayIndex] += item.totalAmount; // Accumulate totalAmount for revenue
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
      setRevenueData(revenue);
      setLabels(fullLabels);
    };

    fetchData();
  }, [selectedMonth, selectedYear]); // Update data when selectedMonth or selectedYear changes

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        if (response.status !== 200) {
          console.log("Failed to fetch orders.");
          return;
        }

        const dishQuantityMap: Map<number, number> = new Map();
        const dishNameMap: Map<number, string> = new Map();
        const dishImageMap: Map<number, string> = new Map();

        const fetchOrder = async (id: number) => {
          const tmp = await fetchOrderDetail(id);
          if (tmp?.orderItems) {
            tmp.orderItems.forEach((item: any) => {
              dishQuantityMap.set(
                item.dishId,
                (dishQuantityMap.get(item.dishId) || 0) + item.quantity
              );
              dishNameMap.set(item.dishId, item.dishName);

              if (item && item.image) {
                const imageBuffer = item.image.data;
                const base64Image = atob(
                  Buffer.from(imageBuffer).toString("base64")
                );
                dishImageMap.set(item.dishId, base64Image);
              } else {
                dishImageMap.set(item.dishId, "/images/restaurants/res-1.jpg");
              }
            });
          }
          return tmp;
        };

        const doneOrders = response.data.filter(
          (element: any) => element.resStatus === "done"
        );

        const filteredOrders = doneOrders.filter((order: any) => {
          const orderDate = new Date(order.resDate);
          return (
            orderDate.getMonth() === selectedMonth &&
            orderDate.getFullYear() === selectedYear
          );
        });

        const orderPromises = filteredOrders.map((element: any) =>
          fetchOrder(element.id)
        );

        const fetchedOrders = await Promise.all(orderPromises);

        const dishArray: {
          dishId: number;
          name: string;
          quantity: number;
          image: string;
        }[] = [];

        dishQuantityMap.forEach((quantity, dishId) => {
          dishArray.push({
            dishId,
            name: dishNameMap.get(dishId) || `Dish ${dishId}`,
            quantity,
            image: dishImageMap.get(dishId) || "/images/restaurants/res-2.jpg",
          });
        });

        dishArray.sort((a, b) => b.quantity - a.quantity);

        const top5Dishes = dishArray.slice(0, 5);

        const othersQuantity = dishArray
          .slice(5)
          .reduce((total, dish) => total + dish.quantity, 0);

        const labels = top5Dishes.map(
          (dish) => dishNameMap.get(dish.dishId) || `Dish ${dish.dishId}`
        );
        const data = top5Dishes.map((dish) => dish.quantity);
        if (othersQuantity > 0) {
          labels.push("Others");
          data.push(othersQuantity);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "# of Orders",
              data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        setTopDishes(top5Dishes);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchOrders();
  }, [selectedMonth, selectedYear]);

  return (
    <div>
      <Box>
        <Box display="flex" mb={2} sx={{ gap: "10px" }}>
          <Typography
            sx={{
              textAlign: "center",
              marginTop: "10px",
              fontWeight: "500",
            }}
          >
            Choose month
          </Typography>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            <MenuItem value={0}>January</MenuItem>
            <MenuItem value={1}>February</MenuItem>
            <MenuItem value={2}>March</MenuItem>
            <MenuItem value={3}>April</MenuItem>
            <MenuItem value={4}>May</MenuItem>
            <MenuItem value={5}>June</MenuItem>
            <MenuItem value={6}>July</MenuItem>
            <MenuItem value={7}>August</MenuItem>
            <MenuItem value={8}>September</MenuItem>
            <MenuItem value={9}>October</MenuItem>
            <MenuItem value={10}>November</MenuItem>
            <MenuItem value={11}>December</MenuItem>
          </Select>
          <Select value={selectedYear} onChange={handleYearChange}>
            <MenuItem value={2023}>2022</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box
            sx={{
              width: "50%",
            }}
          >
            <Box
              sx={{
                border: "solid 2px #BCC1CD",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <LineChartRevenue
                data={revenueData}
                labels={labels}
                title="Monthly Revenue"
                color="rgb(75, 192, 192)"
                backgroundColor="rgba(75, 192, 192, 0.2)"
              />
            </Box>
            <Box
              sx={{
                border: "solid 2px #BCC1CD",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <LineChart
                doneData={doneData}
                cancelData={cancelData}
                totalData={totalData}
                labels={labels}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: "50%",
              border: "solid 2px #BCC1CD",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Dish Order Quantity
            </Typography>

            {chartData?.labels?.length > 0 ? (
              <div style={{ width: "100%", height: "300px" }}>
                <Doughnut
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            ) : (
              <p>No data</p>
            )}

            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "10px",
                marginTop: "50px",
              }}
            >
              Top 5 Best-Order Dishes
            </Typography>

            {topDishes.map((dish, index) => (
              <Box key={dish.dishId}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    pt: 2,
                  }}
                >
                  <Box>
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={100}
                      height={70}
                      layout="fixed"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pl: "20px",
                      fontWeight: "500",
                    }}
                  >
                    <Typography>{dish.name} - </Typography>
                    <Typography
                      sx={{
                        color: "#F50E60",
                      }}
                    >
                      {dish.quantity} orders
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default OrderItemsChart;
