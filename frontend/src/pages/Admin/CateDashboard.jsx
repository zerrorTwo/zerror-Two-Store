import { useState } from "react";
import { Box, Divider, TextField, Typography, useTheme } from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import TreeList from "./TreeList";
import ButtonPrimary from "../../components/ButtonPrimary";

function CateDashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, my: 3, mx: 1 }}>
      <Box>
        <Typography variant="h4" sx={{ color: theme.palette.text.secondary }}>
          Category Dashboard
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          py: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box sx={{ width: "50%", display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#3E7B27",
              alignItems: "center",
              display: "flex",
              gap: 1,
            }}
          >
            <SentimentSatisfiedAltIcon />
            Create new or select one to create category
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <ButtonPrimary text="Create new category" />
            {/* Add functionality to handle creating new category */}
          </Box>
          {/* Pass selectedCategory and setSelectedCategory to TreeList */}
          <TreeList
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          {/* Display selected category */}
          {selectedCategory && (
            <Typography sx={{ mt: 2, color: "#3E7B27" }}>
              Selected Category: {selectedCategory}
            </Typography>
          )}
        </Box>
        <Box sx={{ width: "1%", height: "auto" }}>
          <Divider
            orientation="vertical"
            sx={{ backgroundColor: "white", width: "2px", height: "100%" }}
          />
        </Box>
        <Box sx={{ width: "49%" }} component="form">
          <TextField
            sx={{
              borderRadius: 1,
              "& .MuiInputLabel-root": {
                color: theme.palette.text.primary,
                "&.Mui-focused": {
                  color: theme.palette.text.primary,
                },
              },
              "& .MuiInputBase-input": {
                color: theme.palette.text.primary,
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.text.primary,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.text.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.text.primary,
                },
              },
            }}
            fullWidth
            id="add-field"
            FormHelperTextProps={{
              sx: { color: "#FE0032", fontStyle: "italic" },
            }}
            label="Write category name"
            type="search"
          />
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <ButtonPrimary text="Add" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CateDashboard;
