import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Notification.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    updateMany: jest.fn(),
  },
}));

let getNotifications, markAsRead, markAllAsRead, Notification;

describe('Notification Controller', () => {
  let req, res;

  beforeAll(async () => {
    const notificationController = await import('../controllers/notificationController.js');
    getNotifications = notificationController.getNotifications;
    markAsRead = notificationController.markAsRead;
    markAllAsRead = notificationController.markAllAsRead;

    const notificationModule = await import('../models/Notification.js');
    Notification = notificationModule.default;
  });

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: 'user_id' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should get user notifications', async () => {
      const mockNotifications = [
        { _id: 'n1', message: 'Test 1', isRead: false },
        { _id: 'n2', message: 'Test 2', isRead: true }
      ];

      Notification.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockNotifications)
        })
      });

      await getNotifications(req, res);

      expect(Notification.find).toHaveBeenCalledWith({ userId: 'user_id' });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockNotifications });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      req.params.id = 'notif_id';
      const mockNotification = {
        _id: 'notif_id',
        userId: 'user_id',
        isRead: false,
        save: jest.fn().mockResolvedValue({ _id: 'notif_id', isRead: true })
      };

      Notification.findById.mockResolvedValue(mockNotification);

      await markAsRead(req, res);

      expect(Notification.findById).toHaveBeenCalledWith('notif_id');
      expect(mockNotification.isRead).toBe(true);
      expect(mockNotification.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should throw error if notification not found', async () => {
      req.params.id = 'invalid_id';
      Notification.findById.mockResolvedValue(null);

      await expect(markAsRead(req, res)).rejects.toThrow('Notification not found');
    });

    it('should throw error if user not authorized', async () => {
      req.params.id = 'notif_id';
      const mockNotification = {
        _id: 'notif_id',
        userId: 'other_user_id'
      };

      Notification.findById.mockResolvedValue(mockNotification);

      await expect(markAsRead(req, res)).rejects.toThrow('Not authorized');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      Notification.updateMany.mockResolvedValue({ modifiedCount: 5 });

      await markAllAsRead(req, res);

      expect(Notification.updateMany).toHaveBeenCalledWith(
        { userId: 'user_id', isRead: false },
        { isRead: true }
      );
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'All notifications marked as read' });
    });
  });
});
