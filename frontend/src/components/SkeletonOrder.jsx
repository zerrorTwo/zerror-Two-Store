import { Card, CardContent, Box, Skeleton } from "@mui/material";

const SkeletonOrder = () => (
  <Card sx={{ width: "100%", bgcolor: "white", mb: 2 }}>
    <CardContent>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Skeleton variant="text" width={200} height={24} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Skeleton variant="text" width={80} height={24} />
          <Skeleton variant="text" width={80} height={24} />
        </Box>
      </Box>

      {/* Items */}
      {[1, 2].map((_, idx) => (
        <Box key={idx} sx={{ display: "flex", gap: 2, my: 2 }}>
          <Skeleton variant="rectangular" width={80} height={80} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="20%" height={20} />
          </Box>
          <Skeleton variant="text" width={80} height={24} />
        </Box>
      ))}

      {/* Footer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Skeleton variant="text" width={120} height={24} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default SkeletonOrder;