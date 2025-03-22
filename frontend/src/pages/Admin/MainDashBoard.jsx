import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  Fade,
  IconButton,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  ShoppingCart,
  AttachMoney,
  Inventory,
  People,
  MoreVert,
  FileDownload,
  CalendarToday
} from '@mui/icons-material';
import Chart from 'chart.js/auto';
import StatCard from './Chart/StatCard';
import { useNavigate } from 'react-router';

const timeRanges = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

// Chart data based on time range
const chartData = {
  day: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    revenue: [1200, 1900, 3000, 3500, 2800, 3200, 2900],
    orders: {
      pending: [10, 15, 20, 25, 18, 22, 20],
      confirmed: [8, 12, 18, 22, 15, 20, 18],
      completed: [5, 8, 15, 20, 12, 18, 15],
      cancelled: [2, 3, 4, 3, 5, 4, 3]
    },
    products: [15, 25, 35, 40, 30, 35, 32]
  },
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    revenue: [12000, 15000, 18000, 16000],
    orders: {
      pending: [40, 45, 50, 48],
      confirmed: [35, 40, 45, 42],
      completed: [30, 35, 40, 38],
      cancelled: [8, 10, 12, 10]
    },
    products: [150, 180, 200, 190]
  },
  year: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [45000, 48000, 52000, 49000, 53000, 55000, 60000, 58000, 56000, 62000, 65000, 68000],
    orders: {
      pending: [150, 160, 180, 170, 175, 185, 190, 185, 180, 195, 200, 210],
      confirmed: [130, 140, 160, 150, 155, 165, 170, 165, 160, 175, 180, 190],
      completed: [100, 110, 130, 120, 125, 135, 140, 135, 130, 145, 150, 160],
      cancelled: [20, 25, 30, 28, 30, 32, 35, 33, 32, 38, 40, 42]
    },
    products: [500, 520, 550, 530, 540, 560, 580, 570, 560, 590, 600, 620]
  }
};

