import   { useEffect, useState }  from 'react';
import PropTypes from 'prop-types';
import  Popover  from '@mui/material/Popover';
import  Box  from '@mui/material/Box';
import  Typography  from '@mui/material/Typography';
import  Rating  from '@mui/material/Rating';
import  TextField  from '@mui/material/TextField';
import  Button  from '@mui/material/Button';

const labels = {
    0.5: 'Terrible',
    1: 'Very Bad',
    1.5: 'Disappointed',
    2: 'Below Average',
    2.5: 'Fair',
    3: 'Acceptable',
    3.5: 'Quite Good',
    4: 'Good',
    4.5: 'Very Good',
    5: 'Excellent',
};

const CommentPopover = ({ anchorEl, onClose, onSubmit, id }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const open = Boolean(anchorEl);
  
  // Reset data when closing popover
  useEffect(() => {
    if (!open) {
      // Set timeout to ensure closing animation completes before resetting data
      const timer = setTimeout(() => {
        setRating(0);
        setComment('');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({ rating, comment });
    }
    onClose();
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: window.innerHeight / 2, left: window.innerWidth / 2 }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: { 
          p: 3, 
          width: 500, 
          borderRadius: 2, 
          boxShadow: 3, 
          bgcolor: 'white'
        }
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Product Review
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography component="legend" sx={{ fontSize: 14, fontWeight: 500, color: 'text.secondary' }}>
          Rating
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={0.5}
            size="large"
            sx={{ mt: 0.5 }}
          />
          <Box sx={{ ml: 2 }}>{labels[rating]}</Box>
        </Box>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Your Feedback"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience about this product..."
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!rating}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          Submit Review
        </Button>
      </Box>
    </Popover>
  );
};

CommentPopover.propTypes = {
  anchorEl: PropTypes.any,  
  onClose: PropTypes.func.isRequired,  
  onSubmit: PropTypes.func.isRequired,  
  id: PropTypes.string  
};

export default CommentPopover;