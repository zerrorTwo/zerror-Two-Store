import { Link } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import {
  Box,
  CardMedia,
  Grid2,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import QuantityGroup from "../QuantityGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import CartVariationPopover from "./CartVariationPopover";
import PropTypes from "prop-types";
import { PRIMITIVE_URL } from "../../redux/constants";

function CartDetailItem({
  productName,
  productSlug,
  productImages,
  variation,
  selected = [],
  onSelect,
  allVariations,
}) {
  const [quantity, setQuantity] = useState(variation.quantity);
  const [anchorEl, setAnchorEl] = useState(null);
  const isChecked = selected.includes(`${productSlug}-${variation.type}`); // So sánh ID duy nhất

  const handleCheckboxChange = (event) => {
    const itemId = `${productSlug}-${variation.type}`; // Tạo ID duy nhất cho mỗi variation
    onSelect(itemId, event.target.checked); // Truyền ID duy nhất
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        p: 1,
        py: 2,
        borderRadius: 1,
        boxShadow:
          " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
      }}
    >
      <Grid2 container sx={{ alignItems: "center" }}>
        <Grid2 size={6}>
          <Box display={"flex"} alignItems={"center"} gap={0}>
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
              sx={{
                color: "text.primary",
                "&.Mui-checked": {
                  color: "secondary.main",
                },
              }}
            />
            <Box
              display={"flex"}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={1}
              overflow={"hidden"}
            >
              <Link
                to={`/products/${productSlug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: "80px",
                    width: "auto",
                    objectFit: "cover",
                  }}
                  alt={productName}
                  image={`${PRIMITIVE_URL}${productImages}`}
                  loading="lazy"
                />
              </Link>
              <Box display={"flex"} flexDirection={"column"}>
                <Link
                  to={`/product/${productSlug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "common.black",
                      lineHeight: "20px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 2,
                      textOverflow: "ellipsis",
                      wordBreak: "break-all",
                      maxHeight: "40px",
                      "&:hover": {
                        color: "secondary.main",
                      },
                    }}
                  >
                    {productName}
                  </Typography>
                </Link>
                <Box
                  onClick={handleClick}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  border={1}
                  borderColor="grey.300"
                  borderRadius={1}
                  px={1}
                  py={0.5}
                  mt={1}
                  sx={{
                    cursor: "pointer",
                    maxWidth: "200px",
                    minWidth: "200px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {Object.values(variation?.type).join(", ")}
                  </Typography>
                  <ArrowDropDownIcon fontSize="small" />
                </Box>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <CartVariationPopover
                    data={allVariations}
                    onClose={handleClose}
                    initAttribute={variation?.type}
                  />
                </Popover>
              </Box>
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
              <Box
                display={"flex"}
                flexDirection={"column-reverse"}
                gap={1}
                textAlign={"center"}
              >
                <Typography
                  variant="body1"
                  fontWeight={"bold"}
                  sx={{ color: "secondary.main" }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(variation.price)}
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={5}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <QuantityGroup quantity={quantity} setQuantity={setQuantity} />
              </Box>
            </Grid2>
            <Grid2 size={3} textAlign={"center"}>
              <Tooltip title={"Delete"}>
                <DeleteIcon
                  color="error"
                  sx={{ cursor: "pointer" }}
                  fontSize="small"
                />
              </Tooltip>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}

CartDetailItem.propTypes = {
  productName: PropTypes.string.isRequired,
  productSlug: PropTypes.string.isRequired,
  productImages: PropTypes.string.isRequired,
  variation: PropTypes.object.isRequired,
  allVariations: PropTypes.object.isRequired,
  selected: PropTypes.array,
  onSelect: PropTypes.func,
};

export default CartDetailItem;
