import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  Card,
  CardContent,
  Stack,
  CircularProgress,
  FormControlLabel
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
import 'react-toastify/dist/ReactToastify.css';
import { useGetPageProductQuery } from '../../../redux/api/productSlice';
import { useGetAllCategoryTreeQuery } from '../../../redux/api/categorySlice';
import { toast } from 'react-toastify';
import { useCreateNewCouponMutation } from '../../../redux/api/couponSlice';

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
    is_public: false,
    is_active: true
  });

  const [productAnchorEl, setProductAnchorEl] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef(null);
  const productsPerPage = 10;

  const {
    data: { products: rows = [], totalPages } = {},
    isLoading,
  } = useGetPageProductQuery({
    page,
    limit: productsPerPage,
    category: categoryQuery,
    search: searchQuery,
  });


  const {
    data: listCate = [],
  } = useGetAllCategoryTreeQuery();

  const [createNewCoupon, { isLoading: createNewCouponLoading }] = useCreateNewCouponMutation();

  useEffect(() => {
    if (rows) {
      if (page === 1) {
        setLoadedProducts(rows);
      } else {
        setLoadedProducts(prev => [...prev, ...rows]);
      }
      setHasMore(page < totalPages);
      setIsLoadingMore(false);
    }
  }, [rows, page, totalPages]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchQuery, categoryQuery]);

  const handleScroll = useCallback(() => {
    if (listRef.current && !isLoadingMore && hasMore) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setIsLoadingMore(true);
        setPage(prevPage => prevPage + 1);
      }
    }
  }, [isLoadingMore, hasMore]);

  const filteredProducts = useMemo(() => {
    return loadedProducts;
  }, [loadedProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductPopoverOpen = (event) => {
    setProductAnchorEl(event.currentTarget);
    setPage(1);
    setSearchTerm('');
    setCategoryFilter('');
    setSearchQuery('');
    setCategoryQuery('');
  };

  const handleProductPopoverClose = () => {
    setProductAnchorEl(null);
    setSearchTerm('');
    setCategoryFilter('');
  };

  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.some(p => p._id === product._id);
    let updatedProducts;

    if (isSelected) {
      updatedProducts = selectedProducts.filter(p => p._id !== product._id);
    } else {
      updatedProducts = [...selectedProducts, product];
    }

    setSelectedProducts(updatedProducts);
    setCouponData(prev => ({
      ...prev,
      target_ids: updatedProducts.map(p => p._id)
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
        target_ids: filteredProducts.map(p => p._id) 
      }));
    }
  };

  // Calculate minimum price of selected products
  const minProductPrice = useMemo(() => {
    if (selectedProducts.length === 0) return 0;
    return Math.min(...selectedProducts.map(product => 
      product.minPrice || product.price || 0
    ));
  }, [selectedProducts]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { 
      style: "currency", 
      currency: "VND" 
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format dates to avoid timezone issues - ensure valid dates
      let startDate = new Date();
      try {
        if (couponData.start_day) {
          startDate = new Date(couponData.start_day);
          startDate.setHours(12, 0, 0, 0);
        }
      } catch (err) {
        console.error("Invalid start date:", err);
      }
      
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      try {
        if (couponData.end_day) {
          endDate = new Date(couponData.end_day);
          endDate.setHours(12, 0, 0, 0);
        }
      } catch (err) {
        console.error("Invalid end date:", err);
      }
      
      const formattedData = {
        name: couponData.name,
        description: couponData.description,
        code: couponData.code,
        start_day: startDate.toISOString(),
        end_day: endDate.toISOString(),
        type: couponData.type,
        value: Number(couponData.value),
        max_value: Number(couponData.max_value),
        min_value: Number(couponData.min_value),
        max_uses: Number(couponData.max_uses),
        max_uses_per_user: Number(couponData.max_uses_per_user),
        target_type: couponData.target_type,
        target_ids: selectedProducts.map(p => p._id),
        is_public: couponData.is_public,
        is_active: couponData.is_active
      };
      
      const result = await createNewCoupon({data: formattedData}).unwrap();
      if (result) {
        toast.success('Coupon Created Successfully!');
        // Reset form
        setCouponData({
          name: '',
          description: '',
          code: '',
          start_day: new Date(),
          end_day: new Date(new Date().setDate(new Date().getDate() + 30)),
          type: 'PERCENT',
          value: 0,
          max_value: 0,
          min_value: 0,
          max_uses: 0,
          max_uses_per_user: '1',
          target_type: 'PRODUCT',
          target_ids: [],
          is_public: false,
          is_active: true
        });
        setSelectedProducts([]);
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      const errorMessage = error.data?.message || 'Failed to create coupon';
      toast.error(errorMessage);
    }
  };

  // Get unique categories from API data
  const categories = useMemo(() => {
    return listCate && listCate.length > 0 
      ? listCate 
      : [];
  }, [listCate]);

  // Handle search button click
  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCategoryQuery(categoryFilter);
  };

  const renderCategoryOptions = () => {
    return categories.map(category => (
      <MenuItem key={category.slug} value={category.slug}>
        {category.name}
      </MenuItem>
    ));
  };

  return (
    <Box sx={{ margin: 'auto', py: 2 }}>
      <Box sx={{ p: 4, borderRadius: 2, bgcolor: 'white' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="500" color="primary">
            Create Coupon
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* General Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              General Information
            </Typography>
            <Card elevation={2} sx={{ bgcolor: 'white', mb: 3 }}>
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
          </Box>

          {/* Time Range & Limits Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Time Range & Limits
            </Typography>
            <Card elevation={2} sx={{ bgcolor: 'white', mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      name="start_day"
                      value={couponData.start_day || new Date().toISOString().split('T')[0]}
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
                      value={couponData.end_day || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]}
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
                        <MenuItem value="AMOUNT">Fixed Amount (đ)</MenuItem>
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
                      label={couponData.target_type === 'PRODUCT' ? "Minimum Product Value" : "Minimum Order Value"}
                      name="min_value"
                      type="number"
                      value={couponData.min_value}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₫</InputAdornment>
                        ),
                        endAdornment: couponData.min_value && (
                          <InputAdornment position="end">
                            <Typography variant="caption" color="primary" sx={{ whiteSpace: 'nowrap' }}>
                              {formatCurrency(couponData.min_value)}
                            </Typography>
                          </InputAdornment>
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
                          <InputAdornment position="start">₫</InputAdornment>
                        ),
                        endAdornment: couponData.max_value && (
                          <InputAdornment position="end">
                            <Typography variant="caption" color="primary" sx={{ whiteSpace: 'nowrap' }}>
                              {formatCurrency(couponData.max_value)}
                            </Typography>
                          </InputAdornment>
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
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Display minimum price of selected products when target_type is PRODUCT */}
          {couponData.target_type === 'PRODUCT' && selectedProducts.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ mt: 1, mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'primary.main' }}>
                <Typography variant="body2" color="text.secondary">
                  Minimum product price: <Typography component="span" fontWeight="bold" color="primary">{formatCurrency(minProductPrice)}</Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  For fixed amount coupons, the discount value must be less than the minimum price of selected products.
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Target Settings Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Target Settings
            </Typography>
            <Card elevation={2} sx={{ bgcolor: 'white', mb: 3 }}>
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
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Coupon Status Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Coupon Status
            </Typography>
            <Card elevation={2} sx={{ bgcolor: 'white', mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={couponData.is_public}
                          onChange={(e) => handleChange({ target: { name: 'is_public', value: e.target.checked } })}
                          name="is_public"
                        />
                      }
                      label="Is Public"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={couponData.is_active}
                          onChange={(e) => handleChange({ target: { name: 'is_active', value: e.target.checked } })}
                          name="is_active"
                        />
                      }
                      label="Is Active"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CouponIcon />}
              disabled={createNewCouponLoading}
            >
              {createNewCouponLoading ? 'Creating...' : 'Create Coupon'}
            </Button>
          </Box>
        </form>
      </Box>

      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{ top: window.innerHeight / 2  - 500, left: window.innerWidth / 2 +  150 }}
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
            maxWidth: '90vw',
            maxHeight: '90vh',
            minHeight: '90vh'
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search products..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
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
              </Box>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {renderCategoryOptions()}
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                onClick={handleSearch}
                fullWidth
              >
                Search
              </Button>
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

            <List 
              sx={{ overflow: 'auto', maxHeight: '50vh' }}
              ref={listRef}
              onScroll={handleScroll}
            >
              {isLoading && page === 1 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredProducts.length > 0 ? (
                <>
                  {filteredProducts.map((product, index) => (
                    <ListItem 
                      key={index} 
                      onClick={() => handleProductSelect(product)}
                      component="div"
                      sx={{ 
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        ...(selectedProducts.some(p => p._id === product._id) && {
                          bgcolor: 'primary.lighter',
                          
                        })
                      }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedProducts.some(p => p._id === product._id)}
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
                          <Typography component="div" variant="body2">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={product.type || 'Unknown'} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                              />
                              <Chip 
                                label={`$${formatCurrency(product.price)}`} 
                                size="small" 
                                variant="outlined"
                                color="secondary"
                              />
                            </Box>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                  {isLoadingMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">No products found</Typography>
                </Box>
              )}
            </List>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {selectedProducts.length} of {totalPages * productsPerPage} selected
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

    </Box>
  );
};

export default CreateNewCoupon;