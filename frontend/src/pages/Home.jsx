import {
  Box,
  Container,
  CircularProgress,
  AlertTitle,
  Alert,
  CardMedia,
} from "@mui/material";
import Carousel from "../components/Carousel/Carousel";
import CategoryTable from "../components/Home/CategoryTable";
import { useGetCommonCategoryQuery } from "../redux/api/categorySlice";
import { useInView } from "react-intersection-observer";
import React, { Suspense } from "react";
import {
  useGetPageProductQuery,
  useGetTopSoldQuery,
} from "../redux/api/productSlice";
import { Link } from "react-router";

// Lazy-load các component
const FlashSale = React.lazy(() => import("../components/Carousel/FlashSale"));
const Banner = React.lazy(() => import("../components/Home/Banner"));
const Suggest = React.lazy(() => import("../components/Home/Suggest"));

function Home() {
  const {
    data: listTopSoldProducts,
    error: topSoldError,
    isLoading: topSoldLoading,
  } = useGetTopSoldQuery();
  const {
    data: { products: listProducts = [] } = {},
    error: listError,
    isLoading: listLoading,
  } = useGetPageProductQuery({
    page: 1,
    limit: 42,
  });

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
            pt: 2,
            width: "100%",
            height: { xs: "100px", sm: "300px" },
            overflowY: "hidden",
          }}
        >
          <Carousel data={data} />
        </Box>

        {/* Box content */}
        <Box mt={5}>
          {/* FlashSale */}
          <Box ref={flashSaleRef}>
            {topSoldError ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {topSoldError.message || "An unexpected error occurred."}
              </Alert>
            ) : flashSaleInView || topSoldLoading ? (
              <Suspense fallback={<CircularProgress />}>
                <FlashSale listItem={listTopSoldProducts} />
              </Suspense>
            ) : (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>

          {/* Banner */}
          <Box ref={bannerRef}>
            {bannerInView ? (
              <Suspense fallback={<CircularProgress />}>
                <Banner />
              </Suspense>
            ) : (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>

          {/* Banner */}
          <Box
            my={5}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none", // Bỏ gạch chân
                width: "100%",
                height: "250px",
                display: "block", // Đảm bảo `Link` bao phủ toàn bộ item
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover", // Đảm bảo hình ảnh hiển thị đẹp
                  borderRadius: "8px", // Thêm bo góc nếu cần
                }}
                alt="Banner image"
                image={
                  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2FgbharyCRH4P2CIQaZvDGq.jpeg&w=1920&q=100"
                }
                loading="lazy"
              />
            </Link>
            <Link
              to="/"
              style={{
                textDecoration: "none", // Bỏ gạch chân
                width: "100%",
                height: "250px",
                display: "block", // Đảm bảo `Link` bao phủ toàn bộ item
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover", // Đảm bảo hình ảnh hiển thị đẹp
                  borderRadius: "8px", // Thêm bo góc nếu cần
                }}
                alt="Banner image"
                image={
                  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2Fb9ZiyMDRD0W-dBVkWF1L6.jpeg&w=1920&q=100"
                }
                loading="lazy"
              />
            </Link>
            <Link
              to="/"
              style={{
                textDecoration: "none", // Bỏ gạch chân
                width: "100%",
                height: "250px",
                display: "block", // Đảm bảo `Link` bao phủ toàn bộ item
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover", // Đảm bảo hình ảnh hiển thị đẹp
                  borderRadius: "8px", // Thêm bo góc nếu cần
                }}
                alt="Banner image"
                image={
                  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2FH_1mJBnX8_RrdfoEHCby2.jpeg&w=1920&q=100"
                }
                loading="lazy"
              />
            </Link>
            <Link
              to="/"
              style={{
                textDecoration: "none", // Bỏ gạch chân
                width: "100%",
                height: "250px",
                display: "block", // Đảm bảo `Link` bao phủ toàn bộ item
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover", // Đảm bảo hình ảnh hiển thị đẹp
                  borderRadius: "8px", // Thêm bo góc nếu cần
                }}
                alt="Banner image"
                image={
                  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2FtX_L0mZwdm5SNNyKF4gD_.jpeg&w=1920&q=100"
                }
                loading="lazy"
              />
            </Link>
          </Box>

          {/* Suggest */}
          <Box ref={suggestRef}>
            {listError ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {listError.message ||
                  "An unexpected error occurred while loading suggestions."}
              </Alert>
            ) : suggestInView || listLoading ? (
              <Suspense fallback={<CircularProgress />}>
                <Suggest listProducts={listProducts} />
              </Suspense>
            ) : (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
