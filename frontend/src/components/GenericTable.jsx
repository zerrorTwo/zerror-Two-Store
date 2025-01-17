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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTheme } from "@mui/material/styles";
import { PRIMITIVE_URL } from "../redux/constants";

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
  handleMoreClick,
  selected,
  setSelected,
  onDeleteConfirm,
  isDeleteLoading,
}) => {
  const rowsPerPage = 10;
  const height = 38;
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
    page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
            sx={{
              minWidth: 750,
              "& .MuiTableRow-root": {
                height: `${height}px `,
              },
              "& .MuiTableCell-root": {
                height: `${height}px `,
                padding: "0 16px",
                lineHeight: `${height}px `,
              },
            }}
            aria-labelledby="tableTitle"
            size="small"
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
                            color: theme.palette.text.secondary,
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
                                }}
                              >
                                <img
                                  src={`${PRIMITIVE_URL}${cellValue}`}
                                  alt={cellValue}
                                  style={{
                                    width: "auto",
                                    height: `${height}px`,
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            ) : (
                              String(cellValue)
                            )
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell
                      align="center"
                      sx={{
                        color: theme.palette.text.secondary,
                        "& .MuiButtonBase-root": {
                          padding: "6px",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                          height: "100%",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title="Update">
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              handleUpdateClick(event, row);
                            }}
                            sx={{
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.button.hoverBackgroundColor,
                              },
                              color: theme.palette.text.secondary,
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
                              onClick={(event) => {
                                event.stopPropagation();
                                handleMoreClick(row); // Truyền đúng row vào hàm
                              }}
                              sx={{
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.button.hoverBackgroundColor,
                                },
                                color: theme.palette.text.secondary,
                                backgroundColor:
                                  theme.palette.button.backgroundColor,
                              }}
                            >
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: `${height * emptyRows}px `,
                  }}
                >
                  <TableCell colSpan={headCells.length + 2} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
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
              color: "white",
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
  handleMoreClick: PropTypes.func,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
  isDeleteLoading: PropTypes.bool,
};

export default GenericTable;
