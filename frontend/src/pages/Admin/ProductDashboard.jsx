import {
  useDeleteAllProductMutation,
  useGetAllProductQuery,
} from "../../redux/api/productSlice.js"; // Adjust the import path as needed
import { useGetAllCategoryQuery } from "../../redux/api/categorySlice.js"; // Adjust the import path as needed
import GenericTable from "../../components/GenericTable"; // Adjust the import path as needed
import { useState, useCallback } from "react";
import FullScreenDialogCom from "../../components/FullScreenDialogCom"; // Adjust the import path as needed
import { toast } from "react-toastify";

const ProductDashboard = () => {
  // Fetch dữ liệu chỉ một lần khi component được mount
  const { data: rows = [], error, isLoading } = useGetAllProductQuery();
  const {
    data: listCate = [],
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoryQuery(); // Fetch categories
  const processedRows = rows.map((row) => ({
    ...row,
    type: row.type?.name || "Unknown", // Lấy name từ type
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [selected, setSelected] = useState([]); // Move selected state here
  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteAllProductMutation();

  const handleUpdateClick = useCallback((event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setIsCreate(false);
    setDialogOpen(true);
  }, []);

  const handleCreateClick = useCallback((event) => {
    event.stopPropagation();
    setSelectedRow(null);
    setIsCreate(true);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedRow(null);
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      console.log(selected);

      await deleteProduct(selected).unwrap();
      toast.success("Product deleted successfully");
      setSelected([]);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.data?.message || "Failed to delete product");
    }
  };

  const headCells = [
    // { id: "_id", numeric: true, disablePadding: false, label: "ID" },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    // {
    //   id: "description",
    //   numeric: false,
    //   disablePadding: false,
    //   label: "Description",
    // },
    { id: "price", numeric: true, disablePadding: false, label: "Price" },
    { id: "quantity", numeric: true, disablePadding: false, label: "Quantity" },
    { id: "type", numeric: false, disablePadding: false, label: "Type" },
  ];

  if (isLoading || categoryLoading) return <div>Loading...</div>;
  if (error || categoryError) return <div>Error loading data</div>;

  return (
    <>
      <GenericTable
        name="List Product"
        create={true}
        rows={processedRows}
        headCells={headCells}
        handleUpdateClick={handleUpdateClick}
        handleCreateClick={handleCreateClick}
        selected={selected}
        setSelected={setSelected}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleteLoading={isDeleteLoading}
      />
      <FullScreenDialogCom
        create={isCreate}
        open={dialogOpen}
        handleClose={handleCloseDialog}
        row={selectedRow}
        listCate={listCate} // Pass categories to FullScreenDialogCom
      />
    </>
  );
};

export default ProductDashboard;
