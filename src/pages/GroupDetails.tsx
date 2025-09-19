import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Settings, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Receipt,
  UserPlus,
  Share2,
  Archive,
  MessageSquare,
  Edit2,
  Copy,
  Calculator,
  History,
  BarChart3,
  Bell,
  Crown,
  Shield,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import AddExpenseForm from "@/components/AddExpenseForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  isAdmin: boolean;
  isActive: boolean;
  joinedAt: string;
  lastActive: string;
}

interface GroupExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  paidByName: string;
  splitAmong: string[];
  date: string;
  description?: string;
}

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<GroupExpense | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  });
  const [activeTab, setActiveTab] = useState('expenses');
  const [isAdmin] = useState(true); // Current user is admin for demo

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  // Handle navigation state for tab switching
  useEffect(() => {
    const state = location.state as { activeTab?: string };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      // Clear the state to prevent issues on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Mock data - replace with actual data from backend
  const groupData = {
    id: groupId || '1',
    name: 'Weekend Trip Expenses',
    description: 'Shared expenses for our amazing weekend getaway to the mountains',
    currency: '₹',
    totalExpenses: 15750.50,
    memberCount: 5,
    yourBalance: -1250.75,
    netBalance: -250.75,
    createdAt: 'January 15, 2024',
    isOwner: true,
    status: 'active' as const,
    avatar: undefined,
    expenseCount: 4,
    inviteCode: 'TRIP2024'
  };

  // Initialize edit form when component mounts
  useEffect(() => {
    setEditForm({
      name: groupData.name,
      description: groupData.description
    });
  }, [groupData.name, groupData.description]);

  const [members] = useState<GroupMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      balance: -500.25,
      isAdmin: true,
      isActive: true,
      joinedAt: '2024-02-15',
      lastActive: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice@company.com',
      balance: 1200.50,
      isAdmin: false,
      isActive: true,
      joinedAt: '2024-02-16',
      lastActive: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@company.com',
      balance: 0,
      isAdmin: false,
      isActive: true,
      joinedAt: '2024-02-16',
      lastActive: '2024-01-14T18:45:00Z'
    },
    {
      id: '4',
      name: 'Carol Smith',
      email: 'carol@company.com',
      balance: -750.00,
      isAdmin: false,
      isActive: true,
      joinedAt: '2024-02-17',
      lastActive: '2024-01-15T12:20:00Z'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@company.com',
      balance: 50.00,
      isAdmin: false,
      isActive: true,
      joinedAt: '2024-02-17',
      lastActive: '2024-01-13T16:10:00Z'
    }
  ]);

  const [expenses] = useState<GroupExpense[]>([
    {
      id: '1',
      title: 'Hotel Booking',
      amount: 8500,
      category: 'Accommodation',
      paidBy: '1',
      paidByName: 'John Doe',
      splitAmong: ['1', '2', '3', '4', '5'],
      date: '2024-01-10T00:00:00Z',
      description: 'Mountain resort booking for 2 nights'
    },
    {
      id: '2',
      title: 'Gas and Tolls',
      amount: 1250,
      category: 'Transportation',
      paidBy: '2',
      paidByName: 'Alice Johnson',
      splitAmong: ['1', '2', '3', '4'],
      date: '2024-01-11T00:00:00Z',
      description: 'Road trip expenses'
    },
    {
      id: '3',
      title: 'Group Dinner',
      amount: 3200,
      category: 'Food',
      paidBy: '4',
      paidByName: 'Carol Smith',
      splitAmong: ['1', '2', '3', '4', '5'],
      date: '2024-01-12T00:00:00Z',
      description: 'Fancy restaurant on the last night'
    },
    {
      id: '4',
      title: 'Adventure Activities',
      amount: 2800,
      category: 'Entertainment',
      paidBy: '3',
      paidByName: 'Bob Wilson',
      splitAmong: ['1', '2', '3', '4'],
      date: '2024-01-11T00:00:00Z',
      description: 'Hiking and adventure sports'
    }
  ]);

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-400';
    if (balance < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining': 
      case 'Food': return '🍽️';
      case 'Transportation': return '🚗';
      case 'Accommodation': return '🏨';
      case 'Entertainment': return '🎭'; 
      default: return '💰';
    }
  };

  // Handle expense detail view
  const handleExpenseClick = (expense: GroupExpense) => {
    setSelectedExpense(expense);
    setShowExpenseDetail(true);
  };

  // Get member name by ID
  const getMemberNameById = (id: string) => {
    return members.find(m => m.id === id)?.name || 'Unknown';
  };

  // Calculate individual share for an expense
  const calculateIndividualShare = (expense: GroupExpense) => {
    return expense.amount / expense.splitAmong.length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 animate-fade-in">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-primary/30 shadow-lg animate-bounce-in">
                    <AvatarImage src={groupData.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                      {groupData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {groupData.status === 'active' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full animate-pulse-glow flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gradient-cyber animate-slide-in-left">{groupData.name}</h1>
                    <Badge className="bg-success/20 text-success border-success/30 px-3 py-1 animate-slide-in-right w-fit">
                      {groupData.status}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-base sm:text-lg animate-slide-in-left" style={{ animationDelay: '0.1s' }}>{groupData.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-white/50 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full w-fit">
                      <Users className="w-4 h-4 text-primary" />
                      {groupData.memberCount} members
                    </span>
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full w-fit">
                      <Calendar className="w-4 h-4 text-primary" />
                      Created {new Date(groupData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 animate-slide-in-right w-full lg:w-auto">
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="bg-gradient-primary text-white px-6 hover:shadow-glow transition-all duration-300 hover:scale-105 flex-1 lg:flex-none"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
              <Button
                onClick={() => setShowInviteMember(true)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button 
                onClick={() => navigate(`/group/${groupId}/chat`)}
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditGroup(true)}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card hover-lift animate-slide-in-left stats-card">
            <CardContent className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-white mb-1 animate-bounce-in">
                {formatCurrency(groupData.totalExpenses)}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Expenses</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-lift animate-slide-in-left stats-card" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-8 text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
                groupData.yourBalance > 0 ? 'bg-emerald-400/20' : 'bg-red-400/20'
              }`}>
                <TrendingUp className={`w-8 h-8 ${getBalanceColor(groupData.yourBalance)}`} />
              </div>
              <div className={`text-3xl font-bold mb-1 animate-bounce-in ${getBalanceColor(groupData.yourBalance)}`}>
                {groupData.yourBalance > 0 ? '+' : ''}{formatCurrency(groupData.yourBalance)}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Your Balance</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-lift animate-slide-in-left stats-card" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
                <Receipt className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-white mb-1 animate-bounce-in">{expenses.length}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Expenses</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-lift animate-slide-in-left stats-card" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-white mb-1 animate-bounce-in">{members.length}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Members</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${groupData.isOwner ? 'grid-cols-4' : 'grid-cols-3'} bg-black/20 border border-white/10`}>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="balances" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Balances
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Members
            </TabsTrigger>
            {groupData.isOwner && (
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="expenses">
            <div className="space-y-6">
              {expenses.map((expense, index) => (
                <Card 
                  key={expense.id} 
                  className="glass-card hover-lift animate-fade-in group cursor-pointer" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleExpenseClick(expense)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-3xl group-hover:scale-110 transition-transform duration-300">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="font-bold text-white text-xl group-hover:text-primary transition-colors duration-300">{expense.title}</h3>
                          {expense.description && (
                            <p className="text-white/60 text-sm leading-relaxed">{expense.description}</p>
                          )}
                          <div className="flex items-center gap-6 text-sm text-white/50">
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="bg-primary text-white text-xs">
                                  {expense.paidByName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              Paid by {expense.paidByName}
                            </span>
                            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full">
                              <Calendar className="w-4 h-4" />
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full">
                              <Users className="w-4 h-4" />
                              Split among {expense.splitAmong.length} people
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">₹{expense.amount.toFixed(2)}</div>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                          {expense.category}
                        </Badge>
                        <div className="text-sm text-white/40 mt-2">
                          ₹{(expense.amount / expense.splitAmong.length).toFixed(2)} per person
                        </div>
                        <div className="text-xs text-white/30 mt-1">
                          Click for details
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {members.map((member, index) => (
                <Card key={member.id} className="glass-card hover-lift animate-fade-in group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-3 border-primary/30 group-hover:border-primary/60 transition-all duration-300">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {member.isAdmin && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                            {member.isAdmin && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs px-2 py-1">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-white/60 text-sm">{member.email}</p>
                          <p className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded-full inline-block">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className={`text-2xl font-bold ${getBalanceColor(member.balance)} group-hover:scale-110 transition-transform duration-300`}>
                          {member.balance > 0 ? '+' : ''}€{Math.abs(member.balance).toFixed(2)}
                        </div>
                        <div className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
                          {member.balance > 0 ? 'gets back' : member.balance < 0 ? 'owes' : 'settled'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Enhanced Add Member Card */}
              <Card className="glass-card border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in group" style={{ animationDelay: `${members.length * 0.1}s` }}>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-all duration-300">
                    <UserPlus className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">Invite Member</h3>
                  <p className="text-white/60 text-sm mb-6">Add someone new to this group</p>
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                    Send Invitation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="balances">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Balance Summary</CardTitle>
                  <CardDescription>Who owes what to whom</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {members
                    .filter(member => member.balance !== 0)
                    .sort((a, b) => b.balance - a.balance)
                    .map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium">{member.name}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getBalanceColor(member.balance)}`}>
                          {member.balance > 0 ? '+' : ''}€{Math.abs(member.balance).toFixed(2)}
                        </div>
                        <div className="text-xs text-white/40">
                          {member.balance > 0 ? 'gets back' : 'owes group'}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Suggested Settlements</CardTitle>
                  <CardDescription>Optimize payments to settle all debts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">Sarah should pay John</span>
                      <span className="text-emerald-400 font-bold">€120.50</span>
                    </div>
                    <div className="text-sm text-white/60">This will settle Sarah's debt</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Group Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-primary text-lg">Group Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Spent:</span>
                    <span className="font-bold text-white">€{groupData.totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Average per Member:</span>
                    <span className="font-bold text-white">€{(groupData.totalExpenses / members.length).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Active Expenses:</span>
                    <span className="font-bold text-white">{expenses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Settlement Progress:</span>
                    <span className="font-bold text-primary">
                      {Math.round((members.filter(m => m.balance === 0).length / members.length) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(members.filter(m => m.balance === 0).length / members.length) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-primary text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setShowAddExpense(true)}
                    className="w-full bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Expense
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Group Code
                  </Button>
                  {groupData.isOwner && (
                    <Button 
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Settle All Balances
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {groupData.isOwner && (
            <TabsContent value="settings">
              <div className="space-y-6">
                {/* Group Settings */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Group Settings
                    </CardTitle>
                    <CardDescription>Manage group preferences and permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Group Details */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Group Name</label>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-white">{groupData.name}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Description</label>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-white/70">{groupData.description}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Currency</label>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-white">{groupData.currency}</span>
                          </div>
                        </div>
                      </div>

                      {/* Group Actions */}
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-white">Group Actions</h4>
                          <Button 
                            variant="outline"
                            className="w-full justify-start border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => setShowAddExpense(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Expense
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite Members
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Group Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="glass-card border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <Archive className="w-5 h-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions that affect the entire group</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button 
                        variant="outline"
                        className="w-full justify-start border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Settle All Balances
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Enhanced Mobile Actions */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowAddExpense(true)}
              className="flex-1 bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
            {groupData.isOwner && (
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 h-12 px-4"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
        </div>

        {/* Add Expense Form Dialog */}
        <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-transparent border-0 p-0">
            <AddExpenseForm
              groupId={groupId}
              members={members}
              onSubmit={(expenseData) => {
                console.log('Expense submitted:', expenseData);
                toast({
                  title: "Expense Added!",
                  description: `₹${expenseData.amount} expense for "${expenseData.title}" has been recorded.`
                });
                setShowAddExpense(false);
              }}
              onCancel={() => setShowAddExpense(false)}
              defaultPayer={members.find(m => m.isAdmin)?.id}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Group Dialog */}
        <Dialog open={showEditGroup} onOpenChange={setShowEditGroup}>
          <DialogContent className="bg-black/95 border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Group Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Group Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white"
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white"
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditGroup(false)}
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!editForm.name.trim()) {
                      toast({
                        title: "Error",
                        description: "Group name is required",
                        variant: "destructive"
                      });
                      return;
                    }
                    toast({
                      title: "Success!",
                      description: "Group details updated successfully"
                    });
                    setShowEditGroup(false);
                  }}
                  className="flex-1 bg-gradient-primary text-white hover:shadow-glow"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite Member Dialog */}
        <Dialog open={showInviteMember} onOpenChange={setShowInviteMember}>
          <DialogContent className="bg-black/95 border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Invite New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Email Address</Label>
                <Input
                  type="email"
                  placeholder="friend@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              
              <Separator className="bg-white/20" />
              
              <div className="space-y-2">
                <Label className="text-white">Or share invite link</Label>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.origin}/join/${groupData.inviteCode}`}
                    readOnly
                    className="bg-white/10 border-white/30 text-white flex-1"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/join/${groupData.inviteCode}`);
                      toast({
                        title: "Success!",
                        description: "Invite link copied to clipboard"
                      });
                    }}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteMember(false);
                    setInviteEmail('');
                  }}
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!inviteEmail.trim()) {
                      toast({
                        title: "Error",
                        description: "Please enter an email address",
                        variant: "destructive"
                      });
                      return;
                    }
                    toast({
                      title: "Success!",
                      description: `Invitation sent to ${inviteEmail}`
                    });
                    setInviteEmail('');
                    setShowInviteMember(false);
                  }}
                  className="flex-1 bg-gradient-primary text-white hover:shadow-glow"
                >
                  Send Invite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="bg-black/95 border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Group Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  toast({
                    title: "Notifications",
                    description: "Notification settings updated"
                  });
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  toast({
                    title: "Export",
                    description: "Group data exported successfully"
                  });
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  toast({
                    title: "Privacy",
                    description: "Privacy settings updated"
                  });
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              
              <Separator className="bg-white/20" />
              
              <Button
                onClick={() => {
                  toast({
                    title: "Left Group",
                    description: "You have successfully left the group",
                    variant: "destructive"
                  });
                  navigate('/');
                }}
                variant="outline"
                className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Expense Detail Dialog */}
        <Dialog open={showExpenseDetail} onOpenChange={setShowExpenseDetail}>
          <DialogContent className="bg-black/95 border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedExpense && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                      {getCategoryIcon(selectedExpense.category)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedExpense.title}</h2>
                      <p className="text-white/60 text-sm font-normal">{selectedExpense.category}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Expense Overview */}
                  <Card className="glass-card border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-primary" />
                        Expense Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-white/60 text-sm mb-2">Total Amount</p>
                        <p className="text-3xl font-bold text-white">₹{selectedExpense.amount.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/60 text-sm mb-2">Per Person</p>
                        <p className="text-2xl font-bold text-primary">
                          ₹{(selectedExpense.amount / selectedExpense.splitAmong.length).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/60 text-sm mb-2">Date</p>
                        <p className="text-xl font-semibold text-white">
                          {new Date(selectedExpense.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Information */}
                  <Card className="glass-card border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-primary text-white text-lg font-bold">
                            {selectedExpense.paidByName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-lg">{selectedExpense.paidByName}</p>
                          <p className="text-white/60 text-sm">Paid the full amount</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-xl">₹{selectedExpense.amount.toFixed(2)}</p>
                          <p className="text-white/60 text-sm">Amount Paid</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Split Details */}
                  <Card className="glass-card border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Split Details ({selectedExpense.splitAmong.length} people)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedExpense.splitAmong.map((memberId) => {
                        const member = members.find(m => m.id === memberId);
                        const individualShare = calculateIndividualShare(selectedExpense);
                        const isPayer = memberId === selectedExpense.paidBy;
                        
                        return (
                          <div key={memberId} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                                  {member?.name.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-medium">{member?.name || 'Unknown Member'}</p>
                                <p className="text-white/60 text-sm">
                                  {isPayer ? 'Paid & owes' : 'Owes'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-lg ${
                                isPayer ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {isPayer ? '+' : '-'}₹{individualShare.toFixed(2)}
                              </p>
                              <p className="text-white/60 text-sm">
                                {isPayer ? 'Gets back' : 'Should pay'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Description */}
                  {selectedExpense.description && (
                    <Card className="glass-card border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80 leading-relaxed">{selectedExpense.description}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <Card className="glass-card border-white/20">
                    <CardContent className="p-6">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-white/30 text-white hover:bg-white/10"
                          onClick={() => setShowExpenseDetail(false)}
                        >
                          Close
                        </Button>
                        <Button
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GroupDetails;