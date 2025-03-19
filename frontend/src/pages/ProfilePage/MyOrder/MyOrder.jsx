import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import MyOrderAll from "./MyOrderAll";
import CustomTabPanel from "../../../components/CustomTabPanel";
import a11yProps from "../../../../utils/a11yProps";
import MyOrdertoPay from "./MyOrderToPay";
import MyOrdertoShip from "./MyOrderToShip";
import MyOrdertoConfirm from "./MyOrderToConfirm";
import MyOrdertoCompleted from "./MyOrderToCompleted";
import MyOrdertoCancelled from "./MyOrderToCancelled";
import MyOrdertoReturn from "./MyOrderToReturn";

export default function MyOrder() {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
          sx={{
            "& .Mui-selected": {
              color: `${theme.palette.secondary.main} !important`,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "secondary.main",
            },
            "& .MuiTab-root": {
              minWidth: 0,
              flex: 1,
              textTransform: "none",
            },
          }}
        >
          <Tab sx={{ fontSize: "16px" }} label="All" {...a11yProps(0)} />
          <Tab sx={{ fontSize: "16px" }} label="To Pay" {...a11yProps(1)} />
          <Tab sx={{ fontSize: "16px" }} label="To Confirm" {...a11yProps(2)} />
          <Tab sx={{ fontSize: "16px" }} label="To Ship" {...a11yProps(3)} />
          <Tab sx={{ fontSize: "16px" }} label="Completed" {...a11yProps(4)} />
          <Tab sx={{ fontSize: "16px" }} label="Cancelled" {...a11yProps(5)} />
          <Tab
            sx={{ fontSize: "16px" }}
            label="Return Refund"
            {...a11yProps(5)}
          />
        </Tabs>
      </Box>
      <Box sx={{ padding: 3 }}>
        <CustomTabPanel value={value} index={0}>
          <MyOrderAll />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MyOrdertoPay />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <MyOrdertoConfirm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <MyOrdertoShip />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <MyOrdertoCompleted />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <MyOrdertoCancelled />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={6}>
          <MyOrdertoReturn />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
