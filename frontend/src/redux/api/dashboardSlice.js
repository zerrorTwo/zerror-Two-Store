import { apiSlice } from "./apiSlice";

const DASHBOARD_URL = "/dashboard";
const ORDER_URL = "/order";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChartData: builder.query({
      query: (timeframe = "day") => ({
        url: `${DASHBOARD_URL}/chart?timeframe=${timeframe}`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getRecentOrders: builder.query({
      query: (limit = 10) => ({
        url: `${ORDER_URL}/recent?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getProductDistribution: builder.query({
      query: () => ({
        url: '/dashboard/product-distribution',
        method: 'GET',
      }),
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: '/dashboard/stats',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetChartDataQuery,
  useGetRecentOrdersQuery,
  useGetProductDistributionQuery,
  useGetDashboardStatsQuery,
} = dashboardApiSlice;