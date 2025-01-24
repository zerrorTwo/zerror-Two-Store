import { Box, CardMedia, Typography, useTheme } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import MenuIcon from "@mui/icons-material/Menu";
import ImageListItem from "@mui/material/ImageListItem";
import { Link } from "react-router-dom";

export default function CategoryTable() {
  const theme = useTheme();
  return (
    <>
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <MenuIcon />
        <Typography variant="h5">List category</Typography>
        {/* Add your own code here */}
      </Box>
      {/* <Paper elevation={5} sx={{ bgcolor: "transparent" }}> */}
      <ImageList
        sx={{
          py: 1,
          px: 0.5,
          width: "100%",
          overflow: "hidden", // Prevent overflow
          maxHeight: "500px", // Set a max height for the list
        }}
        cols={8}
        rowHeight={100}
      >
        {itemData.map((item, index) => (
          <ImageListItem
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "visible", // Ensure the box-shadow is not clipped
              padding: "5px", // Optional: Padding between items
            }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none", // Remove underline from Link
                width: "100%",
                height: "100%",
                color: theme.palette.text.primary,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    // transform: "scale(1.05)", // Optionally add scaling effect on hover
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)", // Apply box-shadow on hover
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  sx={{
                    mt: 1,
                    borderRadius: "8px",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    maxWidth: "50px", // Ensure uniform image size
                    maxHeight: "50px",
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.875rem",
                    color: theme.palette.text.primary,
                    textAlign: "center",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    width: "100%",
                    wordBreak: "break-word", // Allow text to break onto the next line
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
      {/* </Paper> */}
    </>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast sdhsdjsdsdjs",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Mach dien va linh kien",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Mach dien va linh kien",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
];
