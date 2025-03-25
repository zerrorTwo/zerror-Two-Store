import {
  useGetAllCurrentUserQuery,
  useDeleteAllMutation,
} from "../../redux/api/userSlice.js";
import GenericTable from "../../components/GenericTable.jsx";
import { useState, useCallback } from "react";
import PopoverCom from "../../components/PopoverCom.jsx";
import { toast } from "react-toastify";
import  Box  from "@mui/material/Box";
import  Divider  from "@mui/material/Divider";
import  Typography  from "@mui/material/Typography";
const headCells = [
  // { id: "_id", numeric: true, disablePadding: false, label: "ID" },
  {
    id: "userName",
    numeric: false,
    disablePadding: false,
    label: "User Name",
  },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  {
    id: "phoneNumber",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
  },
  { id: "isAdmin", numeric: false, disablePadding: false, label: "Admin" },
];
const UserDashboard = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selected, setSelected] = useState([]);

  const {
    data: { users: rows = [], totalPages } = {},
    error,
    isLoading,
  } = useGetAllCurrentUserQuery({ page, limit: rowsPerPage });

  const [deleteUsers, { isLoading: isDeleteLoading }] = useDeleteAllMutation();

  const handleUpdateClick = useCallback((event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  }, []);

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null);
    setSelectedRow(null);
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deleteUsers(selected).unwrap();
      toast.success("Users deleted successfully");
      setSelected([]);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.data?.message || "Failed to delete users");
    }
  };



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <>
      <Box display={"flex"} justifyContent={"start"} mb={4}>
        <Box display={"grid"}>
          <Typography variant="h5">Manager Category</Typography>
          <Divider
            sx={{
              width: "100%",
              bgcolor: "red",
            }}
          />
        </Box>
      </Box>
      <GenericTable
        name="List User"
        create={false}
        rows={rows}
        headCells={headCells}
        handleUpdateClick={handleUpdateClick}
        selected={selected}
        setSelected={setSelected}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleteLoading={isDeleteLoading}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalPages={Math.ceil(totalPages / rowsPerPage)}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(1);
        }}
      />
      <PopoverCom
        anchorEl={anchorEl}
        handleClose={handleClosePopover}
        row={selectedRow}
      />
    </>
  );
};

export default UserDashboard;
