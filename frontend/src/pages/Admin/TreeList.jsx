const categories = [
  {
    _id: "6772684ec72cff4922b047cb",
    name: "Clothing",
    children: [
      {
        _id: "67726b3599d961b82df2c6b2",
        name: "Men's Clothing",
        attributes: [
          {
            name: "size",
            type: "String",
            required: true,
          },
          {
            name: "color",
            type: "String",
            required: true,
          },
          {
            name: "material",
            type: "String",
            required: true,
          },
          {
            name: "fit",
            type: "String",
            required: true,
          },
          {
            name: "season",
            type: "String",
            required: false,
          },
        ],
        parentId: "6772684ec72cff4922b047cb",
        createdAt: "2024-12-30T09:43:17.364Z",
        updatedAt: "2024-12-30T09:43:17.364Z",
        __v: 0,
      },
    ],
  },
];

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
import PropTypes from "prop-types"; // Import PropTypes for prop validation

const TreeList = ({ selectedCategory, setSelectedCategory }) => {
  const [open, setOpen] = useState({});

  const handleClick = (itemId) => {
    setOpen({ ...open, [itemId]: !open[itemId] });
  };

  const handleCategorySelect = (name) => {
    if (selectedCategory === name) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(name); // Select the new category
    }
  };

  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <ListItem sx={{ display: "flex", alignItems: "center", py: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ width: `${level * 16}px` }} />
            <FormControlLabel
              value={category._id}
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  onClick={() => handleCategorySelect(category.name)}
                  size="small"
                />
              }
              label={category.name}
              labelPlacement="end"
              checked={selectedCategory === category.name}
            />
          </Box>
          {category.children ? (
            open[category.itemId] ? (
              <ExpandLess
                sx={{ cursor: "pointer" }}
                onClick={() => handleClick(category.itemId)}
              />
            ) : (
              <ExpandMore
                sx={{ cursor: "pointer" }}
                onClick={() => handleClick(category.itemId)}
              />
            )
          ) : null}
        </ListItem>
        <Collapse in={open[category.itemId]} timeout="auto" unmountOnExit>
          {category.children && renderCategories(category.children, level + 1)}
        </Collapse>
      </React.Fragment>
    ));
  };

  return <List>{renderCategories(categories)}</List>;
};

TreeList.propTypes = {
  selectedCategory: PropTypes.string, // Expecting selectedCategory as a string
  setSelectedCategory: PropTypes.func.isRequired, // Expecting setSelectedCategory as a function
};

export default TreeList;
