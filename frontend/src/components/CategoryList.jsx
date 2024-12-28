import React from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress, Typography } from "@mui/material";
import ButtonOutLined from "./ButtonOutLined.jsx";

const CategoryList = React.memo(({ category, isLoading }) => {
  if (isLoading) {
    return <CircularProgress color="inherit" />;
  }

  return (
    <Box
      display={{ xs: "block", md: "flex" }}
      sx={{ gap: 2, flexWrap: "wrap" }}
    >
      {category.length === 0 ? (
        <Typography>No categories available.</Typography>
      ) : (
        category.map((item) => (
          <ButtonOutLined key={item._id} text={item.name} />
        ))
      )}
    </Box>
  );
});

CategoryList.displayName = "CategoryList";

CategoryList.propTypes = {
  category: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CategoryList;
