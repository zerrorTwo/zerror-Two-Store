import {
  useGetAllCurrentUserQuery,
  useDeleteAllMutation,
} from "../../redux/api/userSlice.js";
import GenericTable from "../../components/GenericTable.jsx";
import { useState } from "react";
import PopoverCom from "../../components/PopoverCom.jsx";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selected, setSelected] = useState([]); // Move selected state here
  const { data: rows = [], error, isLoading } = useGetAllCurrentUserQuery();
  const [deleteUsers, { isLoading: isDeleteLoading }] = useDeleteAllMutation();

  const handleUpdateClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  // Add delete handler
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

  const headCells = [
    { id: "_id", numeric: true, disablePadding: false, label: "ID" },
    {
      id: "userName",
      numeric: false,
      disablePadding: false,
      label: "User Name",
    },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    {
      id: "number",
      numeric: false,
      disablePadding: false,
      label: "Phone Number",
    },
    { id: "isAdmin", numeric: false, disablePadding: false, label: "Admin" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <>
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
