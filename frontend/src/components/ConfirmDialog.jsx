import PropTypes from "prop-types";
import  Dialog  from "@mui/material/Dialog";
import  DialogTitle  from "@mui/material/DialogTitle";
import  DialogContent  from "@mui/material/DialogContent";
import  DialogActions  from "@mui/material/DialogActions";
import  Button  from "@mui/material/Button";
import  Typography  from "@mui/material/Typography";
import  CircularProgress  from "@mui/material/CircularProgress";
import  {useTheme}  from "@mui/material/styles";

const ConfirmDialog = ({ open, onClose, onConfirm, itemCount, isLoading }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // PaperProps={{
      //   sx: {
      //     backgroundColor: theme.palette.background.default,
      //   },
      // }}
    >
      <DialogTitle sx={{ color: theme.palette.text.blackColor }}>
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: theme.palette.text.blackColor }}>
          Are you sure you want to delete {itemCount} selected{" "}
          {itemCount === 1 ? "item" : "items"}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: theme.palette.text.blackColor }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            backgroundColor: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
          }}
        >
          {isLoading ? <CircularProgress size={25} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
};

export default ConfirmDialog;
