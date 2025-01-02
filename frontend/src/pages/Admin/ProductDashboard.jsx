import { useGetAllProductQuery } from "../../redux/api/productSlice.js"; // Adjust the import path as needed
import GenericTable from "../../components/GenericTable"; // Adjust the import path as needed
import { useState, useCallback } from "react";
import FullScreenDialogCom from "../../components/FullScreenDialogCom"; // Adjust the import path

const ProductDashboard = () => {
  // Fetch dữ liệu chỉ một lần khi component được mount
  const { data: rows = [], error, isLoading } = useGetAllProductQuery();
  const processedRows = rows.map((row) => ({
    ...row,
    type: row.type?.name || "Unknown", // Lấy name từ type
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleUpdateClick = useCallback((event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedRow(null);
  }, []);

  const headCells = [
    { id: "_id", numeric: true, disablePadding: false, label: "ID" },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    {
      id: "description",
      numeric: false,
      disablePadding: false,
      label: "Description",
    },
    { id: "price", numeric: true, disablePadding: false, label: "Price" },
    { id: "quantity", numeric: true, disablePadding: false, label: "Quantity" },
    { id: "type", numeric: false, disablePadding: false, label: "Type" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <>
      <GenericTable
        rows={processedRows}
        headCells={headCells}
        handleUpdateClick={handleUpdateClick}
      />
      <FullScreenDialogCom
        open={dialogOpen}
        handleClose={handleCloseDialog}
        row={selectedRow}
      />
    </>
  );
};

export default ProductDashboard;
