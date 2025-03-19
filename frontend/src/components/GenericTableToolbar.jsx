// GenericTableToolbar.jsx
import PropTypes from "prop-types";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const GenericTableToolbar = ({
  name = "List User",
  create = false, // Provide a default value for create
  numSelected,
  handleCreateClick,
  handleOpenDialog,
  isLoading,
}) => {
  return (
    <Toolbar
      sx={[
        {
          // backgroundColor: theme.palette.button.backgroundColor,
          minHeight: "auto !important",
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 &&
          {
            // bgcolor: (theme) => theme.palette.button.backgroundColor,
          },
      ]}
    >
      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            {isLoading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              <IconButton onClick={handleOpenDialog}>
                <DeleteIcon sx={{ color: "error.main" }} />
              </IconButton>
            )}
          </Tooltip>
        </>
      ) : (
        <IconButton sx={{ cursor: "default" }}>
          <FilterListIcon />
        </IconButton>
      )}
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%", color: "error.main" }}
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", color: "" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {name}
        </Typography>
      )}
      {create && (
        <Button
          sx={{ fontSize: 10, display: "-webkit-box", pr: 4 }}
          component="label"
          variant="outlined"
          startIcon={<AddCircleIcon />}
          onClick={handleCreateClick}
        >
          Create new
        </Button>
      )}
    </Toolbar>
  );
};

GenericTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  create: PropTypes.bool,
  handleCreateClick: PropTypes.func,
  handleOpenDialog: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default GenericTableToolbar;
