import {
  Box,
  Container,
  Grid2,
  CircularProgress,
  useTheme,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useState, Suspense, lazy } from "react";
import {
  useGetProductBySlugQuery,
  useGetTopSoldQuery,
} from "../../redux/api/productSlice";
import { useParams } from "react-router";
import ProductDetailCarousel from "../../components/Carousel/ProductDetailCarousel";
import Detail from "./components/Detail";
import CustomTabPanel from "../../components/CustomTabPanel";
import { Tabs, Tab } from "@mui/material";
import a11yProps from "../../../utils/a11yProps";
import FlashSale from "../../components/Carousel/FlashSale";
const Specification = lazy(() => import("./components/Specification"));
const Description = lazy(() => import("./components/Description"));
const CommentCom = lazy(() => import("./components/CommentCom"));

function ProductDetail() {
  const theme = useTheme();
  const { slug } = useParams();
  const { data, isLoading, error } = useGetProductBySlugQuery(slug);

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  const { data: listTopSoldProducts } = useGetTopSoldQuery();

  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
        <Grid2 container spacing={6}>
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

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        sx={{
          maxWidth: "500px",
          "& .Mui-selected": {
            color: `${theme.palette.secondary.main} !important`,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "secondary.main",
          },
          "& .MuiTab-root": {
            minWidth: 0,
            flex: 1,
            textTransform: "none",
          },
        }}
      >
        <Tab
          sx={{ fontSize: "16px" }}
          label="Specifications"
          {...a11yProps(0)}
        />
        <Tab sx={{ fontSize: "16px" }} label="Descriptions" {...a11yProps(1)} />
        <Tab sx={{ fontSize: "16px" }} label="Comments" {...a11yProps(2)} />
      </Tabs>

      <Box sx={{ padding: 0, mb: 2 }}>
        <CustomTabPanel value={value} index={0}>
          <Suspense fallback={<CircularProgress />}>
            <Specification handleClick={handleClick} />
          </Suspense>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Suspense fallback={<CircularProgress />}>
            <Description description={data?.description} />
          </Suspense>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Suspense fallback={<CircularProgress />}>
            <CommentCom />
          </Suspense>
        </CustomTabPanel>
        <Box sx={{ padding: 0, my: 2 }}>
        <Suspense fallback={<CircularProgress />}>
          <FlashSale listItem={listTopSoldProducts} />
        </Suspense>
        </Box>
      </Box>
    </Container>
  );
}

export default ProductDetail;
