import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import CartPopoverItem from "./CartPopoverItem";
import { Link } from "react-router-dom";

function CartPopover({ data, error, loading, onMouseEnter, onMouseLeave }) {
  const number = data?.totalItems > 5 ? data?.totalItems - 5 : 0;
  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      position={"absolute"}
      top={"95%"}
      right={"0px"}
      minWidth={"300px"}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 1 }}>Recently Added Products</Box>
        {!data?.totalItems ? (
          <Box
            bgcolor={"white"}
            display={"flex"}
            flexDirection={"column"}
            width={"100%"}
            alignItems={"center"}
            gap={1}
          >
            <CardMedia
              component="img"
              sx={{
                height: "auto",
                width: "100px",
                objectFit: "cover",
              }}
              image={"/Assets/cart.png"}
              loading="lazy"
            />
            <Typography variant="h6">Nothing here.</Typography>
          </Box>
        ) : (
          <>
            {error ? (
              <Typography key="error">{error}</Typography>
            ) : loading ? (
              <Typography key="loading">Loading...</Typography>
            ) : (
              data?.products?.map((item, index) => (
                <CartPopoverItem key={index} item={item} />
              ))
            )}
          </>
        )}

        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "white",
          }}
        >
          <Typography variant="body2">
            {number} More Products in Cart
          </Typography>
          <Box
            sx={{ bgcolor: "secondary.main", px: 1, py: 0.5, borderRadius: 1 }}
          >
            <Link
              style={{
                textDecoration: "none",
                display: "block",
                color: "white",
                bgcolor: "secondary.main",
              }}
              to={"/cart"}
            >
              View All Cart
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

CartPopover.propTypes = {
  data: PropTypes.object.isRequired,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default CartPopover;
