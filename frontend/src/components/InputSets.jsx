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
  categories,
  handleAddField,
  handleCategoryInputChange,
  handleDeleteField,
}) => {
  return (
    <Box>
      {categories.map((category, setIndex) => (
        <Box key={category.label} mb={2}>
          <Typography variant="subtitle1">{category.label}</Typography>
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
          <Button onClick={() => handleAddField(setIndex)}>Add Field</Button>
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
};

export default InputSets;
