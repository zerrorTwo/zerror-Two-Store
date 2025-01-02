import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import InputBase from "./InputBase";
import ButtonOutLined from "./ButtonOutLined";

const InputSets = ({ categories, handleAddField }) => {
  return (
    <>
      {categories.map((category, setIndex) => (
        <Box
          pb={2}
          key={setIndex}
          margin={"0 auto"}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          maxWidth={350}
        >
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <Typography variant="subtitle1">{category.label}</Typography>
            {category.items.map((item, itemIndex) => (
              <InputBase key={itemIndex} label={category.label} value={item} />
            ))}
            <ButtonOutLined
              text={`Thêm ${category.label}`}
              onClick={() => handleAddField(setIndex)}
            />
          </Box>
        </Box>
      ))}
    </>
  );
};

InputSets.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
    })
  ).isRequired,
  handleAddField: PropTypes.func.isRequired,
};

export default InputSets;
