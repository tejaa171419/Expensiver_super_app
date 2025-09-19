import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key, Smartphone, AlertTriangle, CheckCircle, Eye, EyeOff, Download, Trash2, Settings, Monitor, Sidebar, Layout, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useNavigation } from "@/contexts/NavigationContext";
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase, one uppercase, and one number"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
const pinSchema = z.object({
  pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits").regex(/^\d{4}$/, "PIN must contain only numbers"),
  confirmPin: z.string()
}).refine(data => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"]
});
type PasswordFormData = z.infer<typeof passwordSchema>;
type PinFormData = z.infer<typeof pinSchema>;
interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  pinEnabled: boolean;
  sessionTimeout: boolean;
  loginNotifications: boolean;
  deviceTracking: boolean;
}
interface LoginSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}
const SecuritySettings = () => {
  const { navigationStyle, navigationPreferences, updateNavigationPreference, toggleNavigationStyle } = useNavigation();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    biometricEnabled: false,
    pinEnabled: true,
    sessionTimeout: true,
    loginNotifications: true,
    deviceTracking: true
  });
  const [loginSessions] = useState<LoginSession[]>([{
    id: "1",
    device: "Chrome on Windows",
    location: "Mumbai, India",
    lastActive: "Current session",
    isCurrent: true
  }, {
    id: "2",
    device: "Mobile App on iOS",
    location: "Mumbai, India",
    lastActive: "2 hours ago",
    isCurrent: false
  }]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  const pinForm = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
      confirmPin: ""
    }
  });
  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Password change:", data);
    toast.success("Password updated successfully!");
    passwordForm.reset();
  };
  const onPinSubmit = (data: PinFormData) => {
    console.log("PIN setup:", data);
    setSecuritySettings(prev => ({
      ...prev,
      pinEnabled: true
    }));
    toast.success("PIN set up successfully!");
    pinForm.reset();
  };
  const toggleSetting = (setting: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success("Security setting updated!");
  };
  const enable2FA = () => {
    // In a real app, this would show QR code for authenticator setup
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorEnabled: true
    }));
    toast.success("Two-factor authentication enabled!");
  };
  const downloadBackupCodes = () => {
    // Generate and download backup codes
    const codes = Array.from({
      length: 10
    }, () => Math.random().toString(36).substring(2, 8).toUpperCase());
    const blob = new Blob([codes.join('\n')], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded!");
  };
  const terminateSession = (sessionId: string) => {
    toast.success("Session terminated successfully!");
  };
  const terminateAllSessions = () => {
    toast.success("All other sessions terminated!");
  };
  return <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader className="bg-card/90 backdrop-blur-lg">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Shield className="w-5 h-5" />
            Security & Navigation Settings
          </CardTitle>
          <CardDescription>
            Manage your account security, authentication methods, and navigation preferences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Navigation Preferences Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Layout className="w-5 h-5" />
            Navigation Preferences
          </CardTitle>
          <CardDescription>
            Customize your navigation experience with horizontal navbar or vertical sidebar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Navigation Style Toggle */}
            <div className="p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-card-foreground flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Current Navigation Style
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {navigationStyle === 'horizontal' ? 'Traditional horizontal navbar with sub-navigation' : 'Modern vertical sidebar with collapsible sections'}
                  </p>
                </div>
                <Button
                  onClick={toggleNavigationStyle}
                  variant="outline"
                  size="sm"
                  className="ml-4 transition-all duration-300 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Switch to {navigationStyle === 'horizontal' ? 'Sidebar' : 'Horizontal'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    navigationStyle === 'horizontal'
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:bg-accent/20'
                  }`}
                  onClick={() => updateNavigationPreference('defaultStyle', 'horizontal')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Horizontal Navigation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Traditional top navigation bar with horizontal sub-navigation tabs
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Desktop friendly</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Familiar</span>
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    navigationStyle === 'sidebar'
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:bg-accent/20'
                  }`}
                  onClick={() => updateNavigationPreference('defaultStyle', 'sidebar')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Sidebar className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Sidebar Navigation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Modern vertical sidebar with collapsible sections and better organization
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Modern</span>
                    <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Space efficient</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-card-foreground">Remember Navigation Choice</h4>
                  <p className="text-sm text-muted-foreground">Save your navigation preference for future sessions</p>
                </div>
                <Switch 
                  checked={navigationPreferences.rememberChoice} 
                  onCheckedChange={(value) => updateNavigationPreference('rememberChoice', value)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-card-foreground">Auto-Switch Navigation</h4>
                  <p className="text-sm text-muted-foreground">Automatically switch between navigation styles based on screen size</p>
                </div>
                <Switch 
                  checked={navigationPreferences.autoSwitch} 
                  onCheckedChange={(value) => updateNavigationPreference('autoSwitch', value)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-card-foreground">Enable Navigation Animations</h4>
                  <p className="text-sm text-muted-foreground">Smooth transitions and hover effects for navigation elements</p>
                </div>
                <Switch 
                  checked={navigationPreferences.enableAnimations} 
                  onCheckedChange={(value) => updateNavigationPreference('enableAnimations', value)} 
                />
              </div>
              
              {navigationStyle === 'sidebar' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-card-foreground">Sidebar Default State</h4>
                      <p className="text-sm text-muted-foreground">Start with sidebar collapsed by default</p>
                    </div>
                    <Switch 
                      checked={navigationPreferences.sidebarDefaultCollapsed} 
                      onCheckedChange={(value) => updateNavigationPreference('sidebarDefaultCollapsed', value)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-card-foreground">Show Quick Actions</h4>
                      <p className="text-sm text-muted-foreground">Display quick action buttons in sidebar header</p>
                    </div>
                    <Switch 
                      checked={navigationPreferences.showQuickActions} 
                      onCheckedChange={(value) => updateNavigationPreference('showQuickActions', value)} 
                    />
                  </div>
                </>
              )}
            </div>

            <Alert className="border-primary/20 bg-primary/5">
              <Settings className="w-4 h-4" />
              <AlertDescription className="text-sm">
                <strong>Navigation Tips:</strong> 
                <br />• <strong>Horizontal:</strong> Traditional top navigation with sub-navigation below - great for wide screens
                <br />• <strong>Sidebar:</strong> Vertical navigation panel with collapsible sections - better space utilization
                <br />• <strong>Auto-Switch:</strong> Automatically adapts to your screen size for optimal experience
                <br />• Changes apply immediately and are saved for future sessions
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Lock className="w-5 h-5" />
            Password Management
          </CardTitle>
          <CardDescription>
            Change your password and manage authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField control={passwordForm.control} name="currentPassword" render={({
              field
            }) => <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showCurrentPassword ? "text" : "password"} placeholder="Enter current password" className="bg-input border-border" {...field} />
                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent text-gray-950">
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={passwordForm.control} name="newPassword" render={({
                field
              }) => <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showNewPassword ? "text" : "password"} placeholder="Enter new password" className="bg-input border-border" {...field} />
                          <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-zinc-950">
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={passwordForm.control} name="confirmPassword" render={({
                field
              }) => <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm new password" className="bg-input border-border" {...field} />
                          <Button type="button" variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-950">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
              
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* PIN Setup */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Key className="w-5 h-5" />
            PIN Setup
          </CardTitle>
          <CardDescription>
            Set up a 4-digit PIN for quick authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securitySettings.pinEnabled ? <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-success font-medium">PIN is enabled</span>
              </div>
              <Button variant="outline" onClick={() => setSecuritySettings(prev => ({
            ...prev,
            pinEnabled: false
          }))} className="bg-gray-50 text-slate-950">
                Change PIN
              </Button>
            </div> : <Form {...pinForm}>
              <form onSubmit={pinForm.handleSubmit(onPinSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={pinForm.control} name="pin" render={({
                field
              }) => <FormItem>
                        <FormLabel>4-Digit PIN</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="****" maxLength={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={pinForm.control} name="confirmPin" render={({
                field
              }) => <FormItem>
                        <FormLabel>Confirm PIN</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="****" maxLength={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>
                
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  Set PIN
                </Button>
              </form>
            </Form>}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Smartphone className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securitySettings.twoFactorEnabled ? <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-success font-medium">Two-factor authentication is enabled</span>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  Active
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadBackupCodes}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Backup Codes
                </Button>
                <Button variant="outline" onClick={() => setSecuritySettings(prev => ({
              ...prev,
              twoFactorEnabled: false
            }))} className="hover:bg-destructive hover:text-destructive-foreground">
                  Disable 2FA
                </Button>
              </div>
            </div> : <div className="space-y-4">
              <Alert className="bg-accent/10 border-accent/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication adds an extra layer of security to your account. 
                  We recommend enabling it for better protection.
                </AlertDescription>
              </Alert>
              
              <Button onClick={enable2FA} className="bg-primary hover:bg-primary-dark">
                Enable Two-Factor Authentication
              </Button>
            </div>}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Settings className="w-5 h-5" />
            Security Preferences
          </CardTitle>
          <CardDescription>
            Configure your security and privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-card-foreground">Biometric Authentication</h4>
                <p className="text-sm text-muted-foreground">Use fingerprint or face ID to log in</p>
              </div>
              <Switch checked={securitySettings.biometricEnabled} onCheckedChange={() => toggleSetting('biometricEnabled')} className="bg-zinc-950 hover:bg-zinc-800 text-slate-50" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-card-foreground">Session Timeout</h4>
                <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
              </div>
              <Switch checked={securitySettings.sessionTimeout} onCheckedChange={() => toggleSetting('sessionTimeout')} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-card-foreground">Login Notifications</h4>
                <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
              </div>
              <Switch checked={securitySettings.loginNotifications} onCheckedChange={() => toggleSetting('loginNotifications')} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-card-foreground">Device Tracking</h4>
                <p className="text-sm text-muted-foreground">Track and manage logged-in devices</p>
              </div>
              <Switch checked={securitySettings.deviceTracking} onCheckedChange={() => toggleSetting('deviceTracking')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      {securitySettings.deviceTracking && <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Smartphone className="w-5 h-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Manage your active login sessions across devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 bg-card/90 backdrop-blur-lg">
            {loginSessions.map(session => <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-card-foreground">{session.device}</h4>
                    {session.isCurrent && <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        Current
                      </Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                </div>
                
                {!session.isCurrent && <Button variant="outline" size="sm" onClick={() => terminateSession(session.id)} className="bg-zinc-50 text-zinc-950">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Terminate
                  </Button>}
              </div>)}
            
            <Button variant="outline" onClick={terminateAllSessions} className="w-full hover:bg-destructive text-gray-950">
              Terminate All Other Sessions
            </Button>
          </CardContent>
        </Card>}
    </div>;
};
export default SecuritySettings;