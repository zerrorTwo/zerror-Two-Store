import {
  Box,
  Button,
  CircularProgress,
  Popover,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";

function PopoverPaper({
  isLoadingUpdate,
  isLoadingDelete,
  isLoading,
  item,
  open,
  updateBtn,
  deleteBtn,
  handleClose,
  handleUpdate,
  handleDelete,
  handleCreate,
  children,
}) {
  const theme = useTheme();
  if (!item) return null;

  return (
    <Popover
      open={open}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      }}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      {children}

      <Box sx={{ m: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={handleClose}>Cancel</Button>
        {handleCreate && (
          <Button
            onClick={handleCreate}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.button.backgroundColor,
            }}
          >
            {isLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Create"
            )}
          </Button>
        )}
        {updateBtn && (
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.button.backgroundColor,
            }}
          >
            {isLoadingUpdate ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        )}
        {deleteBtn && (
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ backgroundColor: theme.palette.button.error }}
          >
            {isLoadingDelete ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        )}
      </Box>
    </Popover>
  );
}

PopoverPaper.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  isLoadingUpdate: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoadingDelete: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  updateBtn: PropTypes.bool,
  deleteBtn: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func,
  handleDelete: PropTypes.func,
  handleCreate: PropTypes.func,
  children: PropTypes.node,
};

export default PopoverPaper;
