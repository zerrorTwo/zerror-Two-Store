import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GenericTableHead from "./GenericTableHead";
import GenericTableToolbar from "./GenericTableToolbar";
import ConfirmDialog from "./ConfirmDialog";
import { useTheme } from "@mui/material/styles";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const GenericTable = ({
  name = "List User",
  create,
  rows,
  headCells,
  handleUpdateClick,
  handleCreateClick,
  selected,
  setSelected,
  onDeleteConfirm,
  isDeleteLoading,
}) => {
  const rowsPerPage = 10;
  const theme = useTheme();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(headCells[0].id);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rows]
  );

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
        <GenericTableToolbar
          name={name}
          create={create}
          numSelected={selected?.length || 0}
          handleCreateClick={handleCreateClick}
          handleOpenDialog={handleOpenDialog}
          isLoading={isDeleteLoading}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"small"}
          >
            <GenericTableHead
              headCells={headCells}
              numSelected={selected?.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected?.includes(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    key={index}
                    hover
                    onClick={(event) => handleClick(event, row._id)}
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
                    {headCells.map((cell, index) => (
                      <TableCell
                        key={index}
                        sx={{ color: theme.palette.text.secondary }}
                        align="center"
                      >
                        {row[cell.id] != null ? String(row[cell.id]) : "N/A"}
                      </TableCell>
                    ))}
                    <TableCell
                      align="center"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      <Tooltip title="Update">
                        <IconButton
                          sx={{
                            "&:hover": {
                              backgroundColor:
                                theme.palette.button.hoverBackgroundColor,
                            },
                            cursor: "pointer",
                            color: theme.palette.text.secondary,
                            backgroundColor:
                              theme.palette.button.backgroundColor,
                          }}
                          onClick={(event) => handleUpdateClick(event, row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length + 2} />
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
              color: `${theme.palette.text.secondary} !important`,
            },
          }}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
      <ConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={() => {
          onDeleteConfirm();
          handleCloseDialog();
        }}
        itemCount={selected?.length}
      />
    </Box>
  );
};

GenericTable.propTypes = {
  rows: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  create: PropTypes.bool.isRequired,
  headCells: PropTypes.array.isRequired,
  handleUpdateClick: PropTypes.func.isRequired,
  handleCreateClick: PropTypes.func,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
  isDeleteLoading: PropTypes.bool,
};

export default GenericTable;
