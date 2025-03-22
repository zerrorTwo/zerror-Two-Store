import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachHourOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  getWeek,
  subMonths,
} from "date-fns";

// Helper function to get time ranges
const getTimeRanges = (timeframe) => {
  const now = new Date();
  switch (timeframe) {
    case "day":
      return {
        start: startOfDay(now),
        end: endOfDay(now),
        intervals: eachHourOfInterval(
          { start: startOfDay(now), end: endOfDay(now) },
          { step: 4 }
        ),
      };
    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        intervals: eachWeekOfInterval({
          start: startOfMonth(now),
          end: endOfMonth(now),
        }),
      };
    case "year":
      return {
        start: startOfYear(now),
        end: endOfYear(now),
        intervals: eachMonthOfInterval({
          start: startOfYear(now),
          end: endOfYear(now),
        }),
      };
    default:
      throw new Error("Invalid timeframe");
  }
};

// Get revenue data
const getRevenueData = async (timeframe) => {
  const { start, end, intervals } = getTimeRanges(timeframe);

  const orders = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        state: { $ne: "CANCELLED" },
      },
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: { $eq: [timeframe, "day"] },
                then: {
                  $subtract: [
                    { $toDate: "$createdAt" },
                    { $mod: [{ $toLong: "$createdAt" }, 4 * 60 * 60 * 1000] },
                  ],
                },
              },
              {
                case: { $eq: [timeframe, "month"] },
                then: { $week: "$createdAt" },
              },
              {
                case: { $eq: [timeframe, "year"] },
                then: { $month: "$createdAt" },
              },
            ],
            default: "$createdAt",
          },
        },
        revenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Map intervals to revenue data
  return intervals.map((interval) => {
    const matchingRevenue = orders.find((r) => {
      if (timeframe === "month") {
        return getWeek(interval) === r._id;
      } else if (timeframe === "year") {
        return interval.getMonth() + 1 === r._id;
      }
      return r._id.getTime() === interval.getTime();
    });
    return matchingRevenue ? matchingRevenue.revenue : 0;
  });
};

// Get order statistics
const getOrderStats = async (timeframe) => {
  const { start, end, intervals } = getTimeRanges(timeframe);

  const orderStats = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: { $eq: [timeframe, "day"] },
                then: {
                  $subtract: [
                    { $toDate: "$createdAt" },
                    { $mod: [{ $toLong: "$createdAt" }, 4 * 60 * 60 * 1000] },
                  ],
                },
              },
              {
                case: { $eq: [timeframe, "month"] },
                then: { $week: "$createdAt" },
              },
              {
                case: { $eq: [timeframe, "year"] },
                then: { $month: "$createdAt" },
              },
            ],
            default: "$createdAt",
          },
        },
        orders: {
          $push: {
            state: "$state",
            count: 1,
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Map intervals to order stats
  return intervals.map((interval) => {
    const matchingStats = orderStats.find((stat) => {
      if (timeframe === "month") {
        return getWeek(interval) === stat._id;
      } else if (timeframe === "year") {
        return interval.getMonth() + 1 === stat._id;
      }
      return stat._id.getTime() === interval.getTime();
    }) || { orders: [] };

    return {
      pending: matchingStats.orders.filter((o) => o.state === "PENDING").length,
      confirmed: matchingStats.orders.filter((o) => o.state === "CONFIRMED")
        .length,
      completed: matchingStats.orders.filter((o) => o.state === "COMPLETED")
        .length,
      cancelled: matchingStats.orders.filter((o) => o.state === "CANCELLED")
        .length,
    };
  });
};

// Get product statistics
const getProductStats = async (timeframe) => {
  const { start, end, intervals } = getTimeRanges(timeframe);

  const productStats = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        state: { $ne: "CANCELLED" },
      },
    },
    {
      $unwind: "$products",
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: { $eq: [timeframe, "day"] },
                then: {
                  $subtract: [
                    { $toDate: "$createdAt" },
                    { $mod: [{ $toLong: "$createdAt" }, 4 * 60 * 60 * 1000] },
                  ],
                },
              },
              {
                case: { $eq: [timeframe, "month"] },
                then: { $week: "$createdAt" },
              },
              {
                case: { $eq: [timeframe, "year"] },
                then: { $month: "$createdAt" },
              },
            ],
            default: "$createdAt",
          },
        },
        totalProducts: { $sum: "$products.quantity" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Map intervals to product data
  return intervals.map((interval) => {
    const matchingProducts = productStats.find((p) => {
      if (timeframe === "month") {
        return getWeek(interval) === p._id;
      } else if (timeframe === "year") {
        return interval.getMonth() + 1 === p._id;
      }
      return p._id.getTime() === interval.getTime();
    });
    return matchingProducts ? matchingProducts.totalProducts : 0;
  });
};

