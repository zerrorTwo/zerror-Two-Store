import Box from "@mui/material/Box";
import InputBase from "../../../components/InputBase";
function PriceTab() {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <InputBase
        height="60px"
        label="Price"
        value={new Intl.NumberFormat().format(1000000000)}
      />
      <InputBase height="60px" label="Stock" />
    </Box>
  );
}

export default PriceTab;
