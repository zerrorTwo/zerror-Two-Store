import React, { useState } from "react";
import {
  Box,
  Collapse,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useGetAllCategoryQuery } from "../../redux/api/categorySlice";

const TreeList = ({ selectedCategory, setSelectedCategory }) => {
  const { data: categories, isLoading, error } = useGetAllCategoryQuery();
  const [open, setOpen] = useState({});

  const handleClick = (name) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [name]: !prevOpen[name],
    }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <ListItem sx={{ display: "flex", alignItems: "center", py: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ width: `${level * 16}px` }} />
            <FormControlLabel
              control={
                <Radio
                  checked={
                    selectedCategory
                      ? selectedCategory._id === category._id
                      : false
                  }
                  onChange={() => handleCategorySelect(category)}
                  size="small"
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                />
              }
              label={category.name}
              labelPlacement="end"
            />
          </Box>
          {category.children && category.children.length > 0 ? (
            open[category.name] ? (
              <ExpandLess
                sx={{ cursor: "pointer" }}
                onClick={() => handleClick(category.name)}
              />
            ) : (
              <ExpandMore
                sx={{ cursor: "pointer" }}
                onClick={() => handleClick(category.name)}
              />
            )
          ) : null}
        </ListItem>
        {category.children && category.children.length > 0 && (
          <Collapse in={open[category.name]} timeout="auto" unmountOnExit>
            {renderCategories(category.children, level + 1)}
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching categories</Typography>;

  return <List>{categories && renderCategories(categories)}</List>;
};

TreeList.propTypes = {
  selectedCategory: PropTypes.object, // Expecting selectedCategory as an object
  setSelectedCategory: PropTypes.func.isRequired, // Expecting setSelectedCategory as a function
};

export default TreeList;
