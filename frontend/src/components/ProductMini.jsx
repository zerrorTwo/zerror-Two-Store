import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PRIMITIVE_URL } from "../redux/constants";

function ProductMini({ item, loading = false }) {
  const theme = useTheme();

  return (
    <Box>
      <Card
        sx={{
          maxWidth: "100%",
          boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px;",
          "&:hover": {
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
          },
        }}
      >
        <Link
          to={`/products/${item?.slug}`}
          style={{
            textDecoration: "none", // Remove underline from Link
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              animation="wave"
            />
          ) : (
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: { xs: "100px", sm: "200px" },
                objectFit: "cover",
              }}
              alt="product image"
              image={
                `${PRIMITIVE_URL}${item?.mainImg}` ||
                "https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m5ba8iu5zvur17"
              }
              loading="lazy"
            />
          )}
          <Divider />
          <CardContent
            sx={{
              p: 1,
              bgcolor: "common.white",
              pb: "10px !important",
            }}
          >
            {loading ? (
              <>
                <Skeleton width="100%" />
                <Skeleton width="70%" />
              </>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: "common.black",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  WebkitLineClamp: 2,
                  textOverflow: "ellipsis",
                }}
              >
                {item?.name}
              </Typography>
            )}

            <Box display={"flex"} alignItems={"center"} gap={2}>
              {loading ? (
                <Skeleton width="40%" />
              ) : (
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.primary.main }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item?.minPrice || item?.price || 10000)}
                </Typography>
              )}
              {!loading && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "bold",
                    textDecoration: "line-through",
                  }}
                >
                  -99%
                </Typography>
              )}
            </Box>

            <Box display={"flex"} alignItems={"center"} gap={1} mt={0.5}>
              {loading ? (
                <Skeleton width="30%" />
              ) : (
                <>
                  <Rating
                    size="small"
                    name="read-only"
                    value={5}
                    readOnly
                    sx={{
                      "& .MuiRating-icon": { fontSize: "15px" },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    ({item.totalSold})
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Link>
      </Card>
    </Box>
  );
}

ProductMini.propTypes = {
  item: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductMini;
