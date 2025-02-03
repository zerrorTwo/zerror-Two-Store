import { Avatar, Box, Rating, Typography } from "@mui/material";

function Comment() {
  return (
    <Box display={"flex"} gap={2}>
      <Box>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </Box>
      <Box>
        <Typography variant="body2">2024-05-15 11:42</Typography>
        <Rating size="small" name="read-only" value={4} readOnly />
        <pre
          style={{
            fontFamily: "'Roboto', 'Arial', sans-serif",
            fontSize: "14px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            margin: "0px",
          }}
        >
          {`- Nhận được hàng khá là ưng vì quần mềm và sờ vào rất là mát
- Shop phục vụ rất tốt,chuẩn bị hàng và giao hàng khá là nhanh
- Mọi người nên mua nhé, ck mình 65kg mặc size M vừa xinh luôn. 
- Lần sau sẽ quay lại ủng hộ shop,tặng cho shop 10 sao luôn nhé
- Mua trên live nên giá rất là rẻ,3 cái mà chưa tới 100k nữa ý. Đáng mua nha mọi người`}
        </pre>
      </Box>
    </Box>
  );
}

export default Comment;
