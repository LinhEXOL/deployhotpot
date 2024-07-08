import { Box, Button, Container, Typography } from "@mui/material";
import { Montserrat } from "next/font/google";
import Image from "next/legacy/image";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "500", "600", "800", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const listImage = [
  {
    image: "/images/restaurants/menu-1.jpg",
  },
  {
    image: "/images/restaurants/menu-2.jpg",
  },
  {
    image: "/images/restaurants/menu-3.jpg",
  },
  {
    image: "/images/restaurants/menu-4.jpg",
  },
  {
    image: "/images/restaurants/menu-5.jpg",
  },
  {
    image: "/images/restaurants/menu-6.jpg",
  },
  {
    image: "/images/restaurants/menu-7.jpg",
  },
  {
    image: "/images/restaurants/menu-8.jpg",
  },
];

const SectionItem2 = ({
  number,
  title,
  description,
  align,
}: {
  number: number;
  title: any;
  description: string;
  align: "left" | "right";
}) => {
  return (
    <Container sx={{ py: 2, maxWidth: "1200px", height: "fit-content" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexDirection: align === "left" ? "row" : "row-reverse",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            width: "45%",
          }}
        >
          <Typography
            sx={{
              fontFamily: montserrat,
              fontWeight: 400,
              fontSize: "5rem",
              color: "#CB2128",
              textTransform: "uppercase",
              WebkitTextStroke: "1px #FFFFFF",
              lineHeight: 1,
            }}
          >
            0{number}
          </Typography>
          <Box sx={{ p: 1 }}>
            <Typography
              variant="h2"
              sx={{ mb: 2, fontWeight: 700, color: "#fff" }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 400, color: "#fff" }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <Box
              sx={{
                p: 1,
                borderRadius: 15,
                border: "1px solid #fff",
                width: "fit-content",
              }}
            >
              <Button
                component={Link}
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#CB2128",
                  borderRadius: 10,
                  fontFamily: montserrat,
                  fontWeight: 700,
                  ":hover": {
                    backgroundColor: "white",
                    color: "#CB2128",
                  },
                }}
                href="/reserve-now"
              >
                Reserve Now
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "500px",
            height: "320px",
            position: "relative",
          }}
        >
          <Carousel
            showArrows={true}
            autoPlay={true}
            interval={3000}
            infiniteLoop={true}
            showThumbs={false}
          >
            {listImage.map((item, index) => (
              <div key={index}>
                <Image src={item.image} alt="restaurant" width={500} height={320} />
              </div>
            ))}
          </Carousel>
        </Box>
      </Box>
    </Container>
  );
};

export default SectionItem2;
