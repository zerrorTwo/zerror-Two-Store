import { Box, Container, CircularProgress } from "@mui/material";
import Carousel from "../components/Carousel/Carousel";
import CategoryTable from "../components/Home/CategoryTable";
import { useGetCommonCategoryQuery } from "../redux/api/categorySlice";
import { useInView } from "react-intersection-observer";
import React, { Suspense } from "react";

// Lazy-load các component
const FlashSale = React.lazy(() => import("../components/Carousel/FlashSale"));
const Banner = React.lazy(() => import("../components/Home/Banner"));
const Suggest = React.lazy(() => import("../components/Home/Suggest"));

function Home() {
  const { data: categories = [], isLoading: isLoadingCate } =
    useGetCommonCategoryQuery();

  const [flashSaleRef, flashSaleInView] = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  });
  const [bannerRef, bannerInView] = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  });
  const [suggestRef, suggestInView] = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  });

  const data = [
    "http://huanghanzhilian-test.oss-cn-beijing.aliyuncs.com/shop/upload/image/sliders/hUX6oL-lCKOKPYbZ5j4rx.webp",
    "http://huanghanzhilian-test.oss-cn-beijing.aliyuncs.com/shop/upload/image/sliders/g8FHsxbCGw82WzjmamElL.webp",
    "http://huanghanzhilian-test.oss-cn-beijing.aliyuncs.com/shop/upload/image/sliders/hWQ4-Mx69MyLJbZAThWEt.webp",
  ];

  return (
    <Box>
      <Container>
        {/* Box cate */}
        <CategoryTable itemData={categories} isLoading={isLoadingCate} />

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
        <Box my={5}>
          {/* FlashSale */}
          <Box ref={flashSaleRef}>
            {flashSaleInView ? (
              <Suspense fallback={<CircularProgress />}>
                <FlashSale />
              </Suspense>
            ) : (
              <CircularProgress />
            )}
          </Box>

          {/* Banner */}
          <Box ref={bannerRef}>
            {bannerInView ? (
              <Suspense fallback={<CircularProgress />}>
                <Banner />
              </Suspense>
            ) : (
              <CircularProgress />
            )}
          </Box>

          {/* Suggest */}
          <Box ref={suggestRef}>
            {suggestInView ? (
              <Suspense fallback={<CircularProgress />}>
                <Suggest />
              </Suspense>
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
