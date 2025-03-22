import PropTypes from 'prop-types';
import { 
  Paper, 
  Typography,
  Fade,
  Box
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer 
} from 'recharts';

const PieChartCard = ({ title, data }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {name}
      </text>
    );
  };

  return (
    <Fade in timeout={1000}>
      <Paper sx={{ 
        p: 3,
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
          transition: 'all 0.3s'
        }
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 300 }}>
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <Box sx={{ width: '40%' }}>
            {data.map((entry, index) => (
              <Box 
                key={`legend-${index}`} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2 
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: entry.color,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">{entry.name}</Typography>
                </Box>
                <Typography variant="body2" fontWeight="medium">
                  {((entry.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

PieChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

export default PieChartCard;
