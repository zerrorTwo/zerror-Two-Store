import {
  useDeleteAllProductMutation,
  useGetPageProductQuery,
} from "../../redux/api/productSlice.js"; // Sử dụng getPageProduct
import { useGetAllCategoryQuery } from "../../redux/api/categorySlice.js";
import GenericTable from "../../components/GenericTable";
import { useState, useCallback } from "react";
import FullScreenDialogCom from "../../components/FullScreenDialogCom";
import { toast } from "react-toastify";

const ProductDashboard = () => {
  const [page, setPage] = useState(1); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(10); // Số sản phẩm mỗi trang

  // Fetch dữ liệu sản phẩm với phân trang
  const {
    data: { products: rows = [], totalPages } = {},
    error,
    isLoading,
  } = useGetPageProductQuery({ page, limit: rowsPerPage });

  const {
    data: listCate = [],
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoryQuery();

  const processedRows = rows.map((row) => ({
    ...row,
    type: row.type?.name || "Unknown",
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [selected, setSelected] = useState([]);
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
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
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
        page={page - 1} // Chuyển đổi từ 1-based sang 0-based
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        onPageChange={(_, newPage) => setPage(newPage + 1)} // Chuyển đổi từ 0-based sang 1-based
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(1); // Reset về trang đầu khi thay đổi số dòng
        }}
      />

      <FullScreenDialogCom
        create={isCreate}
        open={dialogOpen}
        handleClose={handleCloseDialog}
        row={selectedRow}
        listCate={listCate}
      />
    </>
  );
};

export default ProductDashboard;
