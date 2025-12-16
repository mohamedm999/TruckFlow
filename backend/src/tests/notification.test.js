import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Notification.js', () => ({
  default: { findById: jest.fn(), updateMany: jest.fn() },
}));

describe('Notification Controller', () => {
  let markAsRead, Notification, req, res;

  beforeAll(async () => {
    const notificationController = await import('../controllers/notificationController.js');
    markAsRead = notificationController.markAsRead;
    Notification = (await import('../models/Notification.js')).default;
  });

  beforeEach(() => {
    req = { params: {}, user: { _id: 'user_id' } };
    res = { json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should mark notification as read', async () => {
    req.params.id = 'notif_id';
    const mockNotification = {
      userId: 'user_id',
      isRead: false,
      save: jest.fn()
    };

    Notification.findById.mockResolvedValue(mockNotification);

    await markAsRead(req, res);

    expect(mockNotification.isRead).toBe(true);
    expect(mockNotification.save).toHaveBeenCalled();
  });

  it('should throw error if notification not found', async () => {
    req.params.id = 'invalid_id';
    Notification.findById.mockResolvedValue(null);

    await expect(markAsRead(req, res)).rejects.toThrow('Notification not found');
  });
});
