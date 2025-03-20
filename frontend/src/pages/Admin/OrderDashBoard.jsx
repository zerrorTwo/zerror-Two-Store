import { useDeleteAllProductMutation } from "../../redux/api/productSlice.js";
import GenericTable from "../../components/GenericTable";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Input,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useGetAllOrdersQuery } from "../..//redux/api/checkoutSlice.js";

const OrderDashBoard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  const headCells = [
    { id: "_id", label: "Order ID", disablePadding: false },
    { id: "userName", label: "User Name", disablePadding: false },
    { id: "state", label: "State", disablePadding: false, state: true },
    { id: "finalTotal", label: "Final Price", money: true },
    { id: "createdAt", label: "Order Time" },
  ];

  const {
    data: { orders: rows = [], totalPages } = {},
    error,
    isLoading,
  } = useGetAllOrdersQuery({
    page,
    limit: rowsPerPage,
    search: search,
  });

  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteAllProductMutation();

  const handleMoreClick = (row) => {
    navigate(`detail/${row._id}`);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(selected).unwrap();
      toast.success("Product deleted successfully");
      setSelected([]);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.data?.message || "Failed to delete product");
    }
  };

  const handleSearch = () => {
    setSearch(inputSearch || "");
    setPage(0);
  };

  if (isLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  if (error) return <div>Error loading data</div>;

  return (
    <>
      <Box display="flex" justifyContent="start">
        <Box display="grid">
          <Typography variant="h5">Manager Order</Typography>
          <Divider
            sx={{
              width: "100%",
              bgcolor: "primary.main",
            }}
          />
        </Box>
      </Box>

      <Box display={"flex"} justifyContent={"end"}>
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Input
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            sx={{
              "&::before": {
                borderBottom: "1px solid black",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "2px solid black",
              },
              "&::after": {
                borderBottom: "2px solid black",
              },
              "&.Mui-focused::after": {
                borderBottom: "2px solid black",
              },
            }}
            placeholder="Search name product"
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Box>
      </Box>

      <GenericTable
        name="List Product"
        rows={rows}
        headCells={headCells}
        update={false}
        selected={selected}
        handleMoreClick={handleMoreClick}
        setSelected={setSelected}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleteLoading={isDeleteLoading}
        page={Math.max(0, page - 1)}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default OrderDashBoard;
