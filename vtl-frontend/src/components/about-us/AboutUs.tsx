import { Box, Typography } from "@mui/material";
import SectionItem from "./section/SectionItem";
import SectionItem2 from "./section/SectionItem2";
import SectionItem3 from "./section/SectionItem3";

const AboutUsComponent = () => {
  return (
    <Box>
      <SectionItem
        number={1}
        title={'Lee Hotpot <br/> Greetings, esteemed guests'}
        description="Lee Hotpot brings a premium dining experience with its signature hot pot dishes, sincere customer care service, and innovative space design. <br/>
        <br/>Lee Hotpot's philosophy is not only to deliver delicious cuisine but also a 5-star experience in space and service. <br/>
        <br/>Lee Hotpot creates a relaxing space for customers.<br/>
        <br/> Leaving behind the hustle and bustle of daily life at the door, diners come to Lee Hotpot to find a serene and tranquil environment."
        align="left"
      />
      <SectionItem2
        number={2}
        title="Inheriting Chinese Flavors <br/>
Sharing the Brotherhood Bond"
        description="Selecting Ingredients Carefully, Every Pot is Made with Heart
 <br/><br/>
We meticulously select a variety of high-quality ingredients for our customers 
<br/><br/>
With high standards, we ensure that the ingredients brought to the table are always fresh, nutritious, safe, and reliable 
<br/><br/>
Helping our customers eat healthier and more hygienically is the reason for our existence"
        align="right"
      />
      <SectionItem3
        number={3}
        title="Where there are friends,<br/>
there is Lee Hotpot."
        description="As a leader in premium hot pot dining experiences, we provide customers with a completely new culinary journey through a combination of high-value products, friendly face-to-face service, and a warm, modern environment.
<br/><br/>
Continuously surpassing customers' emotional needs and enhancing their spiritual enjoyment is our driving force for constant improvement."
        align="left"
      />
    </Box>
  );
};

export default AboutUsComponent;
