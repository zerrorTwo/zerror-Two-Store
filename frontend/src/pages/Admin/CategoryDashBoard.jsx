import { useEffect, useRef, useState } from "react";
import { Box, Divider, TextField, Typography, useTheme } from "@mui/material";
import ButtonPrimary from "../../components/ButtonPrimary.jsx";
import {
  useCreateNewMutation,
  useGetAllCategoryQuery,
  useSearchCategoryQuery,
} from "../../redux/api/categorySlice.js";
import CategoryList from "../../components/CategoryList.jsx";
import { toast } from "react-toastify";
import { debounce } from "lodash"; // Thêm import debounce

function CategoryDashBoard() {
  const theme = useTheme();
  const [addValue, setAddValue] = useState("");
  const [search, setSearch] = useState("");
  const hasShown = useRef(false);
  const inputRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [renderData, setRenderData] = useState([]);

  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useGetAllCategoryQuery();
  const [createNew, { isLoading: isLoadingCreateNew }] = useCreateNewMutation();
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchCategoryQuery(search, {
      skip: !isSearching,
    });

  useEffect(() => {
    if (error && !hasShown.current) {
      toast.error(error.error || error?.message || error?.stack);
      hasShown.current = true;
    }
  }, [error]);

  useEffect(() => {
    if (isSearching && searchResults) {
      setRenderData(searchResults);
    } else if (!isSearching && category) {
      setRenderData(category);
    }
  }, [category, searchResults, isSearching]);

  const handleInputChange = (event) => {
    setAddValue(event.target.value);
  };

  // Tạo debounced search function
  const debouncedSearch = useRef(
    debounce((searchTerm) => {
      if (searchTerm.trim()) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }, 500) // 500ms delay
  ).current;

  const handleInputSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    debouncedSearch(searchTerm);
  };

  const handleClick = async () => {
    if (!addValue.trim()) {
      toast.warning("Please enter a category name");
      return;
    }

    try {
      const result = await createNew({ name: addValue }).unwrap();
      if (result) {
        setAddValue("");
        inputRef.current.focus();
        setIsSearching(false);
        refetch();
        toast.success("Category created successfully!");
      }
    } catch (error) {
      toast.error(error.error || error?.message || error?.stack);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.target.id === "add-field") {
      handleClick();
      event.preventDefault();
    }
  };

  // Cleanup debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Box sx={{ flexGrow: 1, m: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ color: theme.palette.text.secondary }}>
          Category Dashboard
        </Typography>
      </Box>
      <Box
        sx={{ width: "80%", p: 3, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
          }}
        >
          <Box component="form">
            <TextField
              sx={{
                borderRadius: 1,
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.text.primary,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                },
              }}
              fullWidth
              id="add-field"
              inputRef={inputRef}
              value={addValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              helperText={
                addValue.length > 32
                  ? "Category must have less than 32 characters"
                  : ""
              }
              FormHelperTextProps={{
                sx: { color: "#FE0032", fontStyle: "italic" },
              }}
              label="Write category name"
              type="search"
            />
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <ButtonPrimary
                text="Add"
                onClick={handleClick}
                isLoading={!!isLoadingCreateNew}
              />
            </Box>
          </Box>
          <Box component="form">
            <TextField
              sx={{
                borderRadius: 1,
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.text.primary,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                },
              }}
              fullWidth
              id="search-field"
              value={search}
              onChange={handleInputSearchChange}
              helperText={
                search.length > 32
                  ? "Search term must have less than 32 characters"
                  : ""
              }
              FormHelperTextProps={{
                sx: { color: "#FE0032", fontStyle: "italic" },
              }}
              label="Search category"
              type="search"
            />
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: theme.palette.text.primary, my: 4 }} />
        <CategoryList
          category={renderData || []}
          isLoading={isLoading || isLoadingSearch}
        />
      </Box>
    </Box>
  );
}

export default CategoryDashBoard;
