import { useEffect, useRef, useState } from "react";
import { Box, Divider, TextField, Typography, useTheme } from "@mui/material";
import ButtonPrimary from "../../components/ButtonPrimary.jsx";
import {
  useCreateNewCategoryMutation,
  useGetAllCategoryQuery,
  useSearchCategoryQuery,
  useUploadCategoryImageMutation, // Import the mutation for image upload
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
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useGetAllCategoryQuery();
  const [createNew, { isLoading: isLoadingCreateNew }] =
    useCreateNewCategoryMutation();
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchCategoryQuery(search, {
      skip: !isSearching,
    });
  const [uploadCategoryImage, { isLoading: isLoadingUpload }] =
    useUploadCategoryImageMutation(); // Image upload mutation

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = async () => {
    if (!addValue.trim()) {
      toast.warning("Please enter a category name");
      return;
    }

    try {
      let imageUrl = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadResult = await uploadCategoryImage(formData).unwrap();

        imageUrl = uploadResult.image;
      }

      const result = await createNew({
        name: addValue,
        img: imageUrl,
      }).unwrap();
      if (result) {
        setAddValue("");
        setSelectedImage(null);
        setImagePreview(null);
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
                addValue.length > 100
                  ? "Category must have less than 100 characters"
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
                isLoading={isLoadingCreateNew || isLoadingUpload}
              />
            </Box>
          </Box>
          <Box mt={2} display={"flex"}>
            <input type="file" onChange={handleImageChange} />
            {imagePreview && (
              <Box>
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: 150 }}
                />
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />
        <Box component="form" mb={2}>
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
            id="search-field"
            value={search}
            onChange={handleInputSearchChange}
            helperText={
              search.length > 100
                ? "Search term must have less than 100 characters"
                : ""
            }
            FormHelperTextProps={{
              sx: { color: "#FE0032", fontStyle: "italic" },
            }}
            label="Search category"
            type="search"
          />
        </Box>
        <CategoryList
          category={renderData || []}
          isLoading={isLoading || isLoadingSearch}
        />
      </Box>
    </Box>
  );
}

export default CategoryDashBoard;
