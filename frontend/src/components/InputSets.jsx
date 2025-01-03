import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const InputSets = ({
  categories,
  handleAddField,
  handleCategoryInputChange,
  handleDeleteField,
  handleDeleteCategory,
}) => {
  const theme = useTheme();
  return (
    <Box>
      {categories.map((category, setIndex) => (
        <Box key={category.label} mb={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1">{category.label}</Typography>
            <IconButton
              aria-label="delete category"
              onClick={() => handleDeleteCategory(setIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          {category.items.map((item, itemIndex) => (
            <TextField
              required
              key={itemIndex}
              value={item}
              onChange={(e) =>
                handleCategoryInputChange(setIndex, itemIndex, e.target.value)
              }
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="delete item"
                      onClick={() => handleDeleteField(setIndex, itemIndex)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}
          <Button
            sx={{
              mt: 1,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={() => handleAddField(setIndex)}
          >
            Add Field
          </Button>
        </Box>
      ))}
    </Box>
  );
};

InputSets.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  handleAddField: PropTypes.func.isRequired,
  handleCategoryInputChange: PropTypes.func.isRequired,
  handleDeleteField: PropTypes.func.isRequired,
  handleDeleteCategory: PropTypes.func.isRequired,
};

export default InputSets;
