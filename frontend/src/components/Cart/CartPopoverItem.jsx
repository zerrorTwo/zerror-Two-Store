import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function CartPopoverItem({ item }) {
  const theme = useTheme();

  return (
    <Link
      to={`/products/${item?.productSlug}`}
      style={{
        textDecoration: "none",
        display: "block",
      }}
    >
      <Box
        sx={{
          backgroundColor: "common.white",
          transition: "background-color 0.3s ease",
          "&:hover": {
            bgcolor: "whitesmoke",
          },
        }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        p={1.5}
      >
        <Box>
          <CardMedia
            component="img"
            sx={{
              height: "40px",
              width: "auto",
              objectFit: "cover",
            }}
            alt={item?.productSlug}
            image={
              `${item?.productImages}` ||
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1hz8y9e1ubj5e@resize_w450_nl.webp"
            }
            loading="lazy"
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            maxWidth: "200px",
            minWidth: "200px",
            color: "common.black",
            display: "-webkit-box", // Hiển thị như một box flex
            WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
            overflow: "hidden", // Ẩn nội dung tràn
            WebkitLineClamp: 1, // Giới hạn số dòng là 2
            textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
          }}
        >
          {item?.productName}
        </Typography>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.primary.main }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item?.variationPrice)}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

CartPopoverItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CartPopoverItem;
