import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import { visuallyHidden } from "@mui/utils";
import { useGetAllCurrentUserQuery } from "../../redux/api/userSlice.js"; // Adjust the import path as needed

const headCells = [
  { id: "id", numeric: true, disablePadding: true, label: "ID" }, // Add ID column
  { id: "userName", numeric: false, disablePadding: true, label: "User Name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  {
    id: "number",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
  },
  { id: "isAdmin", numeric: false, disablePadding: false, label: "Admin" },
  { id: "actions", numeric: false, disablePadding: false, label: "Actions" }, // Add actions column
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function UserDashBoard(props) {
  const theme = useTheme();
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            sx={{
              "&.Mui-checked .MuiSvgIcon-root": {
                color: theme.palette.text.secondary,
              },
              color: `${theme.palette.text.secondary} !important`,
            }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all users" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ color: theme.palette.text.secondary }}
            key={headCell.id}
            align={"right"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "actions" ? (
              <TableSortLabel
                sx={{ color: `${theme.palette.text.secondary} !important` }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

UserDashBoard.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const theme = useTheme();
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          minHeight: "auto !important",
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
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
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon sx={{ color: theme.palette.text.secondary }} />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const rowsPerPage = 10;
  const theme = useTheme();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("userName");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);

  const { data: rows = [], error, isLoading } = useGetAllCurrentUserQuery();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleUpdateClick = (id) => {
    // Handle the update action here
    console.log(`Update user with id: ${id}`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper sx={{ width: "100%", backgroundColor: "transparent" }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <UserDashBoard
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    key={index}
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{
                          "&.Mui-checked .MuiSvgIcon-root": {
                            color: theme.palette.text.secondary,
                          },
                        }}
                        color="secondary"
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.text.secondary }}
                      align="right"
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row._id}
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.text.secondary }}
                      align="right"
                      component="th"
                      padding="none"
                    >
                      {row.userName}
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.text.secondary }}
                      align="right"
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.text.secondary }}
                      align="right"
                    >
                      {row.number || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.text.secondary }}
                      align="right"
                    >
                      {row.isAdmin ? "Yes" : "No"}
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.text.secondary }}
                      align="right"
                    >
                      <IconButton
                        sx={{ color: theme.palette.text.secondary }}
                        onClick={() => handleUpdateClick(row._id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            "& .MuiTablePagination-selectLabel ": {
              display: "none",
            },
            "& .MuiTablePagination-input": {
              display: "none",
            },
            "& .MuiTablePagination-displayedRows": {
              color: theme.palette.text.secondary,
            },
            "& .MuiButtonBase-root": {
              color: theme.palette.text.secondary,
            },
          }}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
