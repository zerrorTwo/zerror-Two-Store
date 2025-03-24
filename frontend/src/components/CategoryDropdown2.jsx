import { memo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import  Box  from "@mui/material/Box";
import  Typography  from "@mui/material/Typography";
import  KeyboardArrowDownIcon  from "@mui/icons-material/KeyboardArrowDown";
import  ClickAwayListener  from "@mui/material/ClickAwayListener";

const CategoryDropdown2 = memo(
  ({
    isOpen,
    selectedCategory,
    categories,
    theme,
    onToggle,
    onSelect,
    onClickAway,
  }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [hoveredLevel2Category, setHoveredLevel2Category] = useState(null);
    const hoverBgColor = "rgba(184, 179, 179, 0.08)";
    const selectedBgColor = "rgba(184, 179, 179, 0.08)";
    const defaultBgColor = theme?.palette?.background?.default || "#ffffff";

    const findCategoryBySlug = (categories, slug) => {
      for (let category of categories) {
        if (category.slug === slug) {
          return category;
        }

        if (category.children && category.children.length > 0) {
          const result = findCategoryBySlug(category.children, slug);
          if (result) return result;
        }
      }
      return null;
    };

    const selectedCategoryName =
      findCategoryBySlug(categories, selectedCategory)?.name || "All category";

    const handleCategoryHover = useCallback((categoryId) => {
      setHoveredCategory(categoryId);
    }, []);

    const handleLevel2CategoryHover = useCallback((categoryId) => {
      setHoveredLevel2Category(categoryId);
    }, []);

    const handleCategoryLeave = useCallback(() => {
      setHoveredCategory(null);
    }, []);

    const handleLevel2CategoryLeave = useCallback(() => {
      setHoveredLevel2Category(null);
    }, []);

    useEffect(() => {
      if (!isOpen) {
        setHoveredCategory(null);
        setHoveredLevel2Category(null);
      }
    }, [isOpen]);

    const renderCategoryLevels = (categories, level = 1) => {
      return categories.map((category) => (
        <Box
          key={category._id}
          data-category-id={category._id}
          sx={{
            position: "relative",
            px: 2,
            py: 1.5,
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: hoverBgColor,
            },
            ...(selectedCategory === category.slug && {
              backgroundColor: selectedBgColor,
            }),
          }}
          onClick={() => {
            onSelect(category.slug);
          }}
          onMouseEnter={() => {
            if (level === 1) {
              handleCategoryHover(category._id);
            } else if (level === 2) {
              handleLevel2CategoryHover(category._id);
            }
          }}
          onMouseLeave={() => {
            if (level === 1) {
              handleCategoryLeave();
            } else if (level === 2) {
              handleLevel2CategoryLeave();
            }
          }}
        >
          <Typography variant="body2">{category.name}</Typography>
        </Box>
      ));
    };

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
                borderColor: theme?.palette?.text?.primary || "#1976d2",
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
            <>
              {/* Main dropdown box */}
              <Box
                sx={{
                  maxHeight: "300px",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: defaultBgColor,
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  // maxHeight: "200px",
                  overflowY: "auto",
                  overflowX: "hidden",
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
                {renderCategoryLevels(categories, 1)}
              </Box>

              {/* Level 2 categories */}
              {hoveredCategory &&
                categories.map((category) => {
                  if (
                    hoveredCategory === category._id &&
                    category.children?.length > 0
                  ) {
                    const element = document.querySelector(
                      `[data-category-id="${category._id}"]`
                    );
                    const rect = element?.getBoundingClientRect();

                    return (
                      <Box
                        key={`level2-${category._id}`}
                        sx={{
                          position: "fixed",
                          left: `${rect?.right}px`,
                          top: `${rect?.top}px`,
                          width: "200px",
                          backgroundColor: defaultBgColor,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          zIndex: 1001,
                        }}
                        onMouseEnter={() => handleCategoryHover(category._id)}
                        // onMouseLeave={handleCategoryLeave}
                      >
                        {renderCategoryLevels(category.children, 2)}
                      </Box>
                    );
                  }
                  return null;
                })}

              {/* Level 3 categories */}
              {hoveredLevel2Category &&
                categories.flatMap((category) =>
                  category.children?.map((child) => {
                    if (
                      hoveredLevel2Category === child._id &&
                      child.children?.length > 0
                    ) {
                      const element = document.querySelector(
                        `[data-category-id="${child._id}"]`
                      );
                      const rect = element?.getBoundingClientRect();

                      return (
                        <Box
                          key={`level3-${child._id}`}
                          sx={{
                            position: "fixed",
                            left: `${rect?.right}px`,
                            top: `${rect?.top}px`,
                            width: "200px",
                            backgroundColor: defaultBgColor,
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            zIndex: 1001,
                          }}
                          onMouseEnter={() =>
                            handleLevel2CategoryHover(child._id)
                          }
                          onMouseLeave={handleLevel2CategoryLeave}
                        >
                          {renderCategoryLevels(child.children, 3)}
                        </Box>
                      );
                    }
                    return null;
                  })
                )}
            </>
          )}
        </Box>
      </ClickAwayListener>
    );
  }
);

CategoryDropdown2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  selectedCategory: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      children: PropTypes.array,
    })
  ).isRequired,
  theme: PropTypes.object,
  onToggle: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClickAway: PropTypes.func.isRequired,
};

CategoryDropdown2.displayName = "CategoryDropdown2";

export default CategoryDropdown2;
