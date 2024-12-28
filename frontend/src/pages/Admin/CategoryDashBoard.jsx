import { useEffect, useRef, useState } from "react";
import { Box, Divider, TextField, Typography, useTheme } from "@mui/material";
import ButtonPrimary from "../../components/ButtonPrimary.jsx";
import {
  useCreateNewMutation,
  useGetAllCategoryQuery,
} from "../../redux/api/categorySlice.js";
import CategoryList from "../../components/CategoryList.jsx";
import { toast } from "react-toastify";

function CategoryDashBoard() {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const hasShown = useRef(false);
  const inputRef = useRef(null);

  const { data: category, isLoading, error } = useGetAllCategoryQuery();
  const [createNew, { isLoading: isLoadingCreateNew }] = useCreateNewMutation();

  useEffect(() => {
    if (error && !hasShown.current) {
      toast.error(error.error || error?.message || error?.stack);
      hasShown.current = true;
    }
  }, [category, error]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await createNew({ name: searchValue });
      if (newCategory.error) {
        toast.error(
          newCategory.error.error ||
            newCategory.error?.data?.message ||
            newCategory.error?.message ||
            newCategory.error?.stack
        );
      } else {
        setSearchValue("");
        inputRef.current.focus();
      }
    } catch (error) {
      toast.error(error.error || error?.message || error?.stack);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick(event);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, m: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ color: theme.palette.text.secondary }}>
          Category Dashboard
        </Typography>
      </Box>
      <Box sx={{ width: "80%", p: 3 }}>
        <Box component="form">
          <TextField
            sx={{
              borderRadius: 1,
              "& .MuiInputLabel-root": {
                color: theme.palette.text.primary, // Default text color
                "&.Mui-focused": {
                  color: theme.palette.text.primary, // Text color when focused
                },
              },
              "& .MuiInputBase-input": {
                color: theme.palette.text.primary, // Text color
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.text.primary, // Default border color
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.text.primary, // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.text.primary, // Border color when focused
                },
              },
            }}
            inputRef={inputRef}
            autoFocus
            fullWidth
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            helperText={
              searchValue.length > 32
                ? "Category must have less than 32 characters"
                : ""
            }
            FormHelperTextProps={{
              sx: { color: "#FE0032", fontStyle: "italic" },
            }}
            id="outlined-search"
            label="Write category name"
            type="search"
          />
          <Box sx={{ mt: 2 }}>
            <ButtonPrimary
              text="Submit"
              onClick={handleClick}
              isLoading={!!isLoadingCreateNew}
            />
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: theme.palette.text.primary, my: 4 }} />
        <CategoryList category={category || []} isLoading={isLoading} />
      </Box>
    </Box>
  );
}

export default CategoryDashBoard;
