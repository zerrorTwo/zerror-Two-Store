import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Popover,
  Typography,
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
  const [position, setPosition] = useState({
    top: window.innerHeight / 2 - 80,
    left: window.innerWidth / 2,
  });

  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    setDragging(true);
    setDragStart({
      x: event.clientX - position.left,
      y: event.clientY - position.top,
    });
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      setPosition({
        top: event.clientY - dragStart.y,
        left: event.clientX - dragStart.x,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  if (!item) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: dragging ? "move" : "default" }}
    >
      <Popover
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: position.top,
          left: position.left,
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        PaperProps={{
          sx: { overflow: "hidden" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: 40,
            bgcolor: theme.palette.button.backgroundColor,
            alignItems: "center",
            justifyContent: "center",
            cursor: "move",
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            Carefully for your action!!
          </Typography>
        </Box>
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
    </div>
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
