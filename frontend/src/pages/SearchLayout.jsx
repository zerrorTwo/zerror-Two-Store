import {
  Box,
  Container,
  Grid2,
  Button,
  Divider,
  Input,
  Rating,
} from "@mui/material";
import Typography from "@mui/material/Typography";
// import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "@mui/material/Link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import ProductMini from "../components/ProductMini";

const data = [
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
];

function SearchLayout() {
  const [rating, setRating] = useState(0);

  return (
    <Box>
      <Container>
        {/* Content */}
        <Box py={2}>
          <Grid2 container spacing={1.5}>
            <Grid2 size={2}>
              <Box>
                <Link
                  sx={{
                    textDecoration: "none",
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  href={"/"}
                >
                  <MenuIcon />
                  All Categories
                </Link>

                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  <Link
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                    }}
                    href="/"
                  >
                    <Typography
                      sx={{
                        display: "-webkit-box", // Hiển thị như một box flex
                        WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                        overflow: "hidden", // Ẩn nội dung tràn
                        WebkitLineClamp: 1, // Giới hạn số dòng là 2
                        textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                      }}
                      variant="body2"
                    >
                      Mot chiec xe
                    </Typography>
                  </Link>
                  <Link
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                    }}
                    href="/"
                  >
                    <Typography
                      sx={{
                        display: "-webkit-box", // Hiển thị như một box flex
                        WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                        overflow: "hidden", // Ẩn nội dung tràn
                        WebkitLineClamp: 1, // Giới hạn số dòng là 2
                        textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                      }}
                      variant="body2"
                    >
                      Mot chiec xe
                    </Typography>
                  </Link>
                  <Link
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                    }}
                    href="/"
                  >
                    <Typography
                      sx={{
                        display: "-webkit-box", // Hiển thị như một box flex
                        WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                        overflow: "hidden", // Ẩn nội dung tràn
                        WebkitLineClamp: 1, // Giới hạn số dòng là 2
                        textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                      }}
                      variant="body2"
                    >
                      Mot chiec xe
                    </Typography>
                  </Link>
                  <Link
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                    }}
                    href="/"
                  >
                    <Typography
                      sx={{
                        display: "-webkit-box", // Hiển thị như một box flex
                        WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                        overflow: "hidden", // Ẩn nội dung tràn
                        WebkitLineClamp: 1, // Giới hạn số dòng là 2
                        textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                      }}
                      variant="body2"
                    >
                      Mot chiec xe
                    </Typography>
                  </Link>
                  <Link
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                    }}
                    href="/"
                  >
                    <Typography
                      sx={{
                        display: "-webkit-box", // Hiển thị như một box flex
                        WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                        overflow: "hidden", // Ẩn nội dung tràn
                        WebkitLineClamp: 1, // Giới hạn số dòng là 2
                        textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                      }}
                      variant="body2"
                    >
                      Mot chiec xe
                    </Typography>
                  </Link>
                  <Typography
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "text.primary",
                      WebkitBoxOrient: "vertical", // Cần thiết để lineClamp hoạt động
                      overflow: "hidden", // Ẩn nội dung tràn
                      WebkitLineClamp: 1, // Giới hạn số dòng là 2
                      textOverflow: "ellipsis", // Hiển thị "..." nếu nội dung bị cắt
                    }}
                    variant="body2"
                  >
                    More <ArrowDropDownIcon />
                  </Typography>
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  <Typography
                    sx={{
                      color: "text.primary",
                    }}
                    variant="body2"
                  >
                    Price
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-between"}
                  >
                    <Input
                      sx={{
                        fontSize: "12px",
                        maxWidth: "80px",
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
                      placeholder="Min"
                      type="number"
                    />
                    -
                    <Input
                      sx={{
                        fontSize: "12px",
                        maxWidth: "80px",
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
                      placeholder="Max"
                      type="number"
                    />
                  </Box>
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box display={"flex"} flexDirection={"column"} gap={2} my={2}>
                  <Typography
                    sx={{
                      color: "text.primary",
                    }}
                    variant="body2"
                  >
                    Rating
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                    justifyContent={"space-between"}
                  >
                    <Rating
                      name="half-rating"
                      value={rating}
                      onChange={(e) => setRating(+e.target.value)}
                      precision={0.5}
                    />
                  </Box>
                </Box>
                <Divider sx={{ mt: 1.5 }} />
                <Box my={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "secondary.main", color: "common.white" }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Grid2>
            <Grid2 size={10}>
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={2}
                bgcolor={"rgba(0,0,0,.03)"}
                p={1.5}
                borderRadius={1}
              >
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  Sort by
                </Typography>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Popular
                </Button>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Lastest
                </Button>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Price down
                </Button>
                <Button
                  sx={{ color: "text.primary", borderColor: "text.primary" }}
                  variant="outlined"
                >
                  Price up
                </Button>
              </Box>
              <Grid2 container spacing={1.5}>
                {data.map((item, index) => (
                  <Grid2 key={index} size={2.4}>
                    <ProductMini img={item} />
                  </Grid2>
                ))}
              </Grid2>
              {/* Footer */}
              <Box justifyContent={"center"} display={"flex"} mt={4}>
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 10 }}
                  >
                    See more
                  </Button>
                </Link>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
}

export default SearchLayout;
