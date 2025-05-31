import { Box, Breadcrumbs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Specification({ handleClick, breadcrumb }) {
  return (
    <Box px={2} py={2} boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}>
      <Box>
        <Typography variant="h6" fontWeight={400}>
          Product Specifications
        </Typography>
        <Box display={"flex"} gap={2} mt={2} flexDirection={"column"}>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Typography width={"8.75rem"} variant="body1" color="text.primary">
              Category
            </Typography>
            <div role="presentation" onClick={handleClick}>
              <Breadcrumbs aria-label="breadcrumb">
                {breadcrumb && breadcrumb.length > 0 ? (
                  breadcrumb.map((item, index) => {
                    const isLast = index === breadcrumb.length - 1;
                    return isLast ? (
                      <Typography
                        key={item.slug}
                        sx={{ color: "text.blackColor" }}
                      >
                        {item.name}
                      </Typography>
                    ) : (
                      <Link
                        style={{
                          textDecoration: "underline",
                          color: "#0055aa",
                          cursor: "pointer",
                        }}
                        to={`/search?page=1&limit=30&category=${item.slug}`}
                        key={item.slug}
                        onClick={handleClick}
                      >
                        {item.name}
                      </Link>
                    );
                  })
                ) : (
                  <Typography sx={{ color: "text.blackColor" }}>
                    No category
                  </Typography>
                )}
              </Breadcrumbs>
            </div>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Typography width={"8.75rem"} variant="body1" color="text.primary">
              Material
            </Typography>
            <Typography variant="body2">Cotton, polyester, silk</Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Typography width={"8.75rem"} variant="body1" color="text.primary">
              Size
            </Typography>
            <Typography variant="body2">S, M, L, XL, XXL</Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Typography width={"8.75rem"} variant="body1" color="text.primary">
              Color
            </Typography>
            <Typography variant="body2">
              Black, white, blue, green, red, yellow, orange, purple, pink,
              brown
            </Typography>
          </Box>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Typography width={"8.75rem"} variant="body1" color="text.primary">
              Fit
            </Typography>
            <Typography variant="body2">Regular fit</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

Specification.propTypes = {
  handleClick: PropTypes.func,
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
};

export default Specification;
