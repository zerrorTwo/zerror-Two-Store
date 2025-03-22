import { dashboardService } from "../services/dashboard.service.js";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

const getChartData = asyncHandler(async (req, res) => {
  const { timeframe } = req.query;

  // Validate timeframe
  if (!timeframe || !['day', 'month', 'year'].includes(timeframe)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid timeframe. Must be one of: day, month, year"
    });
    return;
  }

  const data = await dashboardService.getChartData(timeframe);
  res.status(StatusCodes.OK).json(data);
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  res.status(StatusCodes.OK).json(stats);
});

const getDistribution = asyncHandler(async (req, res) => {
  const distribution = await dashboardService.getDistribution();
  res.status(StatusCodes.OK).json(distribution);
});

export const dashboardController = {
  getChartData,
  getStats,
  getDistribution
};