import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, CheckCheck, Calendar, AlertCircle, Info } from 'lucide-react';
import type { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationsComponent({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsProps) {
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'confirmation':
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'change':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'cancellation':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card
      className={`cursor-pointer transition-colors ${
        !notification.read ? 'border-primary/50 bg-accent/50' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4>{notification.title}</h4>
              {!notification.read && (
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with your bookings and room availability
          </p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button variant="outline" onClick={onMarkAllAsRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <CardDescription>No notifications yet</CardDescription>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <CardDescription>You're all caught up!</CardDescription>
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
