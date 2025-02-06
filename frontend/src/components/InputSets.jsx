import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const InputSets = ({
  variations,
  handleAddField,
  handleCategoryInputChange,
  handleDeleteField,
  handleDeleteCategory,
}) => {
  return (
    <Box>
      {variations.map((category, setIndex) => (
        <Box key={category.label}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">{`Lable: ${category.label}`}</Typography>
            <IconButton
              aria-label="delete category"
              onClick={() => handleDeleteCategory(setIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box display={"flex"} gap={2}>
            {category.items.map((item, itemIndex) => (
              <TextField
                required
                key={itemIndex}
                value={item}
                onChange={(e) =>
                  handleCategoryInputChange(setIndex, itemIndex, e.target.value)
                }
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
          </Box>
          <Button
            sx={{
              mt: 1,
              backgroundColor: "secondary.main",
              color: "primary.contrastText",
              "&:hover": {
                backgroundColor: "primary.dark",
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
  variations: PropTypes.arrayOf(
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
