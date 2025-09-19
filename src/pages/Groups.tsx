import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Calendar, DollarSign, Settings, Eye, TrendingUp, UserPlus, Upload, Globe, Lock, Trash2, Search, Filter, SortAsc, Receipt, MessageSquare, Mail, Phone, Send, Copy, Share2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isRegistered: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  currency: string;
  totalExpenses: number;
  memberCount: number;
  yourBalance: number;
  createdAt: string;
  isOwner: boolean;
  status: 'active' | 'settled' | 'inactive';
  recentActivity: string;
  category: string;
}

const Groups = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Create Group Form State
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [currency, setCurrency] = useState("USD");
  
  // Enhanced invitation state
  const [inviteTab, setInviteTab] = useState('email');
  const [emailList, setEmailList] = useState('');
  const [phoneList, setPhoneList] = useState('');
  const [inviteMessage, setInviteMessage] = useState('Hi! I\'d like to invite you to join our expense group. We can easily split and track shared expenses together.');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactSearch, setContactSearch] = useState('');
  
  // Mock contact data
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@company.com',
      phone: '+1 234 567 8901',
      isRegistered: true
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@company.com', 
      phone: '+1 234 567 8902',
      isRegistered: true
    },
    {
      id: '3',
      name: 'Carol Wilson',
      email: 'carol@gmail.com',
      phone: '+1 234 567 8903',
      isRegistered: false
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david@yahoo.com',
      phone: '+1 234 567 8904',
      isRegistered: false
    }
  ]);
  
  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  // Create Group Functions
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const getInviteCount = () => {
    const emails = emailList.split(/[,\n]/).filter(email => email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())).length;
    const phones = phoneList.split(/[,\n]/).filter(phone => phone.trim() && /^[+]?[1-9]\d{1,14}$/.test(phone.replace(/[\s\-()]/g, ''))).length;
    return emails + phones + selectedContacts.length;
  };

  const handleCreateGroup = () => {
    // Enhanced validation
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive"
      });
      return;
    }

    if (groupName.trim().length < 3) {
      toast({
        title: "Error",
        description: "Group name must be at least 3 characters long",
        variant: "destructive"
      });
      return;
    }

    if (groupName.trim().length > 50) {
      toast({
        title: "Error", 
        description: "Group name must be less than 50 characters",
        variant: "destructive"
      });
      return;
    }

    const inviteCount = getInviteCount();

    // Add new group to the list with enhanced properties
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: groupName.trim(),
      description: description.trim() || "No description provided",
      currency,
      totalExpenses: 0,
      memberCount: inviteCount + 1, // +1 for the creator
      yourBalance: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isOwner: true,
      status: 'active',
      recentActivity: 'Just created',
      category: 'Other'
    };

    setGroups(prev => [newGroup, ...prev]);

    const memberInvites = inviteCount > 0 
      ? ` and sent ${inviteCount} invitation${inviteCount > 1 ? 's' : ''}` 
      : '';

    toast({
      title: "Success! 🎉",
      description: `Group "${groupName.trim()}" created successfully${memberInvites}`
    });

    // Reset form and close dialog
    setGroupName("");
    setDescription("");
    setEmailList('');
    setPhoneList('');
    setSelectedContacts([]);
    setIsCreateDialogOpen(false);
  };
  
  // Mock data - replace with actual data from backend
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Office Team',
      description: 'Lunch and office expenses',
      currency: 'INR',
      totalExpenses: 12500,
      memberCount: 8,
      yourBalance: 2400,
      createdAt: '2024-01-15',
      isOwner: true,
      status: 'active',
      recentActivity: '2 hours ago',
      category: 'Work'
    },
    {
      id: '2', 
      name: 'Friends',
      description: 'Weekend trips and hangouts',
      currency: 'INR',
      totalExpenses: 8900,
      memberCount: 5,
      yourBalance: -850,
      createdAt: '2024-02-01',
      isOwner: false,
      status: 'active',
      recentActivity: '1 day ago',
      category: 'Social'
    },
    {
      id: '3',
      name: 'Family',
      description: 'House and family expenses',
      currency: 'INR', 
      totalExpenses: 25600,
      memberCount: 4,
      yourBalance: 1200,
      createdAt: '2024-01-20',
      isOwner: false,
      status: 'active',
      recentActivity: '5 hours ago',
      category: 'Family'
    },
    {
      id: '4',
      name: 'Travel Squad',
      description: 'Goa trip planning',
      currency: 'INR',
      totalExpenses: 45000,
      memberCount: 6,
      yourBalance: 0,
      createdAt: '2024-03-01',
      isOwner: true,
      status: 'settled',
      recentActivity: '1 week ago',
      category: 'Travel'
    }
  ]);

  // Filter and search logic
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || group.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'settled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'inactive': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Travel': return 'bg-purple-500/20 text-purple-400';
      case 'Living': return 'bg-green-500/20 text-green-400';
      case 'Work': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-success';
    if (balance < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-6 animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <Users className="w-5 h-5 mr-2 text-primary" />
          <span className="text-white/80 text-sm font-medium">Group Management</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-cyber mb-4">
          Groups
        </h1>
        
        <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
          Manage your group expenses and shared finances
        </p>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className={filterStatus === 'all' ? 'bg-primary text-white' : 'border-white/20 text-white hover:bg-white/10'}
            >
              All Groups
            </Button>
            <Button 
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('active')}
              className={filterStatus === 'active' ? 'bg-success text-white' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Active
            </Button>
            <Button 
              variant={filterStatus === 'settled' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setFilterStatus('settled')}
              className={filterStatus === 'settled' ? 'bg-blue-500 text-white' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Settled
            </Button>
          </div>
        </div>

        {/* Create Group Button */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="group relative overflow-hidden px-6 py-3 bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 hover-lift flex-1 sm:flex-none"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gradient-cyber">Create New Group</DialogTitle>
              <DialogDescription className="text-white/70">
                Set up a new group to manage shared expenses with friends, family, or colleagues
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              {/* Group Avatar and Basic Info */}
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 border-4 border-primary/20">
                  <AvatarImage className="bg-gradient-primary" />
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {groupName.charAt(0).toUpperCase() || "G"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name" className="text-white font-medium">Group Name *</Label>
                    <Input 
                      id="group-name" 
                      placeholder="e.g., Vacation Trip 2024" 
                      value={groupName} 
                      onChange={e => setGroupName(e.target.value)} 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white font-medium">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Tell members what this group is for..." 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      rows={3} 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Privacy & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Privacy</Label>
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Private
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Public
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enhanced Member Invites */}
              <div className="space-y-4">
                <Label className="text-white font-medium">Invite Members (Optional)</Label>
                
                <Tabs value={inviteTab} onValueChange={setInviteTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10">
                    <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Email & SMS
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Contacts
                    </TabsTrigger>
                    <TabsTrigger value="share" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Link
                    </TabsTrigger>
                  </TabsList>

                  {/* Email & SMS Tab */}
                  <TabsContent value="email" className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Email Addresses</Label>
                        <Textarea
                          value={emailList}
                          onChange={(e) => setEmailList(e.target.value)}
                          placeholder="Enter email addresses separated by commas or new lines...&#10;&#10;Example:&#10;john@example.com&#10;sarah@company.com, mike@startup.io"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Phone Numbers</Label>
                        <Textarea
                          value={phoneList}
                          onChange={(e) => setPhoneList(e.target.value)}
                          placeholder="Enter phone numbers separated by commas...&#10;&#10;Example:&#10;+1 234 567 8900&#10;+44 20 7946 0958"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Invitation Message</Label>
                        <Textarea
                          value={inviteMessage}
                          onChange={(e) => setInviteMessage(e.target.value)}
                          className="bg-white/10 border-white/20 text-white min-h-[60px]"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Contacts Tab */}
                  <TabsContent value="contacts" className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          placeholder="Search contacts..."
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      
                      {selectedContacts.length > 0 && (
                        <div className="bg-primary/20 border border-primary/30 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-medium">{selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedContacts([])}
                              className="text-white/60 hover:text-white"
                            >
                              Clear all
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2 max-h-[200px] overflow-y-auto border border-white/20 rounded-lg p-2">
                        {filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedContacts.includes(contact.id)
                                ? 'bg-primary/20 border-primary'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => toggleContactSelection(contact.id)}
                          >
                            <div className="flex-shrink-0">
                              {selectedContacts.includes(contact.id) ? (
                                <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-white/30 rounded" />
                              )}
                            </div>
                            
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback className="bg-primary/20 text-white">
                                {contact.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white truncate">{contact.name}</span>
                                <Badge className={contact.isRegistered ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}>
                                  {contact.isRegistered ? 'Registered' : 'New'}
                                </Badge>
                              </div>
                              <div className="text-sm text-white/60 truncate">{contact.email}</div>
                              {contact.phone && (
                                <div className="text-xs text-white/40">{contact.phone}</div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {filteredContacts.length === 0 && (
                          <div className="text-center py-6 text-white/60">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No contacts found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Share Link Tab */}
                  <TabsContent value="share" className="space-y-4">
                    <div className="text-center space-y-4">
                      <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm font-mono text-white/70 mb-3">
                          <Globe className="w-4 h-4" />
                          <span>https://zenithwallet.app/join/new-group</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                            onClick={() => {
                              navigator.clipboard.writeText('https://zenithwallet.app/join/new-group');
                              toast({ title: "Link Copied!", description: "Invitation link copied to clipboard" });
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-primary text-white"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: `Join ${groupName || 'our group'}`,
                                  text: `Join our expense group "${groupName || 'New Group'}"!`,
                                  url: 'https://zenithwallet.app/join/new-group'
                                });
                              }
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-white/60">
                        Share this link with anyone you want to invite to the group
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {getInviteCount() > 0 && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <div className="text-primary font-medium text-sm">
                      🎉 {getInviteCount()} invitation{getInviteCount() > 1 ? 's' : ''} ready to send!
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateGroup}
                  className="flex-1 bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                >
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full text-center py-16 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
              <Users className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white/60">No groups found</h3>
            <p className="text-white/40 max-w-md mx-auto">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Create your first group to start tracking shared expenses'
              }
            </p>
          </div>
        ) : (
          filteredGroups.map((group, index) => (
            <Card 
              key={group.id} 
              className="glass-card hover-lift group cursor-pointer animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/group/${group.id}`)}
            >
              <CardContent className="p-6 relative">
                {/* Header with Avatar and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-300 shadow-lg">
                        <AvatarImage src={group.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-white font-bold text-xl">
                          {group.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Status indicator */}
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                        group.status === 'active' ? 'bg-success animate-pulse-glow' : 
                        group.status === 'settled' ? 'bg-blue-500' : 'bg-muted'
                      }`}>
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 truncate">
                          {group.name}
                        </h3>
                        <Badge className={`${getStatusColor(group.status)} text-xs px-2 py-1`}>
                          {group.status}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                        {group.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Member and Time Info */}
                <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                    <div className="flex -space-x-1">
                      {[...Array(Math.min(3, group.memberCount))].map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-primary/20 border border-white/20 rounded-full" />
                      ))}
                      {group.memberCount > 3 && (
                        <div className="w-5 h-5 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-xs text-white/60">
                          +{group.memberCount - 3}
                        </div>
                      )}
                    </div>
                    <span className="ml-2">{group.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Calendar className="w-3 h-3" />
                    <span>{group.recentActivity}</span>
                  </div>
                </div>

                {/* Balance and Expenses */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="text-xs text-white/40 uppercase tracking-wide font-medium">Your Balance</div>
                    <div className={`text-2xl font-bold ${getBalanceColor(group.yourBalance)} group-hover:scale-110 transition-transform duration-300`}>
                      {group.yourBalance >= 0 ? '+' : ''}₹{Math.abs(group.yourBalance).toFixed(2)}
                    </div>
                    <div className="text-xs text-white/40">
                      {group.yourBalance > 0 ? 'gets back' : group.yourBalance < 0 ? 'owes' : 'settled'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-white/40 uppercase tracking-wide font-medium">Total Expenses</div>
                    <div className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                      ₹{group.totalExpenses.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/40">
                      3 expenses
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-white/40 uppercase tracking-wide font-medium">Recent Activity</div>
                  <div className="flex items-center gap-2 text-sm text-white/70 bg-white/5 px-3 py-2 rounded-lg">
                    <span className="text-base">
                      {group.recentActivity === 'Just created' ? '🎉' : 
                       group.recentActivity.includes('hours') ? '💰' :
                       group.recentActivity.includes('day') ? '✅' : 
                       '📊'}
                    </span>
                    <span>
                      {group.recentActivity === 'Just created' ? 'Group created' : 
                       group.recentActivity.includes('hours') ? group.name === 'Office Team' ? 'Lunch at Italian restaurant' : 'New expense added' :
                       group.recentActivity.includes('day') ? 'Movie tickets' : 
                       'Hotel booking'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-white/60 hover:text-white hover:bg-white/10 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                    onClick={(e) => { e.stopPropagation(); navigate(`/group/${group.id}/chat`); }}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    <span className="text-xs">Chat</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-white/60 hover:text-white hover:bg-white/10 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate(`/group/${group.id}`, { state: { activeTab: 'balances' } });
                    }}
                  >
                    <DollarSign className="w-3 h-3 mr-1" />
                    <span className="text-xs">Balances</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-white/60 hover:text-white hover:bg-white/10 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate(`/group/${group.id}`, { state: { activeTab: 'expenses' } });
                    }}
                  >
                    <Receipt className="w-3 h-3 mr-1" />
                    <span className="text-xs">Expenses</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/60 hover:text-white hover:bg-white/10 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (group.isOwner) {
                        navigate(`/group/${group.id}`, { state: { activeTab: 'settings' } });
                      } else {
                        toast({
                          title: "Access Restricted",
                          description: "Only group owners can access settings",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Groups;