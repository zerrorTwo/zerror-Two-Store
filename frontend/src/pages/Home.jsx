import { Box, Container } from "@mui/material";
import Carousel from "../components/Carousel/Carousel";
import CategoryTable from "../components/Home/CategoryTable";
import FlashSale from "../components/Carousel/FlashSale";
function Home() {
  const data = [
    "http://huanghanzhilian-test.oss-cn-beijing.aliyuncs.com/shop/upload/image/sliders/hUX6oL-lCKOKPYbZ5j4rx.webp",
    "http://huanghanzhilian-test.oss-cn-beijing.aliyuncs.com/shop/upload/image/sliders/g8FHsxbCGw82WzjmamElL.webp",
    "http://huanghanzhilian-test.oss-cn-beijing.aliyuncs.com/shop/upload/image/sliders/hWQ4-Mx69MyLJbZAThWEt.webp",
  ];
  return (
    <Box>
      <Container>
        {/* Box cate */}
        <CategoryTable />

        {/* Box carousel */}
        <Box
          sx={{
            py: 2,
            width: "100%",
            height: "300px",
            overflowY: "hidden",
          }}
        >
          <Carousel data={data} />
        </Box>

        {/* Box content */}
        <Box my={2}>
          <FlashSale />
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
