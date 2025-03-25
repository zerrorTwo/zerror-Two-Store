import { useState, useMemo } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Popover,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Stack
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  LocalOffer as CouponIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Add as AddIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock product data (replace with actual data source)
const MOCK_PRODUCTS = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics' },
  { id: 2, name: 'Wireless Headphones', price: 199.99, category: 'Audio' },
  { id: 3, name: 'Smart Watch', price: 299.99, category: 'Wearables' },
  { id: 4, name: 'Bluetooth Speaker', price: 99.99, category: 'Audio' },
  { id: 5, name: 'Smartphone X', price: 799.99, category: 'Electronics' }
];

const CreateNewCoupon = () => {
  const [couponData, setCouponData] = useState({
    name: '',
    code: '',
    description: '',
    start_day: '',
    end_day: '',
    type: 'PERCENT',
    value: '',
    min_value: '',
    max_value: '',
    max_uses: '',
    max_uses_per_user: '1',
    target_type: 'PRODUCT',
    target_ids: [],
  });

  const [productAnchorEl, setProductAnchorEl] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Filtering and searching products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => 
      (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === '' || product.category === categoryFilter)
    );
  }, [searchTerm, categoryFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductPopoverOpen = (event) => {
    setProductAnchorEl(event.currentTarget);
  };

  const handleProductPopoverClose = () => {
    setProductAnchorEl(null);
    setSearchTerm('');
    setCategoryFilter('');
  };

  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    let updatedProducts;

    if (isSelected) {
      updatedProducts = selectedProducts.filter(p => p.id !== product.id);
    } else {
      updatedProducts = [...selectedProducts, product];
    }

    setSelectedProducts(updatedProducts);
    setCouponData(prev => ({
      ...prev,
      target_ids: updatedProducts.map(p => p.id)
    }));
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
      setCouponData(prev => ({ ...prev, target_ids: [] }));
    } else {
      setSelectedProducts([...filteredProducts]);
      setCouponData(prev => ({ 
        ...prev, 
        target_ids: filteredProducts.map(p => p.id) 
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission logic
    toast.success('Coupon Created Successfully!');
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Get unique categories
  const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];

  // Steps for the stepper
  const steps = ['General Information', 'Time Range & Limits', 'Target Settings'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card elevation={2} sx={{ bgcolor: 'white' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Coupon Name"
                    name="name"
                    value={couponData.name}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CouponIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Coupon Code"
                    name="code"
                    value={couponData.code}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CouponIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={couponData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Provide a detailed description for this coupon"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <InfoIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card elevation={2} sx={{ bgcolor: 'white' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    name="start_day"
                    value={couponData.start_day}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    name="end_day"
                    value={couponData.end_day}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider>
                    <Chip label="Discount Settings" color="primary" />
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      name="type"
                      value={couponData.type}
                      onChange={handleChange}
                      label="Discount Type"
                      startAdornment={
                        <InputAdornment position="start">
                          <MoneyIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="PERCENT">Percentage (%)</MenuItem>
                      <MenuItem value="AMOUNT">Fixed Amount ($)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={couponData.type === 'PERCENT' ? 'Percentage Value (%)' : 'Amount Value ($)'}
                    name="value"
                    type="number"
                    value={couponData.value}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {couponData.type === 'PERCENT' ? '%' : '$'}
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Minimum Order Value"
                    name="min_value"
                    type="number"
                    value={couponData.min_value}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Maximum Discount"
                    name="max_value"
                    type="number"
                    value={couponData.max_value}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Maximum Uses"
                    name="max_uses"
                    type="number"
                    value={couponData.max_uses}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge color="primary" badgeContent={couponData.max_uses || 0} max={999} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Uses Per User"
                    name="max_uses_per_user"
                    type="number"
                    value={couponData.max_uses_per_user}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge color="primary" badgeContent={couponData.max_uses_per_user || 0} max={999} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card elevation={2} sx={{ bgcolor: 'white' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Target Type</InputLabel>
                    <Select
                      name="target_type"
                      value={couponData.target_type}
                      onChange={handleChange}
                      label="Target Type"
                      startAdornment={
                        <InputAdornment position="start">
                          {couponData.target_type === 'PRODUCT' && <CategoryIcon color="primary" />}
                          {couponData.target_type === 'ORDER' && <CartIcon color="primary" />}
                          {couponData.target_type === 'FREESHIPPING' && <ShippingIcon color="primary" />}
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="PRODUCT">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CategoryIcon />
                          <span>Product Specific</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="ORDER">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CartIcon />
                          <span>Entire Order</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="FREESHIPPING">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ShippingIcon />
                          <span>Free Shipping</span>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {couponData.target_type === 'PRODUCT' && (
                  <Grid item xs={12}>
                    <Button 
                      variant="outlined" 
                      onClick={handleProductPopoverOpen}
                      fullWidth
                      color="primary"
                      startIcon={<AddIcon />}
                      sx={{ 
                        py: 1.5, 
                        borderStyle: 'dashed', 
                        borderWidth: '2px',
                        '&:hover': {
                          borderStyle: 'dashed',
                          borderWidth: '2px',
                        }
                      }}
                    >
                      Select Products ({selectedProducts.length} selected)
                    </Button>
                    
                    {selectedProducts.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedProducts.map(product => (
                          <Chip
                            key={product.id}
                            label={product.name}
                            onDelete={() => handleProductSelect(product)}
                            color="primary"
                            variant="outlined"
                            avatar={<Avatar>{product.name.charAt(0)}</Avatar>}
                          />
                        ))}
                      </Box>
                    )}
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ margin: 'auto', py: 2 }}>
      <Box  sx={{ p: 4, borderRadius: 2, bgcolor: 'white' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <CouponIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight="500" color="primary">
            Create Coupon
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBackStep}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CouponIcon />}
              >
                Create Coupon
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextStep}
                color="primary"
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Box>

      <Popover
      anchorReference="anchorPosition"
      anchorPosition={{ top: window.innerHeight / 2, left: window.innerWidth / 2 +  150 }}
        open={Boolean(productAnchorEl)}
        anchorEl={productAnchorEl}
        onClose={handleProductPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          elevation: 8,
          sx: { 
            borderRadius: 2,
            overflow: 'hidden',
            width: 550,
            maxWidth: '90vw'
          }
        }}
      >
        <Box sx={{ p: 0 }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">Select Products</Typography>
            <IconButton size="small" onClick={handleProductPopoverClose} sx={{ color: 'white' }}>
              <ClearIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm('')} size="small">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1, 
              p: 1, 
              bgcolor: 'action.hover',
              borderRadius: 1
            }}>
              <Checkbox
                indeterminate={
                  selectedProducts.length > 0 && 
                  selectedProducts.length < filteredProducts.length
                }
                checked={
                  filteredProducts.length > 0 && 
                  selectedProducts.length === filteredProducts.length
                }
                onChange={handleSelectAll}
                color="primary"
              />
              <Typography variant="body2" fontWeight="500">
                Select All ({filteredProducts.length} products)
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <List sx={{ maxHeight: 350, overflow: 'auto' }}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ListItem 
                    key={product.id} 
                    onClick={() => handleProductSelect(product)}
                    button
                    sx={{ 
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': { bgcolor: 'action.hover' },
                      ...(selectedProducts.some(p => p.id === product.id) && {
                        bgcolor: 'primary.lighter',
                        '&:hover': { bgcolor: 'primary.light' },
                      })
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={selectedProducts.some(p => p.id === product.id)}
                        edge="start"
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body1" fontWeight="500">
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={product.category} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                          <Chip 
                            label={`$${product.price}`} 
                            size="small" 
                            variant="outlined"
                            color="secondary"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">No products found</Typography>
                </Box>
              )}
            </List>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {selectedProducts.length} of {filteredProducts.length} selected
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleProductPopoverClose}
                size="small"
              >
                Done
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>

      <ToastContainer position="bottom-right" theme="colored" />
    </Box>
  );
};

export default CreateNewCoupon;