import {
  useDeleteAllProductMutation,
  useGetPageProductQuery,
} from "../../redux/api/productSlice.js";
import { useGetAllCategoryTreeQuery } from "../../redux/api/categorySlice.js";
import GenericTable from "../../components/GenericTable";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Input,
  Typography,
  useTheme,
} from "@mui/material";
import CategoryDropdown2 from "../../components/CategoryDropdown2.jsx";
import { useNavigate } from "react-router-dom";
const headCells = [
  { id: "name", disablePadding: false, label: "Name" },
  {
    id: "mainImg",
    img: true,
    disablePadding: false,
    label: "Img",
  },
  {
    id: "price",
    money: true,
    disablePadding: false,
    label: "Price",
  },
  { id: "stock", numeric: true, disablePadding: false, label: "Stock" },
  {
    id: "type",
    disablePadding: false,
    label: "Type",
  },
  {
    id: "status",
    boolean: true,
    disablePadding: false,
    label: "Status",
  },
];

const ProductDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    type: row.type || "Unknown",
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

  const handleUpdateClick = (event, row) => {
    event.stopPropagation();
    navigate(`/admin/update-product/${row._id}`);
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
    setSelectedCategory(inputCategory);
    setPage(0); // Reset page to 0 when performing a new search
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

  if (isLoading || categoryLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  if (error || categoryError) return <div>Error loading data</div>;

  return (
    <>
      <Box display="flex" justifyContent="start">
        <Box display="grid">
          <Typography variant="h5">Manager Product</Typography>
          <Divider
            sx={{
              width: "100%",
              bgcolor: "primary.main",
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
        rows={processedRows}
        headCells={headCells}
        handleUpdateClick={handleUpdateClick}
        selected={selected}
        setSelected={setSelected}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleteLoading={isDeleteLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default ProductDashboard;
