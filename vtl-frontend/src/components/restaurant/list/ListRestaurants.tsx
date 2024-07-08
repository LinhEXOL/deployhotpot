import * as React from "react";
import useCustomer from "@/controllers/useCustomer";
import useNotify from "@/hooks/useNotify";
import {
  Box,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import ResItem from "./ResItem/ResItem";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Splide, SplideSlide } from "splide-nextjs/react-splide";
import "splide-nextjs/splide/dist/css/themes/splide-default.min.css";
import Link from "next/link";
type ResCard = {
  id: string;
  resName: string;
  resImage: string;
  coordinates: {
    lat: string;
    lng: string;
  };
  province: string;
  address: string;
};

const ListRestaurants = () => {
  const listRef = React.useRef<HTMLDivElement>(null); // Create a ref
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [restaurants, setRestaurants] = React.useState<ResCard[]>([
    {
      id: "",
      resName: "",
      resImage: "",
      coordinates: {
        lat: "",
        lng: "",
      },
      province: "",
      address: "",
    },
  ]); // Create a state variable
  const { getAllRestaurants } = useCustomer();
  const { successNotify, errorNotify } = useNotify();
  const handleScrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollLeft += 400;
    }
  };

  const handleScrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollLeft -= 400;
    }
  };
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, restaurants.length - 4)
    );
  };

  React.useEffect(() => {
    const fetchRestaurants = async () => {
      const response = await getAllRestaurants();
      if (response.status !== 200) {
        errorNotify(response.message);
      }
      let tmp: ResCard[] = [];
      response.data.forEach((element: any) => {
        const imageBuffer = element.image.data;
        const base64Image = Buffer.from(imageBuffer).toString("base64");
        tmp.push({
          id: element.id,
          resName: element.name,
          resImage: `${atob(base64Image)}`,
          coordinates: {
            lat: element.latitude,
            lng: element.longitude,
          },
          province: element.provinceId,
          address: element.address,
        });
      });
      setRestaurants(tmp);
    };

    fetchRestaurants();
    console.log("🚀 ~ restaurants", restaurants[currentIndex]);
  }, []);
  React.useEffect(() => {
    // Add this useEffect
    const checkOverflow = () => {
      if (listRef.current) {
        setIsOverflowing(
          listRef.current.scrollWidth > listRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [restaurants]);

  return (
    <Box mb={2}>
      <Splide
        options={{
          type: "loop",
          drag: "free",
          snap: true,
          perPage: 4,
          autoScroll: {
            speed: 1,
          },
        }}
        aria-label="Restaurants"
      >
        {restaurants.map((restaurant, index) => (
          <SplideSlide key={index}>
            <div // Dùng div thay vì SplideSlide để ngăn chặn hành động mặc định của liên kết
              onClick={() => {
                // Xử lý hành động khi nhấp vào mục
                console.log("Clicked on restaurant:", restaurant.id);
                // Thực hiện hành động muốn khi nhấp vào, ví dụ mở modal, chuyển hướng bằng JavaScript, vv.
              }}
            >
              <ResItem restaurant={restaurant} />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
};

export default ListRestaurants;
