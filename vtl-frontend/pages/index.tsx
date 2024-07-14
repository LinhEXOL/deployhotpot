/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, type ReactElement } from "react";
import PageContainer from "@/components/container/PageContainer";
import FullLayout from "@/layouts/full/FullLayout";
import Banner from "@/components/banner/Banner";
import { Box, Typography } from "@mui/material";
import Video from "@/components/restaurant/video/Video";
import Intro from "@/components/intro/Intro";
import ResDegree from "@/components/res-degree/ResDegree";
import ComboComp from "@/components/combo/ComboComp";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { insertLishDishes } from "@/redux/dishes/dishesSlice";
import { fetchAllDishes } from "@/utils";
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

export default function Home() {
  const { listDishes } = useAppSelector((state) => state.listDishes);
  console.log("🚀 ~ Home ~ listDish:", listDishes[0]);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const fetchDishes = async () => {
    setIsLoading(true);
    try {
      const fetchDishesPromises = await Promise.all([
        fetchAllDishes(), // Add other asynchronous operations here if needed
      ]);

      let tmp: Dish[] = fetchDishesPromises[0] || [];
      tmp.sort((a: Dish, b: Dish) => a.id - b.id);
      dispatch(insertLishDishes(tmp));
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

  return (
    <PageContainer title="Home">
      {isLoading ? (
        <LoadingModal open={isLoading} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Banner />
          <Intro />
          <ResDegree />
          <ComboComp />
        </Box>
      )}
    </PageContainer>
  );
}
Home.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
