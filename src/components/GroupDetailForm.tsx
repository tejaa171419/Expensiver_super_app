import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Save, 
  Edit3, 
  Users, 
  Mail, 
  Phone, 
  UserPlus, 
  Upload, 
  Camera, 
  Globe, 
  Lock, 
  Eye, 
  Settings,
  Calendar,
  DollarSign,
  Check,
  X,
  Copy,
  Share2,
  Send,
  Crown,
  MessageSquare,
  QrCode,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import InviteMembersModal from "@/components/InviteMembersModal";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  balance: number;
  isOwner: boolean;
  joinedAt: string;
  status: 'active' | 'pending' | 'invited';
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isRegistered: boolean;
}

interface GroupDetailFormProps {
  groupId?: string;
  initialData?: {
    name: string;
    description: string;
    currency: string;
    visibility: 'public' | 'private';
    members: GroupMember[];
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

const GroupDetailForm = ({ groupId, initialData, onSave, onCancel }: GroupDetailFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    currency: initialData?.currency || 'USD',
    visibility: initialData?.visibility || 'private' as 'public' | 'private',
    allowMemberInvites: true,
    autoSettlement: false,
    notificationEmails: true
  });

  // Member management state
  const [members, setMembers] = useState<GroupMember[]>(initialData?.members || []);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(0);

