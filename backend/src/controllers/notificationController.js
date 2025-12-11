import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  
  res.json({ success: true, data: notifications });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true, data: notification });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ success: true, message: 'All notifications marked as read' });
});
