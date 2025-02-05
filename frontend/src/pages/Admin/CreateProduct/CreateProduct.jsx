import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import TabPanel from "../../../components/ProductTab/TabPanel";
import InforTab from "./InforTab";
import ImageTab from "./ImageTab";
import PriceTab from "./PriceTab";
import VariationTab from "./VariationTab";

function CreateProduct() {
  const [value, setValue] = useState(0); // Use numbers instead of strings

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value={0} label="Title/ Information" />
        <Tab value={1} label="Image" />
        <Tab value={2} label="Price" />
        <Tab value={3} label="Attribute" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <InforTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImageTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PriceTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <VariationTab />
      </TabPanel>
    </Box>
  );
}

export default CreateProduct;
