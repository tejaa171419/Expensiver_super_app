import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  MessageSquare
} from "lucide-react";
import AddExpenseModal from "@/components/AddExpenseModal";
import { useToast } from "@/hooks/use-toast";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  isOwner: boolean;
  joinedAt: string;
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
  const { toast } = useToast();
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Mock data - replace with actual data from backend
  const groupData = {
    id: groupId || '1',
    name: 'Europe Trip 2024',
    description: 'Our amazing European adventure with friends',
    currency: 'EUR',
    totalExpenses: 2850.50,
    memberCount: 6,
    yourBalance: -120.50,
    createdAt: '2024-02-15',
    isOwner: true,
    status: 'active' as const,
    avatar: undefined
  };

  const [members] = useState<GroupMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      balance: 250.75,
      isOwner: true,
      joinedAt: '2024-02-15'
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      balance: -120.50,
      isOwner: false,
      joinedAt: '2024-02-16'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      balance: 45.25,
      isOwner: false,
      joinedAt: '2024-02-16'
    }
  ]);

  const [expenses] = useState<GroupExpense[]>([
    {
      id: '1',
      title: 'Hotel in Paris',
      amount: 480.00,
      category: 'Accommodation',
      paidBy: '1',
      paidByName: 'John Doe',
      splitAmong: ['1', '2', '3'],
      date: '2024-02-20',
      description: 'Three nights at Hotel Le Marais'
    },
    {
      id: '2',
      title: 'Dinner at Italian Restaurant',
      amount: 120.50,
      category: 'Food & Dining',
      paidBy: '2',
      paidByName: 'Sarah Smith',
      splitAmong: ['1', '2', '3'],
      date: '2024-02-21'
    },
    {
      id: '3',
      title: 'Train tickets to Rome',
      amount: 250.00,
      category: 'Transportation',
      paidBy: '1',
      paidByName: 'John Doe',
      splitAmong: ['1', '2', '3'],
      date: '2024-02-22'
    }
  ]);

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-400';
    if (balance < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining': return '🍽️';
      case 'Transportation': return '🚗';
      case 'Accommodation': return '🏨';
      case 'Entertainment': return '🎭'; 
      default: return '💰';
    }
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
                onClick={() => navigate(`/group/${groupId}/chat`)}
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
              {groupData.isOwner && (
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
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
                €{groupData.totalExpenses.toLocaleString()}
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
                {groupData.yourBalance > 0 ? '+' : ''}€{Math.abs(groupData.yourBalance).toFixed(2)}
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
        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/10">
            <TabsTrigger value="expenses" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Members
            </TabsTrigger>
            <TabsTrigger value="balances" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Balances
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <div className="space-y-6">
              {expenses.map((expense, index) => (
                <Card key={expense.id} className="glass-card hover-lift animate-fade-in group cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
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
                        <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">€{expense.amount.toFixed(2)}</div>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                          {expense.category}
                        </Badge>
                        <div className="text-sm text-white/40 mt-2">
                          €{(expense.amount / expense.splitAmong.length).toFixed(2)} per person
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
                          {member.isOwner && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                            {member.isOwner && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs px-2 py-1">
                                Owner
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

        {/* Add Expense Modal */}
        <AddExpenseModal 
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
          mode="group"
        />
      </div>
    </div>
  );
};

export default GroupDetails;