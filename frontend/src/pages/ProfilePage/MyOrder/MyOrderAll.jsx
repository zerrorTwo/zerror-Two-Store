import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

function MyOrderAll() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for orders - trong thực tế sẽ lấy từ API
  const orders = [
    {
      id: "123456",
      date: "2024-03-20",
      status: "To Pay",
      type: "Giao hangf thanh cong",
      items: [
        {
          name: "1 cục xà bông Irish Spring Original Mỹ 113g/127g",
          quantity: 2,
          variation: "Variation: 1 cục nhỏ 113g",
          price: 50000,
          image:
            "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsgsmmnmyhtw86_tn",
        },
      ],
      total: 100000,
    },
    // Thêm nhiều đơn hàng khác ở đây
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Order ID or Product Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#F5F5F5",
              },
            },
          }}
        />
      </Box>

      {/* Orders List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {orders.map((order) => (
          <Card key={order.id} sx={{ width: "100%", bgcolor: "white" }}>
            <CardContent>
              {/* Order Header */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Order ID: {order.id}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#051a" }}>
                    {order.type}
                  </Typography>

                  <Divider orientation="vertical" />

                  <Typography variant="body1" sx={{ color: "secondary.main" }}>
                    {order.status}
                  </Typography>
                  <Button
                sx={{ color: "white", bgcolor: "secondary.main" }}
                variant="outlined"
                size="small"
                color="primary"
              >
                Pay now
              </Button>
                </Box>
              </Box>

              <Divider />

              {/* Order Items */}
              {order.items.map((item, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, my: 2 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography color="text.secondary" variant="body1">
                        {item.name}
                      </Typography>
                      <Typography variant="body1">{item.variation}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        x{item.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₫{item.price.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" color="text.secondary">
                        Order Total: 
                      </Typography>
                    <Typography variant="h5" color="secondary.main">
                      ₫{item.price.toLocaleString()}
                    </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Divider />

              {/* Order Footer */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                    sx={{ color: "black", bgcolor: "#F5F5F5" }}
                    variant="outlined"
                    size="small"
                  >
                    View Cancellation Details
                  </Button>
                <Button
                    sx={{ color: "white", bgcolor: "secondary.main" }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  >
                    Rate
                  </Button>
                  <Button
                    sx={{ color: "black", bgcolor: "#F5F5F5" }}
                    variant="outlined"
                    size="small"
                  >
                    View Details
                  </Button>
                  <Button
                    sx={{ color: "white", bgcolor: "secondary.main" }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  >
                    Buy Again
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default MyOrderAll;
