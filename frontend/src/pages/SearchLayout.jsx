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
import { lazy, Suspense, useState } from "react";
import { useGetPageProductQuery } from "../redux/api/productSlice";
import { useInView } from "react-intersection-observer";
import { CardMedia, Grid2 } from "@mui/material";
import { useLocation } from "react-router-dom";

function SearchLayout() {
  const [rating, setRating] = useState(0);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("category"); // Get category from query
  console.log(category);
  const search = query.get("name"); // Get category from query

  const {
    data: { products: listProducts = [] } = {},
    error: listError,
    isLoading: listLoading,
  } = useGetPageProductQuery({
    page: 1,
    limit: 50,
    search: search,
    category: category,
    sort: "sold-desc",
  });

  const ProductMini = lazy(() => import("../components/ProductMini"));

  const [flashSaleRef, flashSaleInView] = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  });

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
                      sx={{
                        textDecoration: "none",
                        color: "text.primary",
                      }}
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
                        "&::before": {
                          borderBottom: "1px solid black",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderBottom: "2px solid black",
                        },
                        "&::after": {
                          borderBottom: "2px solid black",
                        },
                        "&.Mui-focused::after": {
                          borderBottom: "2px solid black",
                        },
                      }}
                      placeholder="Min"
                      type="number"
                    />
                    -
                    <Input
                      sx={{
                        fontSize: "12px",
                        maxWidth: "80px",
                        "&::before": {
                          borderBottom: "1px solid black",
                        },
                        "&:hover:not(.Mui-disabled):before": {
                          borderBottom: "2px solid black",
                        },
                        "&::after": {
                          borderBottom: "2px solid black",
                        },
                        "&.Mui-focused::after": {
                          borderBottom: "2px solid black",
                        },
                      }}
                      placeholder="Max"
                      type="number"
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
                      value={rating}
                      onChange={(e) => setRating(+e.target.value)}
                      precision={0.5}
                    />
                  </Box>
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box my={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "secondary.main", color: "common.white" }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Grid2>
            <Grid2 size={10}>
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
                  Lastest
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
                {listProducts.length === 0 ? (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
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
                  </Box>
                ) : (
                  listProducts.map((item, index) =>
                    flashSaleInView ? (
                      <Grid2 key={index} size={2.4}>
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
              {listProducts.length !== 0 && (
                <Box justifyContent={"center"} display={"flex"} mt={4}>
                  <Link
                    to="/"
                    style={{
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ px: 10 }}
                    >
                      See more
                    </Button>
                  </Link>
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
