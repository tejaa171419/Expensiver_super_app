import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, User, MapPin, Calendar, Briefcase } from "lucide-react";
import { toast } from "sonner";
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  occupation: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional()
});
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
const PersonalInfoForm = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isNewUser, setIsNewUser] = useState(true); // This would come from auth context

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "prefer-not-to-say",
      occupation: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      bio: ""
    }
  });
  const onSubmit = (data: PersonalInfoFormData) => {
    console.log("Personal info:", data);
    toast.success("Profile updated successfully!");
    if (isNewUser) {
      setIsNewUser(false);
      toast.success("Welcome! Your profile has been created.");
    }
  };
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Profile picture updated!");
    }
  };
  return <Card className="glass-card">
      <CardHeader className="bg-card/90 backdrop-blur-lg">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          {isNewUser ? "Welcome! Please complete your profile to get started." : "Update your personal details and preferences."}
        </CardDescription>
        {isNewUser && <Badge variant="default" className="w-fit">
            New User Setup
          </Badge>}
      </CardHeader>
      <CardContent className="space-y-6 bg-card/90 backdrop-blur-lg">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-2xl bg-primary/10">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary-dark transition-colors">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">Click the camera icon to upload a profile picture</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({
              field
            }) => <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" className="bg-input border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              <FormField control={form.control} name="lastName" render={({
              field
            }) => <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" className="bg-input border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="dateOfBirth" render={({
              field
            }) => <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date of Birth *
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-input border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              <FormField control={form.control} name="gender" render={({
              field
            }) => <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
            </div>

            {/* Professional Info */}
            <FormField control={form.control} name="occupation" render={({
            field
          }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Occupation
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="What do you do for work?" className="bg-input border-border" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                <MapPin className="w-5 h-5" />
                Address Information
              </h3>
              <FormField control={form.control} name="address" render={({
              field
            }) => <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your full address" className="bg-input border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="city" render={({
                field
              }) => <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" className="bg-input border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={form.control} name="state" render={({
                field
              }) => <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" className="bg-input border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={form.control} name="pincode" render={({
                field
              }) => <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input placeholder="PIN Code" className="bg-input border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
            </div>

            {/* Bio */}
            <FormField control={form.control} name="bio" render={({
            field
          }) => <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us a little about yourself..." className="min-h-[100px] bg-input border-border" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark" size="lg">
              {isNewUser ? "Create Profile" : "Update Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>;
};
export default PersonalInfoForm;