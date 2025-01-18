import {
  useDeleteAllProductMutation,
  useGetPageProductQuery,
} from "../../redux/api/productSlice.js";
import { useGetAllCategoryQuery } from "../../redux/api/categorySlice.js";
import GenericTable from "../../components/GenericTable";
import { useState, useCallback, useEffect } from "react";
import FullScreenDialogCom from "../../components/ProductTab/FullScreenDialogCom.jsx";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Divider,
  Input,
  Typography,
  useTheme,
} from "@mui/material";
import CategoryDropdown from "../../components/CategoryDropdown.jsx";

const ProductDashboard = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteAllProductMutation();

  const processedRows = rows.map((row) => ({
    ...row,
    type: row.type?.name || "Unknown",
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClickAway = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback((event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  }, []);

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
      await deleteProduct(selected).unwrap();
      toast.success("Product deleted successfully");
      setSelected([]);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.data?.message || "Failed to delete product");
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      <Box display="flex" justifyContent="start">
        <Box display="grid">
          <Typography variant="h5">Manager Product</Typography>
          <Divider
            sx={{
              width: "100%",
              bgcolor: theme.palette.button.backgroundColor,
            }}
          />
        </Box>
      </Box>

      <Box my={2} display={"flex"} justifyContent={"space-between"}>
        <CategoryDropdown
          isOpen={isDropdownOpen}
          selectedCategory={selectedCategory}
          categories={listCate}
          theme={theme}
          onToggle={toggleDropdown}
          onSelect={handleCategorySelect}
          onClickAway={handleClickAway}
        />

        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{
              "&::before": {
                borderBottom: "1px solid white",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "2px solid white",
              },
              "&::after": {
                borderBottom: "2px solid white",
              },
              "&.Mui-focused::after": {
                borderBottom: "2px solid white",
              },
            }}
            placeholder="Search name product"
          />
          <Button variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </Box>

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
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(1);
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
