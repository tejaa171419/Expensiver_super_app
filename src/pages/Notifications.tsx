import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  X, 
  Users, 
  CreditCard, 
  MessageSquare, 
  UserPlus,
  TrendingUp,
  Calendar,
  Settings,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  type: 'expense' | 'payment' | 'group' | 'message' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
  groupId?: string;
  groupName?: string;
  amount?: number;
  currency?: string;
  avatar?: string;
  userName?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: 'expense',
      title: 'New Expense Added',
      message: 'Alice added "Dinner at Ocean View" ($120.50) to Beach Trip 2024',
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
      actionRequired: true,
      groupId: 'group-1',
      groupName: 'Beach Trip 2024',
      amount: 120.50,
      currency: 'USD',
      userName: 'Alice Johnson',
      avatar: ''
    },
    {
      id: "2",
      type: 'payment',
      title: 'Payment Request',
      message: 'Bob requests $45.25 for your share of gas expenses',
      timestamp: new Date(Date.now() - 900000),
      isRead: false,
      actionRequired: true,
      amount: 45.25,
      currency: 'USD',
      userName: 'Bob Smith',
      avatar: ''
    },
    {
      id: "3",
      type: 'message',
      title: 'New Message',
      message: 'Carol: "Can someone upload the hotel receipt?"',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
      groupId: 'group-1',
      groupName: 'Beach Trip 2024',
      userName: 'Carol Wilson',
      avatar: ''
    },
    {
      id: "4", 
      type: 'group',
      title: 'Added to Group',
      message: 'You were added to "Weekend Getaway" by David',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      groupId: 'group-2',
      groupName: 'Weekend Getaway',
      userName: 'David Brown',
      avatar: ''
    },
    {
      id: "5",
      type: 'payment',
      title: 'Payment Received',
      message: 'Alice sent you $30.00 for coffee expenses',
      timestamp: new Date(Date.now() - 7200000),
      isRead: true,
      amount: 30.00,
      currency: 'USD',
      userName: 'Alice Johnson',
      avatar: ''
    },
    {
      id: "6",
      type: 'reminder',
      title: 'Settlement Reminder', 
      message: 'Beach Trip 2024 has pending settlements worth $156.75',
      timestamp: new Date(Date.now() - 10800000),
      isRead: true,
      actionRequired: true,
      groupId: 'group-1',
      groupName: 'Beach Trip 2024',
      amount: 156.75,
      currency: 'USD'
    },
    {
      id: "7",
      type: 'system',
      title: 'Export Complete',
      message: 'Your expense report for March 2024 is ready for download',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'expense': return <TrendingUp className={iconClass} />;
      case 'payment': return <CreditCard className={iconClass} />;
      case 'group': return <Users className={iconClass} />;
      case 'message': return <MessageSquare className={iconClass} />;
      case 'reminder': return <Calendar className={iconClass} />;
      case 'system': return <Settings className={iconClass} />;
      default: return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'expense': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'payment': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'group': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'message': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'reminder': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'system': return 'bg-gray-500/10 text-gray-600 border-gray-200';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.groupId) {
      if (notification.type === 'message') {
        navigate(`/group/${notification.groupId}/chat`);
      } else {
        navigate(`/group/${notification.groupId}`);
      }
    } else if (notification.type === 'payment') {
      navigate('/wallet');
    }
  };

  const filterNotifications = (notifications: Notification[], filter: string) => {
    switch (filter) {
      case 'unread': return notifications.filter(n => !n.isRead);
      case 'actions': return notifications.filter(n => n.actionRequired);
      case 'payments': return notifications.filter(n => n.type === 'payment');
      case 'groups': return notifications.filter(n => n.type === 'group' || n.type === 'message');
      default: return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-accent/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveTab('all')}>
                  All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('unread')}>
                  Unread Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('actions')}>
                  Action Required
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('payments')}>
                  Payments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('groups')}>
                  Groups & Messages
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <Check className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs">
              Actions ({actionCount})
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">
              Payments
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              Groups
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Notifications List */}
      <main className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {['all', 'unread', 'actions', 'payments', 'groups'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-3">
                  {filterNotifications(notifications, tab).length === 0 ? (
                    <Card className="p-8 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
                      <p className="text-muted-foreground">
                        {tab === 'unread' ? "All caught up! You don't have any unread notifications." :
                         tab === 'actions' ? "No actions required at the moment." :
                         "You'll see notifications here when there's activity."}
                      </p>
                    </Card>
                  ) : (
                    filterNotifications(notifications, tab).map((notification) => (
                      <Card
                        key={notification.id}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : 'hover:bg-accent/50'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-foreground/80'}`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {notification.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.isRead && (
                                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem 
                                      onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                      className="text-destructive"
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>

                            {/* User info and amount */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {notification.userName && (
                                  <div className="flex items-center gap-1">
                                    <Avatar className="w-4 h-4">
                                      <AvatarImage src={notification.avatar} />
                                      <AvatarFallback className="text-xs bg-gradient-success text-white">
                                        {notification.userName.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{notification.userName}</span>
                                  </div>
                                )}
                                {notification.groupName && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.groupName}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {notification.amount && (
                                  <span className="font-medium text-foreground">
                                    ${notification.amount.toFixed(2)}
                                  </span>
                                )}
                                <span>{formatTimestamp(notification.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Notifications;