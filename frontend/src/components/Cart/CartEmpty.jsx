import { Box, Button, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router";

function CartEmpty() {
  const navigate = useNavigate();
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
      <Box
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
            width: "200px",
            objectFit: "cover",
          }}
          image={"/Assets/cart.png"}
          loading="lazy"
        />
        <Typography variant="h6">The cart feels empty.</Typography>
        <Typography variant="body1">
          Hey there, shop now to get exclusive deals from 2Store!
        </Typography>
        <Button
          onClick={() => {
            // Navigate to home page or product page
            navigate("/");
          }}
          sx={{
            boxShadow: "none",
            bgcolor: "secondary.main",
            color: "white",
            px: 5,
          }}
          variant="contained"
        >
          Shop now
        </Button>
      </Box>
    </Box>
  );
}

export default CartEmpty;
