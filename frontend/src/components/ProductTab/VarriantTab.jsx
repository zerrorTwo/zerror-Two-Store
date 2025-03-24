import PropTypes from "prop-types";
import { Box } from "@mui/material/Box";
import { Typography } from "@mui/material/Typography";
import InputSets from "../InputSets";
import ButtonPrimary from "../ButtonPrimary";
import DynamicTable from "./DynamicTable";
import InputBase from "../InputBase";

const VarriantTab = ({
  formData,
  categories,
  tableData,
  handleInputChange,
  handleAddField,
  handleAddSet,
  handleTableChange,
}) => {
  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <Box display={"flex"} gap={2} mb={2}>
          <InputBase
            type="number"
            margin="normal"
            label="Price default"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
          <InputBase
            type="number"
            margin="normal"
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </Box>
        <Typography variant="h6">Attributes</Typography>
        <InputSets categories={categories} handleAddField={handleAddField} />
        <ButtonPrimary text="Thêm phân loại hàng" onClick={handleAddSet} />
      </Box>

      <Typography>Table</Typography>
      <DynamicTable
        categories={categories}
        tableData={tableData}
        handleTableChange={handleTableChange}
      />
    </Box>
  );
};

VarriantTab.propTypes = {
  formData: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleAddField: PropTypes.func.isRequired,
  handleAddSet: PropTypes.func.isRequired,
  handleTableChange: PropTypes.func.isRequired,
};

export default VarriantTab;
