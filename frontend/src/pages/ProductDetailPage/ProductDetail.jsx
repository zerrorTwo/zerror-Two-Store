import { Box, Container, Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useState, Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";

const ProductDetailCarousel = lazy(() =>
  import("../../components/Carousel/ProductDetailCarousel")
);
const Detail = lazy(() => import("./components/Detail"));
const Specification = lazy(() => import("./components/Specification"));
const Description = lazy(() => import("./components/Description"));
const CommentCom = lazy(() => import("./components/CommentCom"));

function ProductDetail() {
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  const [quantity, setQuantity] = useState(1);
  const [suggestRef, suggestInView] = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  });

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
        <Grid2 container spacing={2} ref={suggestRef}>
          {suggestInView && (
            <>
              <Grid2 size={5}>
                <Suspense fallback={<div>Loading Carousel...</div>}>
                  <ProductDetailCarousel />
                </Suspense>
              </Grid2>
              <Grid2 size={7}>
                <Suspense fallback={<div>Loading Detail...</div>}>
                  <Detail quantity={quantity} setQuantity={setQuantity} />
                </Suspense>
              </Grid2>
            </>
          )}
        </Grid2>
      </Box>

      {/* Product specifications  */}
      <Suspense fallback={<div>Loading Specification...</div>}>
        <Specification handleClick={handleClick} />
      </Suspense>

      {/* Product descriptions  */}
      <Suspense fallback={<div>Loading Description...</div>}>
        <Description />
      </Suspense>

      {/* Product comment  */}
      <Suspense fallback={<div>Loading Comments...</div>}>
        <CommentCom />
      </Suspense>
    </Container>
  );
}

export default ProductDetail;
