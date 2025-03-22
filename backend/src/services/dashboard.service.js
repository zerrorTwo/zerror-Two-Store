import { getDashboardChartData, getDashboardStats, getProductDistribution } from "../repositories/dashboard.repository.js";

const getChartData = async (timeframe) => {
  try {
    const chartData = await getDashboardChartData(timeframe);
    return chartData;
  } catch (error) {
    throw error;
  }
};

const getStats = async () => {
  try {
    const stats = await getDashboardStats();
    return stats;
  } catch (error) {
    throw error;
  }
};

const getDistribution = async (timeframe) => {
  try {
    const distribution = await getProductDistribution(timeframe);
    return distribution;
  } catch (error) {
    throw error;
  }
};

export const dashboardService = {
  getChartData,
  getStats,
  getDistribution
};