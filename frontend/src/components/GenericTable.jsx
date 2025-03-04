import { useState } from "react";
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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import { PRIMITIVE_URL } from "../redux/constants";

// Sorting functions remain the same
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

const getComparator = (order, orderBy) =>
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const GenericTable = ({
  name,
  create,
  rows,
  headCells,
  handleUpdateClick,
  handleCreateClick,
  handleMoreClick,
  selected,
  setSelected,
  onDeleteConfirm,
  isDeleteLoading,
  page,
  rowsPerPage,
  totalPages,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const height = 38;
  const theme = useTheme();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(headCells[0].id);
  const [openDialog, setOpenDialog] = useState(false);

  // Event handlers remain the same
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(rows.map((n) => n._id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    const newSelected =
      selectedIndex === -1
        ? [...selected, id]
        : selected.filter((item) => item !== id);
    setSelected(newSelected);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const emptyRows = page >= 0 ? rowsPerPage - rows.length : 0;

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
          numSelected={selected.length}
          handleCreateClick={handleCreateClick}
          handleOpenDialog={handleOpenDialog}
          isLoading={isDeleteLoading}
        />
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
              "& .MuiTableRow-root": {
                height: `${height}px`,
              },
              "& .MuiTableCell-root": {
                height: `${height}px`,
                padding: "0 16px",
                lineHeight: `${height}px`,
              },
            }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <GenericTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {[...rows]
                ?.sort(getComparator(order, orderBy))
                ?.map((row, index) => {
                  const isItemSelected = selected.includes(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      key={row._id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{
                            "&.Mui-checked .MuiSvgIcon-root": {
                              color: theme.palette.secondary.main,
                            },
                          }}
                          color="secondary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      {headCells.map((cell, cellIndex) => {
                        const cellValue = row[cell.id];
                        return (
                          <TableCell
                            key={cellIndex}
                            align="center"
                            sx={{
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {cellValue != null ? (
                              cell.img ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    maxWidth: "80px",
                                  }}
                                >
                                  <img
                                    loading="lazy"
                                    src={`${PRIMITIVE_URL}${cellValue}`}
                                    alt={cellValue}
                                    style={{
                                      width: "auto",
                                      height: `${height}px`,
                                      objectFit: "cover",
                                      maxWidth: "80px",
                                      minWidth: "80px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  />
                                </Box>
                              ) : cell.money ? (
                                `${new Intl.NumberFormat().format(cellValue)}đ`
                              ) : cell.boolean ? (
                                cellValue ? (
                                  <CheckCircleIcon
                                    fontSize="medium"
                                    sx={{
                                      fill: "green",
                                    }}
                                  />
                                ) : (
                                  <ClearIcon
                                    fontSize="medium"
                                    sx={{
                                      fill: "red",
                                    }}
                                  />
                                )
                              ) : (
                                <Box
                                  sx={{
                                    maxWidth: "200px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {String(cellValue)}
                                </Box>
                              )
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        <Tooltip title="Update">
                          <IconButton
                            onClick={(e) => handleUpdateClick(e, row)}
                            sx={{
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.button.hoverBackgroundColor,
                              },
                              color: "white",
                              backgroundColor:
                                theme.palette.button.backgroundColor,
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {handleMoreClick && (
                          <Tooltip title="More">
                            <IconButton
                              onClick={() => handleMoreClick(row)}
                              sx={{
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.button.hoverBackgroundColor,
                                },
                                color: "white",
                                backgroundColor:
                                  theme.palette.button.backgroundColor,
                              }}
                            >
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: `${(height + 1.1) * emptyRows}px`,
                  }}
                >
                  <TableCell colSpan={headCells.length + 2} />
                </TableRow>
              )}
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell colSpan={headCells.length + 2}>
                  <TablePagination
                    component="div"
                    count={totalPages * rowsPerPage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    sx={{
                      display: "flex",
                      width: "100%",
                      border: "none",
                      "& .MuiToolbar-root": {
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      },
                      "& .MuiTablePagination-selectLabel": {
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
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={() => {
          onDeleteConfirm();
          handleCloseDialog();
        }}
        itemCount={selected.length}
      />
    </Box>
  );
};

GenericTable.propTypes = {
  rows: PropTypes.array.isRequired,
  name: PropTypes.string,
  create: PropTypes.bool,
  headCells: PropTypes.array.isRequired,
  handleUpdateClick: PropTypes.func.isRequired,
  handleCreateClick: PropTypes.func,
  handleMoreClick: PropTypes.func,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
  isDeleteLoading: PropTypes.bool,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};

export default GenericTable;
