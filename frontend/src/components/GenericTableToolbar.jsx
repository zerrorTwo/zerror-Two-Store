import PropTypes from "prop-types";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTheme } from "@mui/material/styles";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";
import { useDeleteAllMutation } from "../redux/api/userSlice.js";
import { toast } from "react-toastify";

const GenericTableToolbar = ({ numSelected, selected, setSelected }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteUsers, { isLoading }] = useDeleteAllMutation();

  // Handlers cho dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUsers(selected).unwrap();
      toast.success("Users deleted successfully");
      setSelected([]);
      setOpenDialog(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.data?.message || "Failed to delete users");
    }
  };

  return (
    <Toolbar
      sx={[
        {
          backgroundColor: theme.palette.button.backgroundColor,
          minHeight: "auto !important",
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) => theme.palette.button.backgroundColor,
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%", color: theme.palette.text.secondary }}
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", color: theme.palette.text.secondary }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          List User
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            {isLoading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              <IconButton onClick={handleOpenDialog}>
                <DeleteIcon sx={{ color: theme.palette.text.secondary }} />
              </IconButton>
            )}
          </Tooltip>
          <ConfirmDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onConfirm={handleConfirmDelete}
            itemCount={numSelected}
          />
        </>
      ) : (
        <IconButton sx={{ cursor: "default" }}>
          <FilterListIcon sx={{ color: theme.palette.text.secondary }} />
        </IconButton>
      )}
    </Toolbar>
  );
};

GenericTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default GenericTableToolbar;
