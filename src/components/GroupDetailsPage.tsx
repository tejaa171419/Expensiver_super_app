import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Plus,
  Settings,
  Edit2,
  UserPlus,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Calculator,
  History,
  BarChart3,
  Share,
  Copy,
  ExternalLink,
  Bell,
  Crown,
  Shield,
  LogOut,
  MoreHorizontal,
  Calendar,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number; // positive = owes money, negative = is owed money
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
  date: string;
  paidBy: string;
  participants: string[];
  status: 'completed' | 'pending' | 'disputed';
  description?: string;
}

interface GroupData {
  id: string;
  name: string;
  description: string;
  totalExpenses: number;
  totalMembers: number;
  netBalance: number;
  currency: string;
  createdAt: string;
  coverImage?: string;
  inviteCode: string;
}

interface GroupDetailsPageProps {
  group: GroupData;
  members: GroupMember[];
  recentExpenses: GroupExpense[];
  currentUserId: string;
  onAddExpense: () => void;
  onSettleBalance: () => void;
  onInviteMember: (email: string) => void;
  onEditGroup: (data: Partial<GroupData>) => void;
  onLeaveGroup: () => void;
}

const GroupDetailsPage = ({
  group,
  members,
  recentExpenses,
  currentUserId,
  onAddExpense,
  onSettleBalance,
  onInviteMember,
  onEditGroup,
  onLeaveGroup
}: GroupDetailsPageProps) => {
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [editForm, setEditForm] = useState({
    name: group.name,
    description: group.description
  });

  const currentUser = members.find(m => m.id === currentUserId);
  const isAdmin = currentUser?.isAdmin || false;

  // Calculate balances
  const totalOwed = members.reduce((sum, member) => 
    member.balance > 0 ? sum + member.balance : sum, 0
  );
  const totalOwing = members.reduce((sum, member) => 
    member.balance < 0 ? sum + Math.abs(member.balance) : sum, 0
  );

  // Get balance status
  const getBalanceStatus = (balance: number) => {
    if (balance > 0) return { text: 'owes', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    if (balance < 0) return { text: 'is owed', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    return { text: 'settled', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
  };

  // Handle invite member
  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    onInviteMember(inviteEmail);
    setInviteEmail('');
    setShowInviteMember(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  // Handle edit group
  const handleEditGroup = () => {
    if (!editForm.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    onEditGroup(editForm);
    setShowEditGroup(false);
    toast.success('Group details updated');
  };

  // Copy invite link
  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join/${group.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  // Get expense icon
  const getExpenseIcon = (expense: GroupExpense) => {
    switch (expense.status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'disputed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Receipt className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="glass-card bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-white/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white">{group.name}</h1>
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
                  </div>
                  <p className="text-white/80 mb-2">{group.description}</p>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>{group.totalMembers} members</span>
                    <span>•</span>
                    <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {/* Balance Summary */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-white/60 text-sm">Total Expenses</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(group.totalExpenses)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm">Group Balance</p>
                    <p className={`text-2xl font-bold ${
                      group.netBalance > 0 ? 'text-green-400' : 
                      group.netBalance < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {group.netBalance === 0 ? 'Settled' : formatCurrency(group.netBalance)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm">Your Balance</p>
                    <p className={`text-2xl font-bold ${
                      (currentUser?.balance || 0) > 0 ? 'text-red-400' : 
                      (currentUser?.balance || 0) < 0 ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {currentUser?.balance === 0 ? 'Settled' : formatCurrency(currentUser?.balance || 0)}
                    </p>
                    <p className="text-white/60 text-xs">
                      {currentUser?.balance ? getBalanceStatus(currentUser.balance).text : 'settled'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <Button
                onClick={onAddExpense}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button
                onClick={onSettleBalance}
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500/20"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Settle Up
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
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Members ({members.length})
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInviteMember(true)}
                    className="text-blue-400 hover:bg-blue-500/20"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {members.map(member => {
                  const balanceStatus = getBalanceStatus(member.balance);
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {member.isAdmin && (
                            <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{member.name}</p>
                            {member.id === currentUserId && (
                              <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-white/60 text-sm">{member.email}</p>
                          <p className="text-white/50 text-xs">
                            Last active: {new Date(member.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {member.balance === 0 ? (
                          <Badge className="bg-gray-500/20 text-gray-400">
                            Settled
                          </Badge>
                        ) : (
                          <div>
                            <p className={`font-semibold ${balanceStatus.color}`}>
                              {formatCurrency(member.balance)}
                            </p>
                            <p className={`text-xs ${balanceStatus.color}`}>
                              {balanceStatus.text}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentExpenses.slice(0, 5).map(expense => {
                  const payer = members.find(m => m.id === expense.paidBy);
                  
                  return (
                    <div key={expense.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="flex-shrink-0">
                        {getExpenseIcon(expense)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{expense.title}</p>
                        <p className="text-white/60 text-sm">
                          Paid by {payer?.name} • {expense.participants.length} people
                        </p>
                        <p className="text-white/50 text-xs">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {formatCurrency(expense.amount)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            expense.status === 'completed' ? 'border-green-500 text-green-400' :
                            expense.status === 'pending' ? 'border-yellow-500 text-yellow-400' :
                            'border-red-500 text-red-400'
                          }`}
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {recentExpenses.length === 0 && (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">No expenses yet</p>
                    <Button
                      onClick={onAddExpense}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Add First Expense
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Owed:</span>
                  <span className="font-medium text-red-400">{formatCurrency(totalOwed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Owing:</span>
                  <span className="font-medium text-green-400">{formatCurrency(totalOwing)}</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between">
                  <span className="text-white/70">Active Members:</span>
                  <span className="font-medium text-white">
                    {members.filter(m => m.isActive).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">This Month:</span>
                  <span className="font-medium text-white">
                    {formatCurrency(group.totalExpenses * 0.3)} {/* Mock data */}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Group Dialog */}
        <Dialog open={showEditGroup} onOpenChange={setShowEditGroup}>
          <DialogContent className="bg-black/95 border-white/20">
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
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditGroup(false)}
                  className="flex-1 border-white/30 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditGroup}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite Member Dialog */}
        <Dialog open={showInviteMember} onOpenChange={setShowInviteMember}>
          <DialogContent className="bg-black/95 border-white/20">
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
                    value={`${window.location.origin}/join/${group.inviteCode}`}
                    readOnly
                    className="bg-white/10 border-white/30 text-white flex-1"
                  />
                  <Button
                    onClick={handleCopyInviteLink}
                    variant="outline"
                    className="border-white/30 text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteMember(false)}
                  className="flex-1 border-white/30 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInviteMember}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Send Invite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="bg-black/95 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Group Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
              >
                <Share className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              
              <Separator className="bg-white/20" />
              
              <Button
                onClick={onLeaveGroup}
                variant="outline"
                className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GroupDetailsPage;