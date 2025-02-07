import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { PRIMITIVE_URL } from "../redux/constants";

function ProductMini({ item }) {
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
          to={`${item?.slug}`}
          style={{
            textDecoration: "none", // Remove underline from Link
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: { xs: "100px", sm: "200px" },
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              `${PRIMITIVE_URL}${item?.mainImg}` ||
              "https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m5ba8iu5zvur17"
            }
            loading="lazy"
          />
          <CardContent
            sx={{
              bgcolor: theme.palette.primary.main,
              p: 1,
              pb: "10px !important",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "common.black",
                display: "-webkit-box", // Hiển thị như một box flex
                WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                overflow: "hidden", // Ẩn nội dung tràn
                WebkitLineClamp: 2, // Giới hạn số dòng là 2
                textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
              }}
            >
              {item?.name} || Lizards are a group of squamate reptiles, with
              over 6,000 species, ranging across all continents except
              Antarctica
            </Typography>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.secondary.main }}
              >
                {new Intl.NumberFormat("en-US").format(item?.price || 10000)}đ
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.primary,
                  textDecoration: "line-through",
                }}
              >
                -99%
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={1} mt={0.5}>
              <Rating
                size="small"
                name="read-only"
                value={5}
                readOnly
                sx={{
                  "& .MuiRating-icon": { fontSize: "15px" }, // Điều chỉnh kích thước icon
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.primary }}
              >
                (100)
              </Typography>
            </Box>
          </CardContent>
        </Link>
      </Card>
    </Box>
  );
}

ProductMini.propTypes = {
  item: PropTypes.object,
};

export default ProductMini;
