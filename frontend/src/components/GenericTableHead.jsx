import PropTypes from "prop-types";
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const GenericTableHead = ({
  headCells,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  order,
  orderBy,
  rowCount,
}) => {
  const theme = useTheme();

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* Start the cells immediately after TableRow opening tag */}
        <TableCell padding="checkbox">
          <Checkbox
            sx={{
              "&.Mui-checked .MuiSvgIcon-root": {
                color: theme.palette.secondary.main,
              },
            }}
            color="secondary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ color: theme.palette.text.secondary }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                "&.MuiTableSortLabel-root": {
                  color: theme.palette.text.secondary,
                },
                "&.MuiTableSortLabel-root:hover": {
                  color: theme.palette.text.primary,
                },
                "&.Mui-active": {
                  color: theme.palette.text.primary,
                },
                "& .MuiTableSortLabel-icon": {
                  color: `${theme.palette.text.secondary} !important`,
                },
              }}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="center" sx={{ color: theme.palette.text.secondary }}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

GenericTableHead.propTypes = {
  headCells: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default GenericTableHead;
