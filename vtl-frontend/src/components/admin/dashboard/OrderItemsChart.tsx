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

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

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
      <h4>Dish Order Quantity</h4>
      <Box display="flex" justifyContent="center" mb={2}>
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
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2025}>2025</MenuItem>
        </Select>
      </Box>
      {chartData?.labels?.length > 0 ? (
        <div style={{ width: "300px", height: "300px" }}>
          <Doughnut
            data={chartData}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
      ) : (
        <p>Không có dữ liệu để hiển thị.</p>
      )}
      <h3>Top 5 Best-Order Dishes</h3>

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

            <Typography
              sx={{
                pl: "20px",
                fontWeight: "500",
              }}
            >
              {dish.name} - {dish.quantity} order
            </Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default OrderItemsChart;
