import { Box, CardMedia, Container, Typography } from "@mui/material";

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
            color: "secondary.main",
            cursor: "pointer",
          }}
          variant="h5"
          gutterBottom
        >
          Go to your order &gt;
        </Typography>
      </Box>
    </Container>
  );
}

export default Thanks;
