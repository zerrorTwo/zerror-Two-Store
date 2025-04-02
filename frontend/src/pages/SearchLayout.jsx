import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "@mui/material/Link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { lazy, Suspense, useState, useEffect } from "react";
import { useGetPageProductQuery } from "../redux/api/productSlice";
import { useInView } from "react-intersection-observer";
import { CardMedia, Grid2, Pagination } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ProductMini = lazy(() => import("../components/ProductMini"));

function SearchLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  // State cho các tham số áp dụng vào query
  const [page, setPage] = useState(parseInt(query.get("page")) || 1);
  const [limit] = useState(parseInt(query.get("limit")) || 30);
  const [category] = useState(query.get("category") || "");
  const [search] = useState(query.get("name") || "");
  const [appliedMinPrice, setAppliedMinPrice] = useState(
    query.get("minPrice") || ""
  );
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(
    query.get("maxPrice") || ""
  );
  const [appliedRating, setAppliedRating] = useState(
    parseFloat(query.get("rating")) || 0
  );

  // State tạm thời cho input người dùng
  const [tempMinPrice, setTempMinPrice] = useState(query.get("minPrice") || "");
  const [tempMaxPrice, setTempMaxPrice] = useState(query.get("maxPrice") || "");
  const [tempRating, setTempRating] = useState(
    parseFloat(query.get("rating")) || 0
  );

  const {
    data: { products: listProducts = [], totalPages = 0 } = {},
    error: listError,
    isLoading: listLoading,
  } = useGetPageProductQuery({
    page,
    limit,
    category,
    search,
    minPrice: appliedMinPrice || undefined,
    maxPrice: appliedMaxPrice || undefined,
    rating: appliedRating || undefined,
  });

  const [flashSaleRef, flashSaleInView] = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  });

  // Cuộn lên đầu trang khi page thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  // Hàm cập nhật URL với các tham số
  const updateQueryParams = (newParams) => {
    const newQuery = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value || value === 0) {
        newQuery.set(key, value);
      } else {
        newQuery.delete(key);
      }
    });
    navigate(`${location.pathname}?${newQuery.toString()}`, { replace: true });
  };

  // Xử lý thay đổi trang
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    updateQueryParams({ page: newPage });
  };

  // Xử lý áp dụng filter
  const handleApplyFilters = () => {
    setAppliedMinPrice(tempMinPrice);
    setAppliedMaxPrice(tempMaxPrice);
    setAppliedRating(tempRating);
    setPage(1); // Reset về trang 1 khi áp dụng filter
    updateQueryParams({
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
      rating: tempRating,
      page: 1,
    });
  };

  // Xử lý clear filter
  const handleClearFilters = () => {
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempRating(0);
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setAppliedRating(0);
    setPage(1);
    updateQueryParams({ minPrice: "", maxPrice: "", rating: "", page: 1 });
  };

  return (
    <Box>
      <Container>
        <Box py={2}>
          <Grid2 container spacing={1.5}>
            <Grid2 size={2}>
              <Box>
                <Link
                  sx={{
                    textDecoration: "none",
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  href={"/"}
                >
                  <MenuIcon />
                  All Categories
                </Link>
                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  {[...Array(5)].map((_, index) => (
                    <Link
                      key={index}
                      sx={{ textDecoration: "none", color: "text.primary" }}
                      href="/"
                    >
                      <Typography
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          WebkitLineClamp: 1,
                          textOverflow: "ellipsis",
                        }}
                        variant="body2"
                      >
                        Mot chiec xe
                      </Typography>
                    </Link>
                  ))}
                  <Typography
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "text.primary",
                    }}
                    variant="body2"
                  >
                    More <ArrowDropDownIcon />
                  </Typography>
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  <Typography sx={{ color: "text.primary" }} variant="body2">
                    Price
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-between"}
                  >
                    <Input
                      sx={{
                        fontSize: "12px",
                        maxWidth: "80px",
                        "&::before": { borderBottom: "1px solid black" },
                        "&:hover:not(.Mui-disabled):before": {
                          borderBottom: "2px solid black",
                        },
                        "&::after": { borderBottom: "2px solid black" },
                        "&.Mui-focused::after": {
                          borderBottom: "2px solid black",
                        },
                      }}
                      placeholder="Min"
                      type="number"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                    />
                    -
                    <Input
                      sx={{
                        fontSize: "12px",
                        maxWidth: "80px",
                        "&::before": { borderBottom: "1px solid black" },
                        "&:hover:not(.Mui-disabled):before": {
                          borderBottom: "2px solid black",
                        },
                        "&::after": { borderBottom: "2px solid black" },
                        "&.Mui-focused::after": {
                          borderBottom: "2px solid black",
                        },
                      }}
                      placeholder="Max"
                      type="number"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                    />
                  </Box>
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  <Typography sx={{ color: "text.primary" }} variant="body2">
                    Rating
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                    justifyContent={"space-between"}
                  >
                    <Rating
                      name="half-rating"
                      value={tempRating}
                      onChange={(e, newValue) => setTempRating(newValue)}
                      precision={0.5}
                    />
                  </Box>
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box my={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "info.main",
                      color: "common.white",
                    }}
                    onClick={handleApplyFilters}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "secondary.main", color: "common.white" }}
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 10 }}>
              {listError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  {listError?.data?.message ||
                    listError?.message ||
                    "An unexpected error occurred while loading products."}
                </Alert>
              )}
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={2}
                bgcolor={"rgba(0,0,0,.03)"}
                p={1.5}
                borderRadius={1}
                mb={2}
                boxShadow={" rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"}
              >
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  Sort by
                </Typography>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Popular
                </Button>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Latest
                </Button>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Price down
                </Button>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Price up
                </Button>
              </Box>
              <Grid2 container spacing={1.5} ref={flashSaleRef}>
                {listLoading ? (
                  [...Array(5)].map((_, index) => (
                    <Grid2
                      key={index}
                      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
                    >
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        animation="wave"
                      />
                    </Grid2>
                  ))
                ) : listProducts.length === 0 ? (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        height: "auto",
                        width: "200px",
                        objectFit: "cover",
                      }}
                      image={"/Assets/empty.png"}
                      loading="lazy"
                    />
                    <Typography>No products found</Typography>
                  </Box>
                ) : (
                  listProducts.map((item) =>
                    flashSaleInView ? (
                      <Grid2
                        key={item._id}
                        size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
                      >
                        <Suspense
                          fallback={
                            <Skeleton
                              variant="rectangular"
                              height={200}
                              animation="wave"
                            />
                          }
                        >
                          <ProductMini loading={listLoading} item={item} />
                        </Suspense>
                      </Grid2>
                    ) : null
                  )
                )}
              </Grid2>
              {listProducts.length > 0 && totalPages > 1 && (
                <Box justifyContent={"center"} display={"flex"} mt={4}>
                  <Pagination
                    size="large"
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    shape="rounded"
                    color="primary"
                  />
                </Box>
              )}
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
}

export default SearchLayout;
