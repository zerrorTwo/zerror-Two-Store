import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

function Thanks() {
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CardMedia
          component="img"
          sx={{ width: "40%", objectFit: "cover" }}
          alt="Product Image"
          image="/Assets/thanks.png"
          loading="lazy"
        />
        <Typography variant="h5" gutterBottom>
          Thank you for your purchase!
        </Typography>
        <Typography
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
          }}
          variant="h5"
          gutterBottom
        >
          <Link
            style={{
              color: "orange",
            }}
            to={"/profile/my-order"}
          >
            Go to your order &gt;
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Thanks;
