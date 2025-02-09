import { Box, Container, Grid2, CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useState, Suspense, lazy } from "react";
import { useGetProductBySlugQuery } from "../../redux/api/productSlice";
import { useParams } from "react-router";
import ProductDetailCarousel from "../../components/Carousel/ProductDetailCarousel";
import Detail from "./components/Detail";
const Specification = lazy(() => import("./components/Specification"));
const Description = lazy(() => import("./components/Description"));
const CommentCom = lazy(() => import("./components/CommentCom"));

function ProductDetail() {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetProductBySlugQuery(slug); // Include isLoading and error

  // Handle breadcrumb click
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  const [quantity, setQuantity] = useState(1);

  // If the data is loading or there's an error, return loading or error state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data);

  return (
    <Container>
      {/* Breadcrumb */}
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="#05a" href="/">
            MUI
          </Link>
          <Link underline="hover" color="#05a" href="/">
            Core
          </Link>
          <Typography sx={{ color: "text.blackColor" }}>Breadcrumbs</Typography>
        </Breadcrumbs>
      </div>

      {/* Product Detail */}
      <Box
        my={2}
        boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
        px={2}
        py={2}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={5}>
            {data?.img ? (
              <Suspense fallback={<CircularProgress />}>
                <ProductDetailCarousel listImg={data.img} />
              </Suspense>
            ) : (
              <div>No images available</div>
            )}
          </Grid2>
          <Grid2 size={7}>
            <Suspense fallback={<CircularProgress />}>
              <Detail
                data={data}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            </Suspense>
          </Grid2>
        </Grid2>
      </Box>

      {/* Product specifications */}
      <Suspense fallback={<CircularProgress />}>
        <Specification handleClick={handleClick} />
      </Suspense>

      {/* Product descriptions */}
      <Suspense fallback={<CircularProgress />}>
        <Description description={data?.description} />
      </Suspense>

      {/* Product comment */}
      <Suspense fallback={<CircularProgress />}>
        <CommentCom />
      </Suspense>
    </Container>
  );
}

export default ProductDetail;
