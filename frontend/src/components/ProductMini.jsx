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
import { Link } from "react-router";

function ProductMini({ img }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        maxWidth: 192,
        "&:hover": {
          boxShadow:
            "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
        },
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none", // Remove underline from Link
          width: "100%",
          height: "100%",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="green iguana"
          image={img}
          loading="lazy"
        />
        <CardContent
          sx={{ bgcolor: "common.white", p: 1, pb: "10px !important" }}
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
            Lizards are a group of squamate reptiles, with over 6,000 species,
            ranging across all continents except Antarctica
          </Typography>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.secondary.main }}
            >
              {new Intl.NumberFormat("en-US").format(1000000)}đ
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
  );
}

ProductMini.propTypes = {
  img: PropTypes.string.isRequired,
};

export default ProductMini;
