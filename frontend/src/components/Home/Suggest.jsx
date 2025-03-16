import {
  Box,
  Button,
  Divider,
  Grid2,
  Typography,
  useTheme,
} from "@mui/material";
import ProductMini from "../ProductMini";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Suggest({ listProducts }) {
  const theme = useTheme();

  return (
    <Box  pb={5}>
      {/* Header */}
      <Box
        sx={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          pt: 1.5,
          textAlign: "center",
          //   top: "72px",
          //   position: "sticky",
          // bgcolor: theme.palette.primary.main,
          zIndex: 10000,
        }}
      >
        <Typography
          variant="h6"
          textTransform={"uppercase"}
          sx={{ color: theme.palette.secondary.main, pb: 1 }}
        >
          Daily discover
        </Typography>
        <Divider
          sx={{
            height: "4px",
            bgcolor: theme.palette.secondary.main,
          }}
        />
      </Box>

      {/* Content */}
      <Box mt={2}>
        <Grid2 container spacing={1.5}>
          {listProducts?.map((item, index) => (
            <Grid2 key={index} size={{ xs: 4, sm: 3, lg: 2 }}>
              <ProductMini item={item} />
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Footer */}
      <Box justifyContent={"center"} display={"flex"} mt={4}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "block",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 10 }}
          >
            See more
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

Suggest.propTypes = {
  listProducts: PropTypes.array.isRequired,
};

export default Suggest;