  // Mock contact list - in real app, this would come from contacts API
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
    },
    {
      id: '5',
      name: 'Emma Davis',
      email: 'emma@company.com',
      phone: '+1 234 567 8905',
      isRegistered: true
    }
  ]);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
  ];

  // Form validation and progress tracking
  const getFormProgress = () => {
    let progress = 0;
    if (formData.name.trim().length >= 3) progress += 30;
    if (formData.description.trim().length >= 10) progress += 20;
    if (formData.currency) progress += 10;
    if (members.length > 0) progress += 30;
    if (formData.visibility) progress += 10;
    return progress;
  };

  const isFormValid = () => {
    return formData.name.trim().length >= 3 && formData.description.trim().length >= 10;
  };

  // Update progress when form data changes
  useEffect(() => {
    setFormProgress(getFormProgress());
  }, [formData, members]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const groupData = {
        ...formData,
        members,
        avatar: groupAvatar,
        id: groupId || Math.random().toString(36).substr(2, 9)
      };
      
      await onSave(groupData);
      
      toast({
        title: "Success",
        description: groupId ? "Group updated successfully" : "Group created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save group details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle invitations from the modal
  const handleInviteSent = (invites: any[]) => {
    const newMembers = invites.map(invite => ({
      id: Math.random().toString(36).substr(2, 9),
      name: invite.contactName || invite.recipient.split('@')[0],
      email: invite.recipient,
      phone: invite.phone,
      balance: 0,
      isOwner: false,
      joinedAt: new Date().toISOString(),
      status: (invite.isRegistered !== undefined ? 
        (invite.isRegistered ? 'invited' : 'pending') : 
        'invited') as 'active' | 'pending' | 'invited'
    }));

    setMembers(prev => [...prev, ...newMembers]);
  };

  // Remove member
  const removeMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
    toast({
      title: "Member Removed",
      description: "Member has been removed from the group"
    });
  };

  // Generate group link
  const generateGroupLink = () => {
    const groupLink = `https://zenithwallet.app/join/${groupId || 'new'}`;
    navigator.clipboard.writeText(groupLink);
    toast({
      title: "Link Copied! 🔗",
      description: "Group invitation link copied to clipboard"
    });
  };

  // Get member status icon and color
  const getMemberStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
      case 'pending':
        return { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
      case 'invited':
        return { icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
      default:
        return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {groupId ? 'Edit Group' : 'Create New Group'}
          </h2>
          <p className="text-muted-foreground mt-2">
            {groupId ? 'Update group settings and manage members' : 'Set up your expense sharing group'}
          </p>
          
          {/* Form Progress */}
          {!groupId && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Form Progress</span>
                <span className="text-muted-foreground">{formProgress}% complete</span>
              </div>
              <Progress value={formProgress} className="h-2" />
              {formProgress < 100 && (
                <div className="text-xs text-muted-foreground">
                  {!formData.name || formData.name.trim().length < 3 ? '• Group name required (3+ characters)' : ''}
                  {(!formData.description || formData.description.trim().length < 10) ? '• Description required (10+ characters)' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Form */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/60 backdrop-blur-lg border border-border/50">
          <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="w-4 h-4 mr-2" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Group Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                Group Information
              </CardTitle>
              <CardDescription>
                Basic details about your expense sharing group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Group Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <Avatar className="w-20 h-20 border-4 border-primary/30 group-hover:border-primary/60 transition-all duration-300">
                    <AvatarImage src={groupAvatar || undefined} />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                      {formData.name.charAt(0).toUpperCase() || 'G'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Group Photo</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Camera
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Group Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Office Team, Family Trip, Weekend Getaway"
                  className={cn(
                    "bg-background/50 border-border/50 backdrop-blur-sm",
                    formData.name.length < 3 && formData.name.length > 0 && "border-destructive"
                  )}
                />
                {formData.name.length < 3 && formData.name.length > 0 && (
                  <p className="text-sm text-destructive">Name must be at least 3 characters long</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What is this group for? e.g., Sharing office lunch expenses, Family vacation costs, etc."
                  className={cn(
                    "bg-background/50 border-border/50 backdrop-blur-sm min-h-[100px]",
                    formData.description.length < 10 && formData.description.length > 0 && "border-destructive"
                  )}
                />
                <div className="flex justify-between text-sm">
                  {formData.description.length < 10 && formData.description.length > 0 ? (
                    <p className="text-destructive">Description must be at least 10 characters long</p>
                  ) : (
                    <span className="text-muted-foreground">Describe the purpose of this group</span>
                  )}
                  <span className="text-muted-foreground">{formData.description.length}/500</span>
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label className="text-foreground">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger className="bg-background/50 border-border/50 backdrop-blur-sm">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{currency.symbol}</span>
                          <span>{currency.name}</span>
                          <span className="text-muted-foreground">({currency.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label className="text-foreground">Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value: 'public' | 'private') => setFormData(prev => ({ ...prev, visibility: value }))}>
                  <SelectTrigger className="bg-background/50 border-border/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <div>
                          <div>Private</div>
                          <div className="text-xs text-muted-foreground">Only invited members can join</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <div>
                          <div>Public</div>
                          <div className="text-xs text-muted-foreground">Anyone with the link can join</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Group Members
                  </CardTitle>
                  <CardDescription>
                    Manage who can participate in this group
                  </CardDescription>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setInviteModalOpen(true)}
                    className="bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Share Link */}
              <div className="p-4 bg-card/30 rounded-lg border border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Group Invitation Link</h4>
                    <p className="text-sm text-muted-foreground">Share this link to invite people instantly</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={generateGroupLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-card/30 rounded-lg border border-border/30 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{member.name}</span>
                          {member.isOwner && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                              Owner
                            </Badge>
                          )}
                          <Badge 
                            variant={member.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {member.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                        {member.phone && (
                          <div className="text-xs text-muted-foreground">{member.phone}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {member.balance >= 0 ? '+' : ''}${Math.abs(member.balance).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.balance > 0 ? 'gets back' : member.balance < 0 ? 'owes' : 'settled'}
                        </div>
                      </div>
                      
                      {!member.isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No members yet. Start by inviting people to your group!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Group Settings
              </CardTitle>
              <CardDescription>
                Configure how your group operates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-foreground">Allow members to invite others</Label>
                    <p className="text-sm text-muted-foreground">Let group members send invitations</p>
                  </div>
                  <Switch
                    checked={formData.allowMemberInvites}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowMemberInvites: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-foreground">Auto-settlement</Label>
                    <p className="text-sm text-muted-foreground">Automatically settle small balances</p>
                  </div>
                  <Switch
                    checked={formData.autoSettlement}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoSettlement: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-foreground">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email updates for group activity</p>
                  </div>
                  <Switch
                    checked={formData.notificationEmails}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notificationEmails: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons at Bottom */}
      <div className="flex gap-3 pt-6 border-t border-border/50">
        <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1 sm:flex-none">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!isFormValid() || isLoading}
          className="bg-gradient-primary hover:shadow-glow text-primary-foreground flex-1 sm:flex-none"
          title={!isFormValid() ? "Please fill in group name (3+ characters) and description (10+ characters)" : ""}
        >
          {isLoading ? 'Saving...' : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {groupId ? 'Update Group' : 'Create Group'}
            </>
          )}
        </Button>
      </div>

      {/* Enhanced Invite Members Modal */}
      <InviteMembersModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        groupName={formData.name || 'New Group'}
        groupId={groupId || 'new'}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
};

export default GroupDetailForm;