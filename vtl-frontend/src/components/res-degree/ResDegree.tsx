import ListRestaurants from "@/components/restaurant/list/ListRestaurants";
import { Box, Tooltip, Typography } from "@mui/material";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "500", "600", "800", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});
const ResDegree = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        bgcolor: "#CB2128",
      }}
      id="list-restaurant"
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: montserrat,
            fontWeight: 700,
            fontSize: "6rem",
            //position: "absolute",
            color: "rgb(203, 33, 40)",
            textTransform: "uppercase",
            WebkitTextStroke: "1px rgb(254, 240, 240)",
            transform: "translateY(0%)",
            textAlign: "center",
            //opacity: 0.3,
            lineHeight: 1,
          }}
        >
          Restaurant
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: 1300,
        }}
      >
        <ListRestaurants />
      </Box>
    </Box>
  );
};

export default ResDegree;
