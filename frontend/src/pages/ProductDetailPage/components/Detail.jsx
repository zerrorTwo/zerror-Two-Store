import { Box, Chip, Divider, Rating, Typography } from "@mui/material";
import QuantityGroup from "../../../components/QuantityGroup";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PropTypes from "prop-types";

function Detail({ data, quantity, setQuantity }) {
  console.log(data.variations);
  return (
    <>
      {/* Name */}
      <Typography variant="h6" fontWeight={400}>
        {data?.name}
      </Typography>

      {/* Rating sold  */}
      <Box display={"flex"} gap={2}>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Typography variant="body1">4.8</Typography>
          <Rating name="read-only" value={4.8} readOnly size="small" />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Typography variant="body1">900</Typography>
          <Typography variant="body1" color="text.primary">
            Ratings
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Typography variant="body1">{data?.totalSold}</Typography>
          <Typography variant="body1" color="text.primary">
            Sold
          </Typography>
        </Box>
      </Box>

      {/* Price */}
      <Box display={"flex"} gap={2} alignItems={"center"} my={2}>
        <Typography variant="h4" color="secondary.main">
          {new Intl.NumberFormat("en-US").format(data?.price)}đ
        </Typography>
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ textDecoration: "line-through" }}
        >
          {new Intl.NumberFormat("en-US").format(1000000)}đ
        </Typography>
      </Box>

      {/* Variations */}
      <Box display={"flex"} gap={2} flexDirection={"column"}>
        <Box display={"flex"} gap={5}>
          <Typography variant="body1">Size</Typography>
          <Box display={"flex"} gap={1} flexWrap={"wrap"}>
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
          </Box>
        </Box>
        <Box display={"flex"} gap={5}>
          <Typography variant="body1">Size</Typography>
          <Box display={"flex"} gap={1} flexWrap={"wrap"}>
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
            <Chip
              sx={{ cursor: "pointer", color: "text.secondary" }}
              label="Chip Outlined"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Quantity  */}
      <Box display={"flex"} gap={2} alignItems={"center"} mt={5}>
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Typography variant="body1">Quantity:</Typography>

          <QuantityGroup quantity={quantity} setQuantity={setQuantity} />

          <Typography variant="body2" color="text.primary">
            800 pieces available:
          </Typography>
        </Box>
      </Box>

      {/* Add to cart */}
      <Box display={"flex"} justifyContent={"center"} mt={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "secondary.main",
            px: 4,
            py: 0.5,
            borderRadius: 1,
            color: "white",
            cursor: "pointer",
            gap: 1,
          }}
        >
          <AddShoppingCartIcon />
          Add To Cart
        </Box>
      </Box>
    </>
  );
}

Detail.propTypes = {
  data: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default Detail;
