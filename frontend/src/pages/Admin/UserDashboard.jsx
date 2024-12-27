import { useGetAllCurrentUserQuery } from "../../redux/api/userSlice.js"; // Adjust the import path as needed
import GenericTable from "../../components/GenericTable.jsx"; // Adjust the import path as needed
import { useState } from "react";
import PopoverCom from "../../components/PopoverCom.jsx"; // Adjust the import path

const UserDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const { data: rows = [], error, isLoading } = useGetAllCurrentUserQuery();

  const handleUpdateClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
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
        rows={rows}
        headCells={headCells}
        handleUpdateClick={handleUpdateClick}
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
