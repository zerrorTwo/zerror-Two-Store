import { Box, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CartPopoverItem from "./CartPopoverItem";
import { Link } from "react-router-dom";

function CartPopover({ data, error, loading, onMouseEnter, onMouseLeave }) {
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
        {error ? (
          <Typography>{error}</Typography>
        ) : loading ? (
          <Typography>Loading...</Typography>
        ) : (
          data?.products?.map((item) => (
            <CartPopoverItem key={item._id} item={item} />
          ))
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
            {Math.abs(data?.totalItems - 5) || 0} More Products in Cart
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
