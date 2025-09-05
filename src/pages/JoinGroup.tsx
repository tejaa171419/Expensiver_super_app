import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Users, Globe, Lock, UserPlus, Star, TrendingUp, Calendar, Filter, QrCode, Share2, Copy, Check, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

interface PublicGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  totalExpenses: number;
  currency: string;
  privacy: "public" | "private";
  category: string;
  recentActivity: string;
  rating: number;
  avatar?: string;
  isPopular?: boolean;
  memberLimit?: number;
}

const JoinGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<'group' | 'personal'>('group');
  const [activeSubNav, setActiveSubNav] = useState('join-group');
  const [searchQuery, setSearchQuery] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [joinRequestDialogOpen, setJoinRequestDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PublicGroup | null>(null);

  const handleNavigation = (nav: string) => {
    if (nav === 'home') {
      navigate('/groups');
    } else if (nav === 'create-group') {
      navigate('/create-group');
    } else if (nav === 'join-group') {
      navigate('/join-group');
    } else {
      navigate('/');
    }
  };

  // Mock data with enhanced properties
  const [groups] = useState<PublicGroup[]>([
    {
      id: '1',
      name: "Weekend Adventure Club",
      description: "Join us for exciting weekend trips, outdoor activities, and shared experiences with fellow adventure enthusiasts",
      members: 15,
      totalExpenses: 3450.75,
      currency: "USD",
      privacy: "public",
      category: "Travel",
      recentActivity: "2 hours ago",
      rating: 4.8,
      isPopular: true,
      memberLimit: 20
    },
    {
      id: '2',
      name: "Downtown Foodies",
      description: "Explore the best restaurants, cafes, and food trucks in downtown. Split costs and discover amazing cuisines together",
      members: 12,
      totalExpenses: 890.25,
      currency: "USD",
      privacy: "public",
      category: "Food",
      recentActivity: "30 minutes ago",
      rating: 4.6,
      isPopular: true,
      memberLimit: 25
    },
    {
      id: '3',
      name: "Shared Living Collective",
      description: "Co-living space for creative professionals. Share utilities, groceries, and common area expenses",
      members: 8,
      totalExpenses: 2100.75,
      currency: "USD",
      privacy: "private",
      category: "Living",
      recentActivity: "1 day ago",
      rating: 4.9,
      memberLimit: 10
    },
    {
      id: '4',
      name: "Tech Meetup Society",
      description: "Monthly tech events, workshops, and networking. Share venue costs, refreshments, and speaker fees",
      members: 45,
      totalExpenses: 1250.50,
      currency: "USD",
      privacy: "public",
      category: "Work",
      recentActivity: "3 hours ago",
      rating: 4.7,
      isPopular: true,
      memberLimit: 50
    },
    {
      id: '5',
      name: "Fitness Buddy Network",
      description: "Group fitness activities, gym memberships, and wellness workshops. Stay healthy together!",
      members: 22,
      totalExpenses: 675.00,
      currency: "USD",
      privacy: "public",
      category: "Health",
      recentActivity: "5 hours ago",
      rating: 4.5
    }
  ]);

  const categories = ["all", "Travel", "Food", "Living", "Work", "Health", "Entertainment", "Sports"];

  const filteredGroups = groups
    .filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || group.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating;
        case "members":
          return b.members - a.members;
        case "recent":
          return new Date(b.recentActivity).getTime() - new Date(a.recentActivity).getTime();
        case "expenses":
          return b.totalExpenses - a.totalExpenses;
        default:
          return 0;
      }
    });

  const handleJoinByCode = () => {
    if (!joinCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid join code",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `Successfully joined group with code ${joinCode}`
      });
      setJoinCode("");
      navigate('/groups');
    }, 1000);
  };

  const handleJoinGroup = (group: PublicGroup) => {
    if (group.privacy === "public") {
      toast({
        title: "Joining Group...",
        description: `Adding you to "${group.name}"`
      });
      
      setTimeout(() => {
        toast({
          title: "Success!",
          description: `Welcome to "${group.name}"!`
        });
        navigate('/groups');
      }, 1500);
    } else {
      setSelectedGroup(group);
      setJoinRequestDialogOpen(true);
    }
  };

  const handleJoinRequest = () => {
    toast({
      title: "Request Sent",
      description: `Your request to join "${selectedGroup?.name}" has been sent to the group admin`
    });
    setJoinRequestDialogOpen(false);
    setSelectedGroup(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCodeCopied(true);
    setTimeout(() => setIsCodeCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Join code copied to clipboard"
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Travel': return '✈️';
      case 'Food': return '🍽️';
      case 'Living': return '🏠';
      case 'Work': return '💼';
      case 'Health': return '💪';
      case 'Entertainment': return '🎭';
      case 'Sports': return '⚽';
      default: return '👥';
    }
  };

  const getPopularityBadge = (group: PublicGroup) => {
    if (group.isPopular) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse-subtle">
          <Star className="w-3 h-3 mr-1" />
          Popular
        </Badge>
      );
    }
    return null;
  };

  return (
    <Layout
      activeMode={activeMode}
      onModeChange={setActiveMode}
      activeSubNav={activeSubNav}
      onSubNavChange={handleNavigation}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <UserPlus className="w-5 h-5 mr-2 text-primary" />
            <span className="text-white/80 text-sm font-medium">Join Groups</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-cyber mb-4">
            Discover & Join Groups
          </h1>
          
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Find existing expense groups or join with an invitation code to start sharing costs with others
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="glass-card text-center p-4">
            <div className="flex flex-col items-center space-y-2">
              <Globe className="w-6 h-6 text-primary" />
              <div className="text-2xl font-bold text-white">{groups.filter(g => g.privacy === 'public').length}</div>
              <div className="text-sm text-white/60">Public Groups</div>
            </div>
          </Card>
          <Card className="glass-card text-center p-4">
            <div className="flex flex-col items-center space-y-2">
              <Star className="w-6 h-6 text-warning" />
              <div className="text-2xl font-bold text-white">{groups.filter(g => g.isPopular).length}</div>
              <div className="text-sm text-white/60">Popular</div>
            </div>
          </Card>
          <Card className="glass-card text-center p-4">
            <div className="flex flex-col items-center space-y-2">
              <Users className="w-6 h-6 text-success" />
              <div className="text-2xl font-bold text-white">{groups.reduce((sum, g) => sum + g.members, 0)}</div>
              <div className="text-sm text-white/60">Total Members</div>
            </div>
          </Card>
          <Card className="glass-card text-center p-4">
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="w-6 h-6 text-accent" />
              <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
              <div className="text-sm text-white/60">Categories</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Join by Code */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Join by Code
                </CardTitle>
                <CardDescription>Enter an invitation code from a group admin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="join-code" className="text-white font-medium">Invitation Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="join-code" 
                      placeholder="e.g., GRP-ABC123" 
                      value={joinCode} 
                      onChange={e => setJoinCode(e.target.value.toUpperCase())} 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 font-mono" 
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("GRP-DEMO123")}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {isCodeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-white/40">Try: GRP-DEMO123</p>
                </div>
                <Button 
                  onClick={handleJoinByCode} 
                  className="w-full bg-gradient-primary hover:bg-primary text-white hover:shadow-glow transition-all duration-300"
                  disabled={!joinCode.trim()}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Group
                </Button>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center gap-2">
                            <span>{cat !== "all" ? getCategoryIcon(cat) : "🔍"}</span>
                            {cat === "all" ? "All Categories" : cat}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="members">Most Members</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                      <SelectItem value="expenses">Highest Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary text-sm">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                <p>• Popular groups have active members and regular expenses</p>
                <p>• Check member limits before joining</p>
                <p>• Private groups require admin approval</p>
                <p>• Join groups that match your interests and location</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search groups by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <Badge variant="outline" className="border-primary text-primary bg-primary/10 px-4 py-2 text-center">
                {filteredGroups.length} Groups Found
              </Badge>
            </div>

            {/* Groups Grid */}
            {filteredGroups.length > 0 ? (
              <div className="grid gap-6">
                {filteredGroups.map((group, index) => (
                  <Card 
                    key={group.id} 
                    className="glass-card hover:shadow-glow transition-all duration-500 hover-lift animate-slide-in-up group cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                            <AvatarImage src={group.avatar} />
                            <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                              {group.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2 text-2xl">
                            {getCategoryIcon(group.category)}
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                                  {group.name}
                                </h3>
                                {group.privacy === "private" ? (
                                  <Lock className="w-4 h-4 text-white/40" />
                                ) : (
                                  <Globe className="w-4 h-4 text-primary" />
                                )}
                                {getPopularityBadge(group)}
                              </div>
                              <p className="text-white/70 leading-relaxed">{group.description}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="border-primary/30 text-primary bg-primary/10"
                            >
                              {group.category}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Users className="w-4 h-4 text-primary" />
                              <span>{group.members}{group.memberLimit ? `/${group.memberLimit}` : ''} members</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <TrendingUp className="w-4 h-4 text-success" />
                              <span>{group.currency} {group.totalExpenses.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Calendar className="w-4 h-4 text-warning" />
                              <span>{group.recentActivity}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Star className="w-4 h-4 text-accent" />
                              <span>{group.rating} rating</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={group.privacy === "public" ? "default" : "secondary"}
                                className={group.privacy === "public" ? "bg-success text-white" : "bg-warning/20 text-warning"}
                              >
                                {group.privacy === "public" ? "Public - Instant Join" : "Private - Approval Required"}
                              </Badge>
                              {group.memberLimit && group.members >= group.memberLimit * 0.9 && (
                                <Badge variant="outline" className="border-warning text-warning">
                                  Almost Full
                                </Badge>
                              )}
                            </div>
                            <Button 
                              onClick={() => handleJoinGroup(group)}
                              className={group.privacy === "public" 
                                ? "bg-gradient-primary hover:bg-primary text-white hover:shadow-glow transition-all duration-300" 
                                : "bg-warning hover:bg-warning/80 text-white hover:shadow-glow transition-all duration-300"
                              }
                              disabled={group.memberLimit ? group.members >= group.memberLimit : false}
                            >
                              {group.memberLimit && group.members >= group.memberLimit 
                                ? "Full" 
                                : group.privacy === "public" 
                                  ? "Join Now" 
                                  : "Request to Join"
                              }
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-16 text-center">
                  <Search className="w-16 h-16 text-white/40 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">No Groups Found</h3>
                  <p className="text-white/60 mb-8 max-w-md mx-auto text-lg">
                    Try adjusting your search terms or filters, or ask for an invitation code from a friend
                  </p>
                  <Button 
                    onClick={() => navigate('/create-group')}
                    className="bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your Own Group
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Join Request Dialog */}
        <Dialog open={joinRequestDialogOpen} onOpenChange={setJoinRequestDialogOpen}>
          <DialogContent className="glass-card max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gradient-cyber">Request to Join</DialogTitle>
              <DialogDescription className="text-white/70">
                This is a private group. Send a request to the group admin.
              </DialogDescription>
            </DialogHeader>
            
            {selectedGroup && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-primary text-white font-bold">
                      {selectedGroup.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-white">{selectedGroup.name}</h4>
                    <p className="text-sm text-white/60">{selectedGroup.members} members • {selectedGroup.category}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Message (Optional)</Label>
                  <textarea 
                    placeholder="Tell the admin why you'd like to join..."
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setJoinRequestDialogOpen(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleJoinRequest}
                    className="flex-1 bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                  >
                    Send Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default JoinGroup;