// Get top categories from orders
const getProductDistribution = async (timeframe) => {
  const { start, end } = getTimeRanges(timeframe);

  const categories = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $lookup: {
        from: "categories",
        localField: "productDetails.type",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: "$categoryDetails",
    },
    {
      $group: {
        _id: "$categoryDetails._id",
        name: { $first: "$categoryDetails.name" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  return categories.map((c) => ({
    name: c.name,
    count: c.count,
  }));
};

// Get dashboard statistics
const getDashboardStats = async () => {
  const now = new Date();
  const lastMonth = subMonths(now, 1);

  // Get current month stats
  const currentMonthStats = await Promise.all([
    OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
          state: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]),
    ProductModel.countDocuments(),
    OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
        },
      },
      {
        $group: {
          _id: "$state",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Get last month stats for comparison
  const lastMonthStats = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfMonth(lastMonth),
          $lte: endOfMonth(lastMonth),
        },
        state: { $ne: "CANCELLED" },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
  ]);

  const currentStats = currentMonthStats[0][0] || { revenue: 0, orders: 0 };
  const lastStats = lastMonthStats[0] || { revenue: 0, orders: 0 };
  const totalProducts = currentMonthStats[1];
  const orderStateStats = currentMonthStats[2].reduce((acc, curr) => {
    acc[curr._id.toLowerCase()] = curr.count;
    return acc;
  }, {});

  // Calculate percentage changes
  const revenueChange = lastStats.revenue
    ? ((currentStats.revenue - lastStats.revenue) / lastStats.revenue) * 100
    : 0;
  const ordersChange = lastStats.orders
    ? ((currentStats.orders - lastStats.orders) / lastStats.orders) * 100
    : 0;

  return {
    currentRevenue: currentStats.revenue,
    revenueChange,
    currentOrders: currentStats.orders,
    ordersChange,
    totalProducts,
    orderStateStats,
  };
};

// Get dashboard chart data
const getDashboardChartData = async (timeframe) => {
  const { intervals } = getTimeRanges(timeframe);

  // Get all data in parallel
  const [revenue, orderStats, products] = await Promise.all([
    getRevenueData(timeframe),
    getOrderStats(timeframe),
    getProductStats(timeframe),
  ]);

  // Format labels based on timeframe
  const labels = intervals.map((interval) => {
    switch (timeframe) {
      case "day":
        return format(interval, "HH:mm");
      case "month":
        return `Week ${getWeek(interval)}`;
      case "year":
        return format(interval, "MMM");
      default:
        return "";
    }
  });

  // Format the response
  return {
    labels,
    revenue,
    orders: {
      pending: orderStats.map((stat) => stat.pending),
      confirmed: orderStats.map((stat) => stat.confirmed),
      completed: orderStats.map((stat) => stat.completed),
      cancelled: orderStats.map((stat) => stat.cancelled),
    },
    products,
  };
};

export {
  getRevenueData,
  getOrderStats,
  getProductStats,
  getDashboardChartData,
  getProductDistribution,
  getDashboardStats,
};
