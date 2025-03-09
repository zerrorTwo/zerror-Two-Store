import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import MyOrderAll from './MyOrder/MyOrderAll';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MyOrder() {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs example"
          variant="fullWidth"
          sx={{
            '& .Mui-selected': {
              color: `${theme.palette.secondary.main} !important`,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'secondary.main',
            },
            '& .MuiTab-root': {
              minWidth: 0,
              flex: 1,
              textTransform: 'none',
            }
          }}
        >
          <Tab sx={{fontSize: '16px'}} label="All" {...a11yProps(0)} />
          <Tab sx={{fontSize: '16px'}} label="To Pay" {...a11yProps(1)} />
          <Tab sx={{fontSize: '16px'}} label="To Ship" {...a11yProps(2)} />
          <Tab sx={{fontSize: '16px'}} label="To Receive" {...a11yProps(3)} />
          <Tab sx={{fontSize: '16px'}} label="Completed" {...a11yProps(4)} />
          <Tab sx={{fontSize: '16px'}} label="Cancelled" {...a11yProps(5)} />
          <Tab sx={{fontSize: '16px'}} label="Return Refund" {...a11yProps(6)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MyOrderAll />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}