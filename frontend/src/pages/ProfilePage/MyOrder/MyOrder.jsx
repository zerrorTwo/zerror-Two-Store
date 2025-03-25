import { lazy, Suspense } from 'react';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import CustomTabPanel from "../../../components/CustomTabPanel";
import a11yProps from "../../../../utils/a11yProps";
import CircularProgress from '@mui/material/CircularProgress';

// Lazy load all order components
const MyOrderAll = lazy(() => import("./MyOrderAll"));
const MyOrdertoPay = lazy(() => import("./MyOrderToPay"));
const MyOrdertoShip = lazy(() => import("./MyOrderToShip"));
const MyOrdertoConfirm = lazy(() => import("./MyOrderToConfirm"));
const MyOrdertoCompleted = lazy(() => import("./MyOrderToCompleted"));
const MyOrdertoCancelled = lazy(() => import("./MyOrderToCancelled"));
const MyOrdertoReturn = lazy(() => import("./MyOrderToReturn"));

// Loading component
const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
    <CircularProgress />
  </Box>
);

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
              backgroundColor: `${theme.palette.secondary.main} !important`,
            },
          }}
        >
          <Tab label="Tất cả" {...a11yProps(0)} />
          <Tab label="Chờ thanh toán" {...a11yProps(1)} />
          <Tab label="Đang giao" {...a11yProps(2)} />
          <Tab label="Chờ xác nhận" {...a11yProps(3)} />
          <Tab label="Hoàn thành" {...a11yProps(4)} />
          <Tab label="Đã hủy" {...a11yProps(5)} />
          <Tab label="Trả hàng" {...a11yProps(6)} />
        </Tabs>
      </Box>

      {/* Render tab panels with Suspense */}
      <Suspense fallback={<Loading />}>
        <CustomTabPanel value={value} index={0}>
          <MyOrderAll />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MyOrdertoPay />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <MyOrdertoShip />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <MyOrdertoConfirm />
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
      </Suspense>
    </Box>
  );
}