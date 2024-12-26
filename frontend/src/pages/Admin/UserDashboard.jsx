import { useGetAllCurrentUserQuery } from "../../redux/api/userSlice.js"; // Adjust the import path as needed
import GenericTable from "../../components/GenericTable.jsx"; // Adjust the import path as needed

const UserDashboard = () => {
  const { data: rows = [], error, isLoading } = useGetAllCurrentUserQuery();

  const handleUpdateClick = (id) => {
    console.log(`Update user with id: ${id}`);
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
    <GenericTable
      rows={rows}
      headCells={headCells}
      handleUpdateClick={handleUpdateClick}
    />
  );
};

export default UserDashboard;
