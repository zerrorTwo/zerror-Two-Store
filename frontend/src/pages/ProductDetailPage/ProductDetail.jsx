import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useState, Suspense, useEffect, lazy } from "react";
import {
  useGetProductBySlugQuery,
  useGetTopSoldQuery,
  useGetProductWithBreadcrumbByIdQuery,
} from "../../redux/api/productSlice";
import { Link, useParams } from "react-router-dom";
import ProductDetailCarousel from "../../components/Carousel/ProductDetailCarousel";
import Detail from "./components/Detail";
import CustomTabPanel from "../../components/CustomTabPanel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import a11yProps from "../../../utils/a11yProps";
import FlashSale from "../../components/Carousel/FlashSale";
import { Grid2 } from "@mui/material";
import { useDispatch } from "react-redux";
import { addRecentProduct } from "../../redux/features/recentProductSlice";

const Specification = lazy(() => import("./components/Specification"));
const Description = lazy(() => import("./components/Description"));
const CommentCom = lazy(() => import("./components/CommentCom"));

function ProductDetail() {
  const theme = useTheme();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetProductBySlugQuery(slug);
  const { data: productWithBreadcrumb, isLoading: isLoadingBreadcrumb } =
    useGetProductWithBreadcrumbByIdQuery(data?._id, {
      skip: !data?._id,
    });

  const { data: listTopSoldProducts } = useGetTopSoldQuery();

  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);

  // Reset state and scroll when slug changes
  useEffect(() => {
    setValue(0); // Reset tab to "Specifications"
    setQuantity(1); // Reset quantity to 1
    window.scrollTo({ top: 0, behavior: "instant" }); // Scroll to top
  }, [slug]);

  useEffect(() => {
    if (data) {
      const product = {
        id: data._id,
        name: data.name,
        price: data.minPrice,
        slug: data.slug,
        image: data.mainImg,
      };
      dispatch(addRecentProduct(product));
    }
  }, [data, dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">Error: {error.message}</Typography>
      </Container>
    );
  }

  // Hàm cắt ngắn tên nếu quá dài
  const truncateName = (name, maxLength = 50) => {
    if (name.length <= maxLength) return name;
    return `${name.slice(0, maxLength)}...`;
  };

  // Render breadcrumb
  const renderBreadcrumb = (breadcrumb) => {
    if (!breadcrumb || breadcrumb.length === 0) return null;

    return breadcrumb.map((item, index) => {
      const isProduct = index === breadcrumb.length - 1;
      const isHome = index === 0;
      const linkTo = isHome
        ? "/"
        : isProduct
        ? `/products/${item.slug}`
        : `/search?category=${item.slug}`;

      return (
        <Link
          key={item.id}
          to={linkTo}
          underline="none"
          style={{
            color: isProduct ? "#333333" : "#C94A00", // text.primary / primary.main
            fontWeight: isProduct ? "bold" : "normal",
            textDecoration: "none",
            transition: "color 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            if (!isProduct) {
              e.target.style.color = "#A33C00"; // primary.dark
              e.target.style.textDecoration = "underline";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.color = isProduct ? "#333333" : "#C94A00";
            e.target.style.textDecoration = "none";
          }}
        >
          {truncateName(item.name)}
        </Link>
      );
    });
  };

  return (
    <Container>
      {/* Breadcrumb */}
      {isLoadingBreadcrumb ? (
        <Typography>Loading breadcrumb...</Typography>
      ) : (
        <div role="presentation">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ my: 2 }}
          >
            {renderBreadcrumb(productWithBreadcrumb?.breadcrumb)}
          </Breadcrumbs>
        </div>
      )}

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

      {/* Tabs */}
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
            <Specification breadcrumb={data?.categoryBreadcrumb} />
          </Suspense>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Suspense fallback={<CircularProgress />}>
            <Description description={data?.description} />
          </Suspense>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Suspense fallback={<CircularProgress />}>
            <CommentCom productId={data?._id} />
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
