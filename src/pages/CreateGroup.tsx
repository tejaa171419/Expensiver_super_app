import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Sparkles } from "lucide-react";
import GroupDetailForm from "@/components/GroupDetailForm";
import { useToast } from "@/hooks/use-toast";

const CreateGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async (groupData: any) => {
    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would make an API call to create the group
      console.log('Creating group:', groupData);
      
      toast({
        title: "Group Created!",
        description: `"${groupData.name}" has been created successfully.`
      });
      
      // Navigate back to groups page to show the newly created group
      navigate('/', { state: { activeSubNav: 'groups', showSuccess: true, newGroupName: groupData.name } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-cyber animate-fade-in">
                Create New Group
              </h1>
              <p className="text-white/70 mt-2 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                Set up a new expense sharing group for your team, family, or friends
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="glass-card hover-lift animate-slide-up">
              <CardContent className="p-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Advanced Invitations</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple ways to invite: email, contacts, and link sharing with instant notifications
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Professional Workflows</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive form validation, progress tracking, and stable components
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
                  <ArrowLeft className="w-6 h-6 text-primary transform rotate-180" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Easy Settlement</h3>
                <p className="text-sm text-muted-foreground">
                  Simple payment suggestions to settle all group balances
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Form */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <GroupDetailForm
            onSave={handleCreateGroup}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;