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
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { lazy, Suspense, useState, useEffect } from "react";
import { useGetPageProductQuery } from "../../redux/api/productSlice";
import { useInView } from "react-intersection-observer";
import { CardMedia, Grid2, Pagination } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetCommonCategoryQuery } from "../../redux/api/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductMini = lazy(() => import("../../components/ProductMini"));

function SearchLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  // State for query parameters
  const [page, setPage] = useState(parseInt(query.get("page")) || 1);
  const [limit] = useState(parseInt(query.get("limit")) || 30);
  const [category] = useState(query.get("category") || "");
  const [search] = useState(query.get("name") || "");
  const [appliedMinPrice, setAppliedMinPrice] = useState(
    query.get("minPrice") || "0"
  );
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(
    query.get("maxPrice") || ""
  );
  const [appliedRating, setAppliedRating] = useState(
    parseFloat(query.get("rating")) || 0
  );
  const [sort, setSort] = useState(query.get("sort") || "sold-desc"); // Default to "sold-desc" (Popular)

  // Temporary state for filters
  const [tempMinPrice, setTempMinPrice] = useState(
    query.get("minPrice") || "0"
  );
  const [tempMaxPrice, setTempMaxPrice] = useState(query.get("maxPrice") || "");
  const [tempRating, setTempRating] = useState(
    parseFloat(query.get("rating")) || 0
  );

  // Fetch product data with sort parameter
  const {
    data: { products: listProducts = [], totalPages = 0, refCategories } = {},
    error: listError,
    isLoading: listLoading,
  } = useGetPageProductQuery(
    {
      page,
      limit,
      category,
      search,
      minPrice: appliedMinPrice || undefined,
      maxPrice: appliedMaxPrice || undefined,
      rating: appliedRating || undefined,
      sort: sort, // Pass sortStage to query
    },
    {
      // Ensure query refetches when sort changes
      queryKey: [
        "products",
        {
          page,
          limit,
          category,
          search,
          minPrice: appliedMinPrice,
          maxPrice: appliedMaxPrice,
          rating: appliedRating,
          sort,
        },
      ],
    }
  );

  // Fetch level 1 categories when no category is selected
  const { data: level1 = [] } = useGetCommonCategoryQuery(undefined, {
    skip: !!category,
  });

  const [flashSaleRef, flashSaleInView] = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  });

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  // Update URL with query parameters
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

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    updateQueryParams({ page: newPage });
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setSort(sortValue);
    setPage(1); // Reset to page 1 when sorting changes
    updateQueryParams({ sort: sortValue, page: 1 });
  };

  // Validate and handle input changes for minPrice
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
      setTempMinPrice(value);
    }
  };

  // Validate and handle input changes for maxPrice
  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
      setTempMaxPrice(value);
    }
  };

  // Handle apply filters with validation
  const handleApplyFilters = () => {
    const minPrice = tempMinPrice === "" ? 0 : Number(tempMinPrice);
    const maxPrice = tempMaxPrice === "" ? undefined : Number(tempMaxPrice);

    if (maxPrice !== undefined && maxPrice < minPrice) {
      toast.error("Max price must be greater than or equal to min price", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setAppliedMinPrice(minPrice.toString());
    setAppliedMaxPrice(maxPrice ? maxPrice.toString() : "");
    setAppliedRating(tempRating);
    setPage(1);
    updateQueryParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice ? maxPrice.toString() : "",
      rating: tempRating,
      page: 1,
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setTempMinPrice("0");
    setTempMaxPrice("");
    setTempRating(0);
    setAppliedMinPrice("0");
    setAppliedMaxPrice("");
    setAppliedRating(0);
    setPage(1);
    updateQueryParams({ minPrice: "0", maxPrice: "", rating: "", page: 1 });
  };

  return (
    <Box>
      <ToastContainer />
      <Container>
        <Box py={2}>
          <Grid2 container spacing={3}>
            <Grid2 size={2}>
              <Box>
                <Typography
                  onClick={() => (window.location.href = "/search")}
                  variant="h5"
                  sx={{
                    cursor: "pointer",
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <MenuIcon />
                  All Categories
                </Typography>
                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  {category && refCategories ? (
                    <>
                      {refCategories.parents?.map((parent) => (
                        <Link
                          key={parent._id}
                          href={`search?category=${parent.slug}`}
                          style={{
                            textDecoration: "none",
                            color: "#333333", // tương đương text.primary
                          }}
                        >
                          <Typography
                            variant="body2"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              textOverflow: "ellipsis",
                            }}
                          >
                            {parent.name}
                          </Typography>
                        </Link>
                      ))}
                      {refCategories.current && (
                        <Link
                          key={refCategories.current._id}
                          sx={{
                            textDecoration: "none",
                            color: "text.primary",
                            fontWeight: "bold",
                            pl: 2,
                          }}
                          href={`search?category=${refCategories.current.slug}`}
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
                            {refCategories.current.name}
                          </Typography>
                        </Link>
                      )}
                      {refCategories.children?.length > 0 &&
                        refCategories.children.map((child) => (
                          <Link
                            key={child._id}
                            sx={{
                              textDecoration: "none",
                              color: "text.primary",
                              pl: 4,
                            }}
                            href={`search?category=${child.slug}`}
                          >
                            <Typography
                              sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                WebkitLineClamp: 1,
                              }}
                              variant="body2"
                            >
                              {child.name}
                            </Typography>
                          </Link>
                        ))}
                    </>
                  ) : (
                    <>
                      {level1?.map((cat) => (
                        <Link
                          key={cat._id}
                          sx={{ textDecoration: "none", color: "text.primary" }}
                          href={`search?category=${cat.slug}`}
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
                            {cat.name}
                          </Typography>
                        </Link>
                      ))}
                    </>
                  )}
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  <Typography sx={{ color: "text.primary" }} variant="h6">
                    Price
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    gap={1}
                    justifyContent={"space-between"}
                    alignContent={"center"}
                    textAlign={"center"}
                  >
                    <Box>
                      <Input
                        sx={{
                          fontSize: "16px",
                          maxWidth: "100px",
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
                        onChange={handleMinPriceChange}
                      />
                      {tempMinPrice && (
                        <Typography
                          maxWidth={"100px"}
                          variant="body2"
                          sx={{
                            textAlign: "left",
                            overflow: "hidden",
                            color: "text.secondary",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(tempMinPrice)}đ
                        </Typography>
                      )}
                    </Box>
                    -
                    <Box>
                      <Input
                        sx={{
                          fontSize: "16px",
                          maxWidth: "100px",
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
                        value={tempMaxPrice || 0}
                        onChange={handleMaxPriceChange}
                      />
                      {
                        <Typography
                          maxWidth={"100px"}
                          variant="body2"
                          sx={{
                            textAlign: "left",
                            overflow: "hidden",
                            color: "text.secondary",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(tempMaxPrice)}đ
                        </Typography>
                      }
                    </Box>
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
                  sx={{
                    color:
                      sort === "sold-desc" ? "common.white" : "text.primary",
                    borderColor: "text.primary",
                    bgcolor:
                      sort === "sold-desc" ? "primary.light" : "transparent",
                  }}
                  variant={sort === "sold-desc" ? "contained" : "outlined"}
                  onClick={() => handleSortChange("sold-desc")}
                >
                  Popular
                </Button>
                <Button
                  sx={{
                    color:
                      sort === "created-desc" ? "common.white" : "text.primary",
                    borderColor: "text.primary",
                    bgcolor:
                      sort === "created-desc" ? "primary.light" : "transparent",
                  }}
                  variant={sort === "created-desc" ? "contained" : "outlined"}
                  onClick={() => handleSortChange("created-desc")}
                >
                  Latest
                </Button>
                <Button
                  sx={{
                    color:
                      sort === "price-desc" ? "common.white" : "text.primary",
                    borderColor: "text.primary",
                    bgcolor:
                      sort === "price-desc" ? "primary.light" : "transparent",
                  }}
                  variant={sort === "price-desc" ? "contained" : "outlined"}
                  onClick={() => handleSortChange("price-desc")}
                >
                  Price down
                </Button>
                <Button
                  sx={{
                    color:
                      sort === "price-asc" ? "common.white" : "text.primary",
                    borderColor: "text.primary",
                    bgcolor:
                      sort === "price-asc" ? "primary.light" : "transparent",
                  }}
                  variant={sort === "price-asc" ? "contained" : "outlined"}
                  onClick={() => handleSortChange("price-asc")}
                >
                  Price up
                </Button>
              </Box>
              <Grid2 container spacing={1.5} ref={flashSaleRef}>
                {listLoading ? (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: 200,
                    }}
                  >
                    <CircularProgress />
                  </Box>
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
                        size={{ xs: 12, sm: 6, md: 4, lg: 2.4, xl: 2.4 }}
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
