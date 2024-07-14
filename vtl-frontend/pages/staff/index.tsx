import PageContainer from "@/components/container/PageContainer";
import StaffHome from "@/components/staff/Staff";
import StaffFullLayout from "@/layouts/staff/StaffFullLayout";
import { insertLishDishes } from "@/redux/dishes/dishesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllDishes } from "@/utils";
import { ReactElement, useEffect, useState } from "react";
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

export default function Staff() {
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
  const { id, roleId } = useAppSelector((state) => state.profile);
  useEffect(() => {
    if (id === -1 || roleId !== 2) {
      window.location.href = "/staff/login";
    }
  }, [id, roleId]);
  return (
    <PageContainer title="Staff">
      {isLoading ? <LoadingModal open={isLoading} /> : <StaffHome />}
    </PageContainer>
  );
}

Staff.getLayout = function getLayout(page: ReactElement) {
  return <StaffFullLayout>{page}</StaffFullLayout>;
};
