import { useState } from "react";
import { Box, Divider, Pagination, Typography } from "@mui/material";
import Comment from "../../../components/Comment";
import { useGetAllProductReviewsQuery } from "../../../redux/api/reviewSlice";
import PropTypes from "prop-types";

function CommentCom({ productId }) {
  const [page, setPage] = useState(1); // Trang hiện tại
  const limit = 5; // Số đánh giá mỗi trang

  // Gọi API với productId, page và limit
  const { data, isLoading, isError } = useGetAllProductReviewsQuery({
    id: productId,
    page,
    limit,
  });

  // Xử lý thay đổi trang
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Kiểm tra trạng thái tải và lỗi
  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading reviews</Typography>;

  // Lấy dữ liệu từ API response
  const reviews = data?.reviews || [];
  const totalReviews = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalReviews / limit) || 1;

  return (
    <Box px={2} py={2} boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="h6" fontWeight={400}>
          Product comments ({totalReviews})
        </Typography>
        {reviews.length > 0 ? (
          <>
            {reviews.map((review, index) => (
              <Box key={review._id}>
                <Comment
                  avatar={review.userId.avatar}
                  userName={review.userId.userName}
                  date={review.createdAt}
                  rating={review.rating}
                  comment={review.comment}
                  variations={review.variations}
                />
                {index < reviews.length - 1 && <Divider />}
              </Box>
            ))}
            <Pagination
              color="secondary"
              sx={{ margin: "0 auto", marginTop: 1 }}
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </>
        ) : (
          <Typography>No reviews yet.</Typography>
        )}
      </Box>
    </Box>
  );
}

CommentCom.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default CommentCom;
