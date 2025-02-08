import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  useTheme,
  Skeleton,
} from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PRIMITIVE_URL } from "../redux/constants";

function ProductMini({ item, loading = false }) {
  const theme = useTheme();

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 192,
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
          <CardContent
            sx={{
              bgcolor: theme.palette.primary.main,
              p: 1,
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
                  sx={{ color: theme.palette.secondary.main }}
                >
                  {new Intl.NumberFormat("en-US").format(item?.price || 10000)}đ
                </Typography>
              )}
              {!loading && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.primary,
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
