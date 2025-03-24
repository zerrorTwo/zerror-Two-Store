import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import PropTypes from "prop-types"; // Import PropTypes
import { PRIMITIVE_URL } from "../../redux/constants";
import { Grid2 } from "@mui/material";

function CheckoutProduct({ item, name, img, price }) {
  return (
    <Box>
      <Grid2 container sx={{ alignItems: "center" }}>
        <Grid2 size={6}>
          <Box display="flex" alignItems="center" gap={0}>
            <Box display="flex" flexDirection="row" gap={1} overflow="hidden">
              <CardMedia
                component="img"
                src={`${PRIMITIVE_URL}${img}`}
                sx={{ height: "80px", width: "auto", objectFit: "cover" }}
                loading="lazy"
              />
              <Box display="flex" flexDirection="column">
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
                  {name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "text.primary",
                  }}
                >
                  {item?.type
                    ? `Variation: ${Object.values(item.type).join(", ")}`
                    : ""}
                </Typography>
                {/* <textarea
                  style={{
                    borderRadius: "2px",
                    height: "20px",
                    padding: "5px",
                  }}
                  placeholder="Message"
                /> */}
              </Box>
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={6}>
          <Grid2 container justifyContent="center" alignItems="center">
            <Grid2 size={4} textAlign="center">
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="body1" color="text.secondary">
                  Unit Price
                </Typography>
                <Typography fontWeight="bold" color="secondary.main">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item?.price || price)}
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={5} textAlign="center">
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="body1" color="text.secondary">
                  Qty
                </Typography>
                <Typography fontWeight="bold" color="secondary.main">
                  {item?.quantity}
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={3} textAlign="center">
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="body1" color="text.secondary">
                  Item Subtotal
                </Typography>
                <Typography fontWeight="bold" color="secondary.main">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    item?.price * item?.quantity || price * item?.quantity
                  )}
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}

CheckoutProduct.propTypes = {
  item: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
};

export default CheckoutProduct;
