import React, { useEffect } from 'react';
import { Bell, CheckCheck, Truck, Map, Wrench, Fuel, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchNotifications, markAsRead, markAllAsRead } from '../store/slices/notificationsSlice';

export const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.notifications);
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);
  const isLoading = useAppSelector(state => state.notifications.isLoading);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TripAssigned':
      case 'TripCompleted':
        return <Map size={20} className="text-blue-500" />;
      case 'MaintenanceDue':
        return <Wrench size={20} className="text-orange-500" />;
      case 'FuelAlert':
        return <Fuel size={20} className="text-red-500" />;
      default:
        return <Info size={20} className="text-slate-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TripAssigned':
      case 'TripCompleted':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'MaintenanceDue':
        return 'bg-orange-500/20 border-orange-500/30';
      case 'FuelAlert':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes les notifications sont lues'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} icon={<CheckCheck size={18} />}>
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            Chargement...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 transition-colors ${
                  notification.isRead ? 'bg-slate-900' : 'bg-slate-800/50'
                } hover:bg-slate-800/70`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border ${getTypeColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white mb-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="capitalize">{notification.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>•</span>
                          <span>{new Date(notification.createdAt).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs px-3 py-1.5"
                        >
                          Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
