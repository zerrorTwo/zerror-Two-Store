import { Link } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import {
  Box,
  Button,
  ButtonGroup,
  CardMedia,
  Grid2,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";

// import PropTypes from "prop-types";

function CartDetailItem() {
  const [quantity, setQuantity] = useState(1);
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  return (
    <Grid2 container sx={{ alignItems: "center" }}>
      <Grid2 size={6}>
        <Box display={"flex"} alignItems={"center"} gap={0}>
          <Checkbox
            sx={{
              color: "text.primary", // Unchecked color
              "&.Mui-checked": {
                color: "secondary.main", // Checked color
              },
            }}
          />
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "block",
            }}
          >
            <Box display={"flex"} gap={1} overflow={"hidden"}>
              <CardMedia
                component="img"
                sx={{
                  height: "80px",
                  width: "auto",
                  objectFit: "cover",
                }}
                alt="green iguana"
                image={
                  "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1hz8y9e1ubj5e@resize_w450_nl.webp"
                }
                loading="lazy"
              />
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "200px",
                  minWidth: "200px",
                  color: "common.black",
                  lineHeight: "20px",
                  display: "-webkit-box", // Hiển thị như một box flex
                  WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                  overflow: "hidden", // Ẩn nội dung tràn
                  WebkitLineClamp: 2, // Giới hạn số dòng là 2
                  textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                  wordBreak: "break-all",
                  maxHeight: "40px",
                }}
              >
                Quần Lót Nam [ COMBO 5C] boxer nam thun lạnh thoáng khí co giãn
                4 chiều set 5 màu CK02
              </Typography>
            </Box>
          </Link>
          <Box
            ml={4}
            mr={2}
            display={"flex"}
            flexDirection={"column"}
            sx={{ cursor: "pointer" }}
          >
            <Typography
              sx={{
                display: "flex",
                color: "text.primary",
                alignItems: "center",
              }}
              variant="body2"
            >
              Variations: <ArrowDropDownIcon />
            </Typography>
            <Typography
              sx={{
                color: "text.primary",
                lineHeight: "20px",
                display: "-webkit-box", // Hiển thị như một box flex
                WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                overflow: "hidden", // Ẩn nội dung tràn
                WebkitLineClamp: 2, // Giới hạn số dòng là 2
                textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                wordBreak: "break-all",
                maxHeight: "40px",
              }}
              variant="body2"
            >
              5 Tam giác Full Trắg,4XL: 7dsdsdsd9 - 90 KG
            </Typography>
          </Box>
        </Box>
      </Grid2>
      <Grid2 size={6}>
        <Grid2
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid2 size={4}>
            <Box display={"flex"} flexDirection={"row"} gap={1}>
              <Typography
                sx={{
                  color: "text.primary",
                  textDecoration: "line-through",
                }}
                variant="body2"
              >
                {new Intl.NumberFormat("en-US").format(1000000)}đ
              </Typography>
              <Typography variant="body2">
                {new Intl.NumberFormat("en-US").format(1000000)}đ
              </Typography>
            </Box>
          </Grid2>
          <Grid2 size={3}>
            <Box sx={{ justifyContent: "center" }}>
              <ButtonGroup size="small" aria-label="Small button group">
                <Button
                  onClick={() => handleDecreaseQuantity()}
                  key="one"
                  sx={{
                    color: "text.primary", // Màu chữ
                    borderColor: "text.primary", // Màu viền
                    // "&:hover": {
                    //   backgroundColor: "rgba(255, 0, 0, 0.1)", // Màu nền khi hover
                    // },
                  }}
                >
                  -
                </Button>
                <input
                  type="tel"
                  key="two"
                  style={{
                    width: "45px",
                    textAlign: "center",
                    color: "text.primary", // Màu chữ trong input
                  }}
                  value={quantity}
                  onInput={(e) =>
                    setQuantity(e.target.value.replace(/[^0-9]/g, ""))
                  } // Chỉ cho phép nhập số
                />

                <Button
                  onClick={() => handleIncreaseQuantity()}
                  key="three"
                  sx={{
                    color: "text.primary", // Màu chữ
                    borderColor: "text.primary", // Màu viền
                    // "&:hover": {
                    //   backgroundColor: "rgba(255, 0, 0, 0.1)", // Màu nền khi hover
                    // },
                  }}
                >
                  +
                </Button>
              </ButtonGroup>
            </Box>
          </Grid2>
          <Grid2 size={3} textAlign={"center"}>
            <Typography variant="body2" sx={{ color: "secondary.main" }}>
              {new Intl.NumberFormat("en-US").format(1000000)}đ
            </Typography>
          </Grid2>
          <Grid2 size={2} textAlign={"center"}>
            <Typography
              sx={{
                color: "text.primary",
                cursor: "pointer",
                "&:hover": {
                  color: "secondary.main",
                },
              }}
              variant="body1"
            >
              Delete
            </Typography>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

// CartPopoverItem.propTypes = {
// };

export default CartDetailItem;
