import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ title, value, subtext, icon, color, trend, percentage }) => {
  return (
    <Paper sx={{ 
      p: 3,
      background: 'white',
      boxShadow: '0 2px 6px 0 rgba(0,0,0,0.05)',
      '&:hover': {
        transform: 'translateY(-4px)',
        transition: 'all 0.3s'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2b3674' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: '#a3aed0', mt: 0.5 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 1.5,
          borderRadius: 2,
          bgcolor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: `${color}15`,
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
              borderRadius: 3
            }
          }}
        />
      </Box>
      <Typography 
        variant="body2" 
        sx={{ 
          mt: 1,
          color: trend === 'up' ? '#4CAF50' : '#F44336',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        {trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
        <span>{subtext}</span>
      </Typography>
    </Paper>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subtext: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['up', 'down']),
  percentage: PropTypes.number
};

export default StatCard;
