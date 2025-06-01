import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetPageProductQuery } from "../../redux/api/productSlice";
import { useGetCommonCategoryQuery } from "../../redux/api/categorySlice";
import { useInView } from "react-intersection-observer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import CircularProgress from "@mui/material/CircularProgress";
import { CardMedia, Grid2, Pagination } from "@mui/material";
import { lazy, Suspense } from "react";

const ProductMini = lazy(() => import("../../components/ProductMini"));

function SearchLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  // State for query parameters
  const [page, setPage] = useState(parseInt(query.get("page")) || 1);
  const [limit] = useState(parseInt(query.get("limit")) || 30);
  const [category, setCategory] = useState(query.get("category") || "");
  const [search, setSearch] = useState(query.get("name") || "");
  const [appliedMinPrice, setAppliedMinPrice] = useState(
    query.get("minPrice") || "0"
  );
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(
    query.get("maxPrice") || ""
  );
  const [appliedRating, setAppliedRating] = useState(
    parseFloat(query.get("rating")) || 0
  );
  const [sort, setSort] = useState(query.get("sort") || "sold-desc");

  // Temporary state for filters
  const [tempMinPrice, setTempMinPrice] = useState(
    query.get("minPrice") || "0"
  );
  const [tempMaxPrice, setTempMaxPrice] = useState(query.get("maxPrice") || "");
  const [tempRating, setTempRating] = useState(
    parseFloat(query.get("rating")) || 0
  );

  // Sync state with URL query parameters
  useEffect(() => {
    const newQuery = new URLSearchParams(location.search);
    setPage(parseInt(newQuery.get("page")) || 1);
    setCategory(newQuery.get("category") || "");
    setSearch(newQuery.get("name") || "");
    setAppliedMinPrice(newQuery.get("minPrice") || "0");
    setAppliedMaxPrice(newQuery.get("maxPrice") || "");
    setAppliedRating(parseFloat(newQuery.get("rating")) || 0);
    setSort(newQuery.get("sort") || "sold-desc");
    setTempMinPrice(newQuery.get("minPrice") || "0");
    setTempMaxPrice(newQuery.get("maxPrice") || "");
    setTempRating(parseFloat(newQuery.get("rating")) || 0);
  }, [location.search]);

  // Fetch product data
  const {
    data: { products: listProducts = [], totalPages = 0, refCategories } = {},
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
    sort,
  });

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
    setPage(1);
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
            <Grid2 size={2.2}>
              <Box>
                <Typography
                  variant="h6"
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
                          to={`/search?category=${parent.slug}`}
                          style={{
                            textDecoration: "none",
                            color: "#333333",
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
                              color: "text.primary",
                              textDecoration: "none",
                            }}
                          >
                            {parent.name}
                          </Typography>
                        </Link>
                      ))}
                      {refCategories.current && (
                        <Link
                          key={refCategories.current._id}
                          to={`/search?category=${refCategories.current.slug}`}
                          style={{
                            textDecoration: "none",
                            color: "#C94A00",
                            fontWeight: "bold",
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
                            {refCategories.current.name}
                          </Typography>
                        </Link>
                      )}
                      {refCategories.children?.length > 0 &&
                        refCategories.children.map((child) => (
                          <Link
                            key={child._id}
                            to={`/search?category=${child.slug}`}
                            style={{
                              paddingLeft: "16px",
                              textDecoration: "none",
                              color: "#333333",
                            }}
                          >
                            <Typography
                              sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                WebkitLineClamp: 1,
                                textDecoration: "none",
                                color: "#333333",
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
                          to={`/search?category=${cat.slug}`}
                          style={{
                            textDecoration: "none",
                            color: "#333333",
                          }}
                        >
                          <Typography
                            sx={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              textOverflow: "ellipsis",
                              textDecoration: "none",
                              color: "#333333",
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
                  <Typography sx={{ color: "text.primary" }} variant="body1">
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
                        value={tempMaxPrice || ""}
                        onChange={handleMaxPriceChange}
                      />
                      {tempMaxPrice && (
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
                      )}
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
                      onChange={(e, newValue) => setTempRating(newValue || 0)}
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
                      boxShadow: "none",
                      bgcolor: "info.main",
                      color: "common.white",
                      "&:hover": {
                        boxShadow: "none",
                      },
                    }}
                    onClick={handleApplyFilters}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      boxShadow: "none",
                      bgcolor: "secondary.main",
                      color: "common.white",
                      "&:hover": {
                        boxShadow: "none",
                      },
                    }}
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 9.8 }}>
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
              {listError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  {listError?.data?.message ||
                    listError?.message ||
                    "An unexpected error occurred while loading products."}
                </Alert>
              )}
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
