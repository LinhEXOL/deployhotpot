import PageContainer from "@/components/container/PageContainer";
import AdminFullLayout from "@/layouts/admin/AdminFullLayout";
import { Box } from "@mui/material";
import { ReactElement, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import Home from "@/components/admin/Admin";
import OrderItemsChart from "@/components/admin/dashboard/OrderItemsChart";
import Dashboard from "@/components/admin/dashboard/Dashboard";
import { fetchAllDishes } from "@/utils";
import { insertLishDishes } from "@/redux/dishes/dishesSlice";
import LoadingModal from "@/common/loading/LoadingModal";

type Dish = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: number;
  isSelect: boolean;
};

export default function AdminPage() {
  const { listDishes } = useAppSelector((state) => state.listDishes);
  const dishpatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const fetchDishes = async () => {
    setIsLoading(true);
    try {
      const fetchDishesPromises = await Promise.all([
        fetchAllDishes(), // Add other asynchronous operations here if needed
      ]);

      let tmp: Dish[] = fetchDishesPromises[0] || [];
      tmp.sort((a: Dish, b: Dish) => a.id - b.id);
      dishpatch(insertLishDishes(tmp));
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchAndDispatchDishes = async () => {
      if (listDishes.length === 0) {
        await fetchDishes();
      }
    };
    fetchAndDispatchDishes();
  }, []);
  const { roleId } = useAppSelector((state) => state.profile);
  useEffect(() => {
    if (roleId !== 1) {
      window.location.href = "/admin/login";
    }
  }, [roleId]);
  return (
    <PageContainer title="Admin">
      {isLoading ? (
        <LoadingModal open={isLoading} />
      ) : (
        <Box>
          {/* <AdminComponent />*/}
          <Dashboard />
        </Box>
      )}
    </PageContainer>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminFullLayout>{page}</AdminFullLayout>;
};
