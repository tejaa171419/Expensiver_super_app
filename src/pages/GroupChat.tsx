import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical,
  Users,
  Search,
  Image,
  Mic,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  isOwn?: boolean;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "1",
      userName: "Alice Johnson",
      userAvatar: "",
      content: "Hey everyone! Ready for our trip expenses?",
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: "2",
      userId: "2", 
      userName: "You",
      userAvatar: "",
      content: "Absolutely! I've got the hotel receipts ready to upload.",
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      isOwn: true
    },
    {
      id: "3",
      userId: "3",
      userName: "Bob Smith",
      userAvatar: "",
      content: "Perfect! I'll add the restaurant bills from yesterday.",
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: "4",
      userId: "1",
      userName: "Alice Johnson", 
      userAvatar: "",
      content: "Thanks everyone! This makes splitting so much easier 🎉",
      timestamp: new Date(Date.now() - 900000),
      type: 'text'
    }
  ]);

  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "",
      role: 'admin',
      status: 'online'
    },
    {
      id: "2", 
      name: "You",
      avatar: "",
      role: 'admin',
      status: 'online'
    },
    {
      id: "3",
      name: "Bob Smith", 
      avatar: "",
      role: 'member',
      status: 'online'
    },
    {
      id: "4",
      name: "Carol Wilson",
      avatar: "",
      role: 'member', 
      status: 'away'
    },
    {
      id: "5",
      name: "David Brown",
      avatar: "",
      role: 'member',
      status: 'offline',
      lastSeen: new Date(Date.now() - 7200000)
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: "2",
      userName: "You", 
      userAvatar: "",
      content: message,
      timestamp: new Date(),
      type: 'text',
      isOwn: true
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500'; 
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b bg-card/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="hover:bg-accent/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-primary text-white">
            🏖️
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="font-semibold text-foreground">Beach Trip 2024</h1>
          <p className="text-sm text-muted-foreground">
            {members.filter(m => m.status === 'online').length} online • {members.length} members
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hover:bg-accent/50">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-accent/50">
            <Video className="w-5 h-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                <Users className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Group Members ({members.length})</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search members..." className="flex-1" />
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gradient-success text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">{member.name}</p>
                            {member.role === 'admin' && (
                              <Badge variant="secondary" className="text-xs">Admin</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.status === 'online' ? 'Online' : 
                             member.status === 'away' ? 'Away' : 
                             member.lastSeen ? `Last seen ${formatLastSeen(member.lastSeen)}` : 'Offline'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/group/${groupId}`)}>
                View Group Details
              </DropdownMenuItem>
              <DropdownMenuItem>Group Settings</DropdownMenuItem>
              <DropdownMenuItem>Export Chat</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Leave Group</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isOwn && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={msg.userAvatar} />
                  <AvatarFallback className="bg-gradient-success text-white text-xs">
                    {msg.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-1' : ''}`}>
                {!msg.isOwn && (
                  <p className="text-xs text-muted-foreground mb-1 ml-1">{msg.userName}</p>
                )}
                <Card className={`p-3 ${
                  msg.isOwn 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-card'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </Card>
                <p className={`text-xs text-muted-foreground mt-1 ${msg.isOwn ? 'text-right' : 'ml-1'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>

              {msg.isOwn && (
                <Avatar className="w-8 h-8 mt-1 order-2">
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="pr-12 min-h-[44px]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Camera className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="h-10 w-10 p-0 bg-primary hover:bg-primary/90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;