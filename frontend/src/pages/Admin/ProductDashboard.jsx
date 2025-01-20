import {
  useDeleteAllProductMutation,
  useGetPageProductQuery,
} from "../../redux/api/productSlice.js";
import { useGetAllCategoryTreeQuery } from "../../redux/api/categorySlice.js";
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
import CategoryDropdown2 from "../../components/CategoryDropdown2.jsx";

const ProductDashboard = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [selected, setSelected] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const headCells = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    {
      id: "img",
      numeric: false,
      img: true,
      disablePadding: false,
      label: "Img",
    },
    {
      id: "price",
      money: true,
      numeric: true,
      disablePadding: false,
      label: "Price",
    },
    { id: "quantity", numeric: true, disablePadding: false, label: "Quantity" },
    { id: "type", numeric: false, disablePadding: false, label: "Type" },
  ];

  const {
    data: { products: rows = [], totalPages } = {},
    error,
    isLoading,
  } = useGetPageProductQuery({
    page,
    limit: rowsPerPage,
    category: selectedCategory,
    search: search,
  });

  const {
    data: listCate = [],
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoryTreeQuery();

  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteAllProductMutation();

  const processedRows = rows.map((row) => ({
    ...row,
    type: row.type?.name || "Unknown",
  }));

  const handleClickAway = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback((event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleCategorySelect = useCallback((category) => {
    setInputCategory(category); // Only update input state
    // setSelectedCategory(category);
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

  const handleSearch = () => {
    setSearch(inputSearch);
    setSelectedCategory(inputCategory);
    setPage(1); // Reset page to 1 when performing a new search
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
        <CategoryDropdown2
          isOpen={isDropdownOpen}
          selectedCategory={inputCategory}
          categories={listCate}
          theme={theme}
          onToggle={toggleDropdown}
          onSelect={handleCategorySelect}
          onClickAway={handleClickAway}
        />

        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Input
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
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
          <Button variant="contained" color="primary" onClick={handleSearch}>
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
