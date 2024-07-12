import { Box, Typography } from "@mui/material";
import { Montserrat } from "next/font/google";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useCustomer from "@/controllers/useCustomer";

type Dish = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: number;
  isSelect: boolean;
};

const montserrat = Montserrat({
  weight: ["100", "200", "300", "500", "600", "800", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const ComboComp = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const { getAllDishes } = useCustomer();

  useEffect(() => {
    const fetchDishes = async () => {
      const response = await getAllDishes();
      console.log("🚀 ~ fetchDishes ~ response:", response);
      if (response.status !== 200) {
        // Handle error
        return;
      }
      const filteredDishes = response.data
        .filter((dish: any) => dish.categoryId === 1)
        .slice(0, 5); // Lọc và chỉ lấy 5 món ăn có categoryId = 1
      let tmp: Dish[] = [];
      filteredDishes.forEach((dish: any) => {
        let base64Image = "";
        if (dish.image) {
          const imageBuffer = dish.image.data;
          base64Image = atob(Buffer.from(imageBuffer).toString("base64"));
        } else {
          base64Image = "https://example.com";
        }
        tmp.push({
          id: dish.id,
          name: dish.name,
          price: dish.price,
          description: dish.description,
          image: base64Image,
          category: dish.categoryId,
          isSelect: false,
        });
      });
      setDishes(tmp);
    };
    fetchDishes();
  }, []);

  const Item = ({ dish, index }: { dish: Dish; index: number }) => {
    return (
      <Box
        sx={{
          mt: (index + 1) % 2 === 0 ? "0" : "50px", // Điều kiện mt
          textDecoration: "none",
        }}
        component={Link}
        href={`/menu`}
      >
        <Box
          sx={{
            position: "relative",
            height: "350px",
            width: "250px",
            display: "block",
            transition: "transform 0.3s",
            "&:hover": {
              opacity: 0.9,
              transform: "scale(1.1)",
            },
            ".overlay": {
              opacity: 0, // Initially hidden
              position: "absolute",
              top: "50%", // Đưa overlay lên giữa hình ảnh
              left: 0,
              right: 0,
              transform: "translateY(-50%)", // Căn chỉnh lên trên theo chiều dọc
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ mờ
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Căn giữa theo chiều ngang
              alignItems: "center", // Căn giữa theo chiều dọc
              transition: "opacity 0.3s", // Smooth transition
              height: "100%",
            },
            "&:hover .overlay": {
              opacity: 1, // Show the overlay on hover
            },
          }}
        >
          <Image
            src={dish.image}
            alt={dish.name}
            layout="fill" // Adjusted to fill for responsive design
            style={{
              objectFit: "cover",
              // borderRadius: "10px", // Optional: if you want rounded corners
              // Smooth zooming effect
            }}
          />
          <Box className="overlay">
            <Typography
              variant="h6"
              textOverflow="ellipsis"
              width="100%"
              textAlign="center"
            >
              {" "}
              {/* Đưa văn bản vào giữa */}
              {dish.name}
            </Typography>
            <Typography textAlign="center">{dish.description}</Typography>
            <Typography variant="subtitle1" textAlign="center">
              Price: {dish.price}đ
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
        pt: 5,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: montserrat,
          fontWeight: 700,
          fontSize: "6rem",
          position: "absolute",
          color: "rgb(254, 240, 240)",
          textTransform: "uppercase",
          WebkitTextStroke: "1px rgb(203, 33, 40)",
          transform: "translateY(-60%)",
          textAlign: "center",
          opacity: 0.3,
          lineHeight: 1,
        }}
      >
        Diverse Combo
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          // gap: "20px",
          padding: "20px",
        }}
      >
        {dishes.map((dish, index) => (
          <Item key={dish.id} dish={dish} index={index} />
        ))}
      </Box>
    </Box>
  );
};

export default ComboComp;
