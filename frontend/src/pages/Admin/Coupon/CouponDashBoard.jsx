import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Input,
  Typography,
} from "@mui/material";
import { useEffect, useState, memo } from "react"; // Import React.memo
import GenericTable from "../../../components/GenericTable";

import { useGetAllCouponsQuery } from "../../../redux/api/couponSlice";
import { useNavigate } from "react-router";

// Wrap GenericTable and PopoverPaper with memo
const MemoizedGenericTable = memo(GenericTable);

const headCells = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "code", numeric: false, disablePadding: false, label: "Code" },
  {
    id: "start_day",
    numeric: false,
    disablePadding: false,
    label: "Start Day",
  },
  { id: "end_day", numeric: false, disablePadding: false, label: "End Day" },
  { id: "discount", numeric: false, disablePadding: false, label: "Discount" },
  {
    id: "target_type",
    numeric: false,
    disablePadding: false,
    label: "Target Type",
  },
  {
    id: "uses_count",
    numeric: true,
    disablePadding: false,
    label: "Uses Count",
  },
  {
    id: "is_public",
    numeric: false,
    disablePadding: false,
    label: "Is Public",
    boolean: true,
  },
  {
    id: "is_active",
    numeric: false,
    disablePadding: false,
    label: "Is Active",
    boolean: true,
  },
];

function CouponDashBoard() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const {
    data: { coupons: coupons = [], totalPages: totalPagesCoupon } = {},
    error: couponError,
    isLoading: couponLoading,
  } = useGetAllCouponsQuery({ page, limit: rowsPerPage });

  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (coupons && coupons.length > 0) {
      const newRows = coupons.map((coupon) => ({
        _id: coupon._id,
        name: coupon.name,
        code: coupon.code,
        start_day: coupon.start_day,
        end_day: coupon.end_day,
        discount: coupon.discount,
        target_type: coupon.target_type,
        uses_count: coupon.uses_count,
        is_public: coupon.is_public,
        is_active: coupon.is_active,
      }));
      setRows(newRows);
    }
  }, [coupons]);

  const handleCreateClick = (event) => {
    event.stopPropagation();
    navigate("/admin/create-coupon");
    
  };

  const handleDeleteConfirm = async () => {};
  const handleUpdateClick = (event, row) => {
    event.stopPropagation();
        console.log(row._id); 
        // navigate("/admin/coupon", { state: { row: selected[0] } }); // Uncomment to navigate to update page
  };

  if (couponLoading) return <div>Loading...</div>;
  if (couponError) return <div>Error loading categories</div>;

  return (
    <>
      <Box display={"flex"} justifyContent={"start"}>
        <Box display={"grid"}>
          <Typography variant="h5">Manager Coupon</Typography>
          <Divider
            sx={{
              width: "100%",
              bgcolor: "primary.main",
            }}
          />
        </Box>
      </Box>

      <Box display={"flex"} justifyContent={"space-between"} my={2} alignItems={"center"}>
      <Button variant="contained" onClick={handleCreateClick}>
          Create New
        </Button>
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "&::before": {
                borderBottom: "1px solid black",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "2px solid black",
              },
              "&::after": {
                borderBottom: "2px solid black",
              },
              "&.Mui-focused::after": {
                borderBottom: "2px solid black",
              },
            }}
            placeholder="Search name product"
          />
          <Button variant="contained" color="primary" >
            Search
          </Button>
        </Box>
        
      </Box>

      <Box>
        <>
          {couponLoading ? (
            <CircularProgress />
          ) : (
            <MemoizedGenericTable
              name="List Coupon"
              rows={rows}
              headCells={headCells}
              selected={selected}
              setSelected={setSelected}
              handleUpdateClick={handleUpdateClick}
              onDeleteConfirm={handleDeleteConfirm}
            
              page={page - 1}
              rowsPerPage={rowsPerPage}
              totalPages={totalPagesCoupon}
              onPageChange={(_, newPage) => setPage(newPage + 1)} // Chuyển đổi từ 0-based sang 1-based
              onRowsPerPageChange={(event) => {
                setPage(1);
                setRowsPerPage(parseInt(event.target.value, 10));
              }}
            />
          )}
        </>
      </Box>
    </>
  );
}

export default CouponDashBoard;