const MainDashBoard = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('day');
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Chart refs
  const revenueChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const productsChartRef = useRef(null);
  const productsChartInstance = useRef(null);
  const orderStatesChartRef = useRef(null);
  const orderStatesChartInstance = useRef(null);
  const deliveryStatesChartRef = useRef(null);
  const deliveryStatesChartInstance = useRef(null);

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  // Common chart options
  const commonOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#2b3674',
          font: {
            family: theme.typography.fontFamily
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#a3aed0',
          font: {
            family: theme.typography.fontFamily
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#a3aed0',
          font: {
            family: theme.typography.fontFamily
          }
        }
      }
    }
  }), [theme.typography.fontFamily]);

  // Initialize charts
  useEffect(() => {
    // Revenue Chart
    if (revenueChartRef.current) {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }

      revenueChartInstance.current = new Chart(revenueChartRef.current, {
        type: 'line',
        data: {
          labels: chartData[timeRange].labels,
          datasets: [{
            label: 'Revenue',
            data: chartData[timeRange].revenue,
            borderColor: '#5a93ff',
            backgroundColor: 'rgba(90, 147, 255, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#5a93ff',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3
          }]
        },
        options: {
          ...commonOptions,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'white',
              titleColor: '#2b3674',
              bodyColor: '#2b3674',
              titleFont: {
                size: 13,
                weight: '600'
              },
              bodyFont: {
                size: 12
              },
              padding: 12,
              borderColor: 'rgba(0,0,0,0.05)',
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                title: function(items) {
                  return items[0].label;
                },
                label: function(item) {
                  return `Revenue: $${item.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#a3aed0'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0,0,0,0.05)'
              },
              ticks: {
                color: '#a3aed0',
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    // Products Chart
    if (productsChartRef.current) {
      if (productsChartInstance.current) {
        productsChartInstance.current.destroy();
      }

      productsChartInstance.current = new Chart(productsChartRef.current, {
        type: 'bar',
        data: {
          labels: chartData[timeRange].labels,
          datasets: [{
            label: 'Products Sold',
            data: chartData[timeRange].products,
            backgroundColor: '#82ca9d',
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              ...commonOptions.plugins.legend,
              position: 'bottom'
            }
          }
        }
      });
    }

    // Order States Chart
    if (orderStatesChartRef.current) {
      if (orderStatesChartInstance.current) {
        orderStatesChartInstance.current.destroy();
      }

      orderStatesChartInstance.current = new Chart(orderStatesChartRef.current, {
        type: 'bar',
        data: {
          labels: chartData[timeRange].labels,
          datasets: [
            {
              label: 'Pending',
              data: chartData[timeRange].orders.pending,
              backgroundColor: '#5a93ff',
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            },
            {
              label: 'Confirmed',
              data: chartData[timeRange].orders.confirmed,
              backgroundColor: '#82ca9d',
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            },
            {
              label: 'Completed',
              data: chartData[timeRange].orders.completed,
              backgroundColor: '#4CAF50',
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            },
            {
              label: 'Cancelled',
              data: chartData[timeRange].orders.cancelled,
              backgroundColor: '#f44336',
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            }
          ]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            title: {
              display: true,
              text: 'Order States',
              color: '#2b3674',
              font: {
                size: 16,
                weight: '600'
              },
              padding: {
                bottom: 24
              }
            },
            legend: {
              position: 'top',
              align: 'start',
              labels: {
                usePointStyle: true,
                padding: 20,
                boxWidth: 8
              }
            }
          },
          scales: {
            ...commonOptions.scales,
            y: {
              ...commonOptions.scales.y,
              beginAtZero: true,
              grid: {
                drawBorder: false
              }
            }
          }
        }
      });
    }

    // Delivery States Chart
    if (deliveryStatesChartRef.current) {
      if (deliveryStatesChartInstance.current) {
        deliveryStatesChartInstance.current.destroy();
      }

      deliveryStatesChartInstance.current = new Chart(deliveryStatesChartRef.current, {
        type: 'doughnut',
        data: {
          labels: [
            'Processing',
            'Shipped',
            'In Transit',
            'Delivered',
            'Failed',
            'Returned',
            'Cancelled'
          ],
          datasets: [{
            data: [30, 25, 20, 15, 5, 3, 2],
            backgroundColor: [
              '#f6c23e', // Processing - Yellow
              '#ff9f43', // Shipped - Orange
              '#9c27b0', // In Transit - Purple
              '#2196f3', // Delivered - Blue
              '#f44336', // Failed - Red
              '#795548', // Returned - Brown
              '#9e9e9e'  // Cancelled - Gray
            ],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          ...commonOptions,
          cutout: '65%',
          radius: '90%',
          plugins: {
            ...commonOptions.plugins,
            title: {
              display: true,
              text: 'Delivery States Distribution',
              color: '#2b3674',
              font: {
                size: 16,
                weight: '600'
              },
              padding: {
                bottom: 24
              }
            },
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                padding: 20,
                boxWidth: 8,
                color: '#2b3674',
                font: {
                  size: 11
                },
                generateLabels: (chart) => {
                  const data = chart.data;
                  return data.labels.map((label, i) => ({
                    text: `${label} (${data.datasets[0].data[i]}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].backgroundColor[i]
                  }));
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.label}: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    }

    // Cleanup
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (productsChartInstance.current) {
        productsChartInstance.current.destroy();
      }
      if (orderStatesChartInstance.current) {
        orderStatesChartInstance.current.destroy();
      }
      if (deliveryStatesChartInstance.current) {
        deliveryStatesChartInstance.current.destroy();
      }
    };
  }, [theme.typography.fontFamily, commonOptions, timeRange]);

  return (
    <Box sx={{
      py: 3,
      px: { xs: 2, md: 3 },
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#2b3674' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#a3aed0' }}>
            Welcome back! Here&apos;s what&apos;s happening with your store today.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
              size="small"
              startAdornment={
                <CalendarToday sx={{ mr: 1, fontSize: 20, color: 'action.active' }} />
              }
            >
              {timeRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExportClick}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Export
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value="$23,850"
            subtext="+12.5% from last month"
            icon={<AttachMoney sx={{ color: '#5a93ff' }} />}
            color="#5a93ff"
            trend="up"
            percentage={68}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value="1,245"
            subtext="+8.3% from last month"
            icon={<ShoppingCart sx={{ color: '#82ca9d' }} />}
            color="#82ca9d"
            trend="up"
            percentage={75}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value="384"
            subtext="+5.7% new products"
            icon={<Inventory sx={{ color: '#f6c23e' }} />}
            color="#f6c23e"
            trend="up"
            percentage={62}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value="2,845"
            subtext="+15.2% new users"
            icon={<People sx={{ color: '#ff9f43' }} />}
            color="#ff9f43"
            trend="up"
            percentage={82}
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Fade in timeout={1200}>
            <Paper sx={{ 
              p: 3,
              height: '100%',
              background: 'white',
              boxShadow: '0 2px 6px 0 rgba(0,0,0,0.05)',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s'
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, color: '#2b3674' }}>
                    Revenue Overview
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a3aed0' }}>
                    (+15.2%) than last month
                  </Typography>
                </Box>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 350, position: 'relative' }}>
                <canvas ref={revenueChartRef} />
              </Box>
            </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1200}>
            <Paper sx={{ 
              p: 3,
              height: '100%',
              background: 'white',
              boxShadow: '0 2px 6px 0 rgba(0,0,0,0.05)',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s'
              }
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2b3674' }}>
                Products Distribution
              </Typography>
              <Box sx={{ height: 350, position: 'relative' }}>
                <canvas ref={productsChartRef} />
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            height: '100%',
            borderRadius: 4,
            background: 'white',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.05)',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s'
            }
          }}>
            <Box sx={{ height: 350, position: 'relative' }}>
              <canvas ref={orderStatesChartRef} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            height: '100%',
            borderRadius: 4,
            background: 'white',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.05)',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s'
            }
          }}>
            <Box sx={{ height: 350, position: 'relative' }}>
              <canvas ref={deliveryStatesChartRef} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Fade in timeout={1200}>
            <Paper sx={{ 
              p: 3,
              background: 'white',
              boxShadow: '0 2px 6px 0 rgba(0,0,0,0.05)',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s'
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#2b3674' }}>
                  Recent Orders
                </Typography>
                <Button 
                  variant="text" 
                  onClick={() => {
                    navigate('/admin/order');
                  }}
                  sx={{ textTransform: 'none', color: '#a3aed0' }}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#2b3674', fontWeight: 700 }}>Time</TableCell>
                      <TableCell sx={{ color: '#2b3674', fontWeight: 700 }}>Order ID</TableCell>
                      <TableCell sx={{ color: '#2b3674', fontWeight: 700 }}>Customer</TableCell>
                      <TableCell sx={{ color: '#2b3674', fontWeight: 700 }}>Total</TableCell>
                      <TableCell sx={{ color: '#2b3674', fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        time: '10 Sep, 2024 8:20 PM',
                        id: '#OD1711',
                        customer: 'John Doe',
                        total: '$156.00',
                        status: 'CONFIRMED'
                      },
                      {
                        time: '10 Sep, 2024 7:45 PM',
                        id: '#OD1712',
                        customer: 'Jane Smith',
                        total: '$225.50',
                        status: 'PENDING'
                      },
                      {
                        time: '10 Sep, 2024 6:30 PM',
                        id: '#OD1713',
                        customer: 'Robert Johnson',
                        total: '$325.00',
                        status: 'COMPLETED'
                      },
                      {
                        time: '10 Sep, 2024 5:15 PM',
                        id: '#OD1714',
                        customer: 'Emily Brown',
                        total: '$189.99',
                        status: 'CANCELLED'
                      },
                      {
                        time: '10 Sep, 2024 4:00 PM',
                        id: '#OD1715',
                        customer: 'Michael Wilson',
                        total: '$432.25',
                        status: 'CONFIRMED'
                      }
                    ].sort((a, b) => new Date(b.time) - new Date(a.time)).map((order) => (
                      <TableRow
                        key={order.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.01)'
                          }
                        }}
                      >
                        <TableCell sx={{ color: '#2b3674' }}>
                          {order.time}
                        </TableCell>
                        <TableCell sx={{ color: '#2b3674' }}>
                          {order.id}
                        </TableCell>
                        <TableCell sx={{ color: '#2b3674' }}>
                          {order.customer}
                        </TableCell>
                        <TableCell sx={{ color: '#2b3674' }}>
                          {order.total}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              backgroundColor: 
                                order.status === 'COMPLETED' ? '#4CAF50' :
                                order.status === 'PENDING' ? '#f6c23e' :
                                order.status === 'CANCELLED' ? '#f44336' :
                                '#2196f3',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportClose}
      >
        <MenuItem onClick={handleExportClose}>
          Export as PDF
        </MenuItem>
        <MenuItem onClick={handleExportClose}>
          Export as Excel
        </MenuItem>
        <MenuItem onClick={handleExportClose}>
          Export as CSV
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MainDashBoard;