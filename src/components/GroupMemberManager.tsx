import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Settings, Crown, Mail, Calendar, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  isOwner: boolean;
  joinedAt: string;
  status: 'active' | 'pending' | 'inactive';
}

interface GroupMemberManagerProps {
  members: GroupMember[];
  isOwner: boolean;
  onInviteMember: (email: string) => void;
  onRemoveMember: (memberId: string) => void;
  onTransferOwnership: (memberId: string) => void;
}

const GroupMemberManager = ({ 
  members, 
  isOwner, 
  onInviteMember, 
  onRemoveMember, 
  onTransferOwnership 
}: GroupMemberManagerProps) => {
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    onInviteMember(inviteEmail.trim());
    setInviteEmail("");
    setIsInviteDialogOpen(false);
    
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${inviteEmail.trim()}`
    });
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-success';
    if (balance < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-muted/20 text-muted-foreground border-muted/30">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Invite Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Group Members</h3>
          <p className="text-white/60">{members.length} members total</p>
        </div>
        
        {isOwner && (
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle className="text-gradient-cyber">Invite New Member</DialogTitle>
                <DialogDescription className="text-white/70">
                  Send an invitation to join this group
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white font-medium">Email Address</label>
                  <Input
                    placeholder="member@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsInviteDialogOpen(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleInvite}
                    className="flex-1 bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                  >
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member, index) => (
          <Card 
            key={member.id} 
            className="glass-card hover-lift animate-fade-in group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-white/20 group-hover:border-primary/40 transition-all duration-300">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gradient-primary text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {member.isOwner && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {member.name}
                      </h4>
                      {getStatusBadge(member.status)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className={`text-lg font-bold ${getBalanceColor(member.balance)} group-hover:scale-110 transition-transform duration-300`}>
                    {member.balance >= 0 ? '+' : ''}€{Math.abs(member.balance).toFixed(2)}
                  </div>
                  
                  <div className="text-xs text-white/40">
                    {member.balance > 0 ? 'gets back' : member.balance < 0 ? 'owes' : 'settled'}
                  </div>
                  
                  {isOwner && !member.isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Statistics */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-primary">Member Statistics</CardTitle>
          <CardDescription>Overview of group membership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-success">
                {members.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-white/60">Active</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-warning">
                {members.filter(m => m.status === 'pending').length}
              </div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {members.filter(m => m.balance > 0).length}
              </div>
              <div className="text-sm text-white/60">Owed Money</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-destructive">
                {members.filter(m => m.balance < 0).length}
              </div>
              <div className="text-sm text-white/60">Owe Money</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupMemberManager;