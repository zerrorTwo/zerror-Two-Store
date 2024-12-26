import PropTypes from "prop-types";
import { Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTheme } from "@mui/material/styles";

const GenericTableToolbar = ({ numSelected }) => {
  const theme = useTheme();

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
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon sx={{ color: theme.palette.text.secondary }} />
          </IconButton>
        </Tooltip>
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
};

export default GenericTableToolbar;
