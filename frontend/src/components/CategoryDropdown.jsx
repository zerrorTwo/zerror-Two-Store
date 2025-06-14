import { memo } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material/Box";
import { Typography } from "@mui/material/Typography";
import { ClickAwayListener } from "@mui/material/ClickAwayListener";
import { KeyboardArrowDownIcon } from "@mui/icons-material/KeyboardArrowDown";

const CategoryDropdown = memo(
  ({
    isOpen,
    selectedCategory,
    categories,
    theme,
    onToggle,
    onSelect,
    onClickAway,
  }) => {
    const hoverBgColor = "rgba(184, 179, 179, 0.08)";
    const selectedBgColor = "rgba(184, 179, 179, 0.08)";
    const defaultBgColor = theme?.palette?.background?.default || "#ffffff";

    const selectedCategoryName =
      categories.find((cate) => cate.slug === selectedCategory)?.name ||
      "All category";

    return (
      <ClickAwayListener onClickAway={onClickAway}>
        <Box sx={{ width: "250px", position: "relative" }}>
          <Box
            onClick={onToggle}
            sx={{
              borderRadius: "10px",
              backgroundColor: defaultBgColor,
              border: "1px solid #555",
              color: theme?.palette?.text?.primary || "#000",
              cursor: "pointer",
              "&:hover": {
                borderColor: theme?.palette?.primary?.main || "#1976d2",
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px={2}
              py={1}
            >
              <Typography variant="body1">{selectedCategoryName}</Typography>
              <KeyboardArrowDownIcon
                sx={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </Box>
          </Box>

          {isOpen && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                backgroundColor: defaultBgColor,
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto",
                mt: 0.5,
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: hoverBgColor,
                  },
                  ...(selectedCategory === "" && {
                    backgroundColor: selectedBgColor,
                  }),
                }}
                onClick={() => onSelect("")}
              >
                <Typography variant="body2">{"All category"}</Typography>
              </Box>
              {categories.map((cate) => (
                <Box
                  key={cate._id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: hoverBgColor,
                    },
                    ...(selectedCategory === cate.slug && {
                      backgroundColor: selectedBgColor,
                    }),
                  }}
                  onClick={() => onSelect(cate.slug)}
                >
                  <Typography variant="body2">{cate.name}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    );
  }
);

CategoryDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  selectedCategory: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  theme: PropTypes.object,
  onToggle: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClickAway: PropTypes.func.isRequired,
};
CategoryDropdown.displayName = "CategoryDropdown";

export default CategoryDropdown;
