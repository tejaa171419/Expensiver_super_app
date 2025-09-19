import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Calendar as CalendarIcon,
  Users,
  Receipt,
  Calculator,
  IndianRupee,
  ImageIcon,
  FileText,
  X,
  Plus,
  AlertCircle,
  Check,
  Edit2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
}

interface SplitDetail {
  memberId: string;
  amount: number;
  percentage?: number;
}

interface ExpenseFormData {
  title: string;
  amount: string;
  category: string;
  date: Date;
  payerId: string;
  splitType: 'equal' | 'percentage' | 'exact';
  selectedMembers: string[];
  notes: string;
  receipt?: File;
  splits: SplitDetail[];
}

interface AddExpenseFormProps {
  groupId?: string;
  members: Member[];
  onSubmit: (expense: ExpenseFormData) => void;
  onCancel: () => void;
  defaultPayer?: string;
}

const categories = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'bg-orange-500' },
  { id: 'travel', name: 'Travel & Transport', icon: '🚗', color: 'bg-blue-500' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-purple-500' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-500' },
  { id: 'bills', name: 'Bills & Utilities', icon: '📄', color: 'bg-yellow-500' },
  { id: 'accommodation', name: 'Accommodation', icon: '🏠', color: 'bg-green-500' },
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: 'bg-indigo-500' },
  { id: 'health', name: 'Health & Medical', icon: '🏥', color: 'bg-red-500' },
  { id: 'other', name: 'Other', icon: '📦', color: 'bg-gray-500' }
];

const AddExpenseForm = ({ 
  groupId, 
  members, 
  onSubmit, 
  onCancel, 
  defaultPayer 
}: AddExpenseFormProps) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    amount: '',
    category: 'food',
    date: new Date(),
    payerId: defaultPayer || members[0]?.id || '',
    splitType: 'equal',
    selectedMembers: members.filter(m => m.isActive).map(m => m.id),
    notes: '',
    splits: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Expense title is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.payerId) {
      newErrors.payerId = 'Please select who paid for this expense';
    }

    if (formData.selectedMembers.length === 0) {
      newErrors.selectedMembers = 'Please select at least one member to split with';
    }

    // Validate custom splits
    if (formData.splitType === 'exact' || formData.splitType === 'percentage') {
      const totalAmount = parseFloat(formData.amount) || 0;
      const totalSplit = formData.splits.reduce((sum, split) => sum + (split.amount || 0), 0);
      
      if (formData.splitType === 'exact' && Math.abs(totalSplit - totalAmount) > 0.01) {
        newErrors.splits = 'Split amounts must equal the total expense amount';
      }
      
      if (formData.splitType === 'percentage') {
        const totalPercentage = formData.splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          newErrors.splits = 'Split percentages must equal 100%';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Calculate splits automatically
  const calculateSplits = useCallback(() => {
    const amount = parseFloat(formData.amount) || 0;
    const selectedMemberCount = formData.selectedMembers.length;

    if (selectedMemberCount === 0 || amount === 0) return [];

    let newSplits: SplitDetail[] = [];

    switch (formData.splitType) {
      case 'equal': {
        const equalAmount = amount / selectedMemberCount;
        newSplits = formData.selectedMembers.map(memberId => ({
          memberId,
          amount: parseFloat(equalAmount.toFixed(2)),
          percentage: parseFloat((100 / selectedMemberCount).toFixed(2))
        }));
        break;
      }

      case 'percentage':
        newSplits = formData.selectedMembers.map(memberId => {
          const existingSplit = formData.splits.find(s => s.memberId === memberId);
          const percentage = existingSplit?.percentage || (100 / selectedMemberCount);
          return {
            memberId,
            amount: parseFloat(((amount * percentage) / 100).toFixed(2)),
            percentage: parseFloat(percentage.toFixed(2))
          };
        });
        break;

      case 'exact':
        newSplits = formData.selectedMembers.map(memberId => {
          const existingSplit = formData.splits.find(s => s.memberId === memberId);
          const splitAmount = existingSplit?.amount || parseFloat((amount / selectedMemberCount).toFixed(2));
          return {
            memberId,
            amount: splitAmount,
            percentage: parseFloat(((splitAmount / amount) * 100).toFixed(2))
          };
        });
        break;
    }

    setFormData(prev => ({ ...prev, splits: newSplits }));
  }, [formData.amount, formData.selectedMembers, formData.splitType, formData.splits]);

  // Update splits when relevant fields change
  React.useEffect(() => {
    // Only recalculate if we have a valid amount and selected members
    if (formData.amount && formData.selectedMembers.length > 0) {
      calculateSplits();
    }
  }, [formData.amount, formData.selectedMembers.length]);

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error('Please upload only images or PDF files');
        return false;
      }
      
      if (!isValidSize) {
        toast.error('File size must be less than 10MB');
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const expenseData = {
      ...formData,
      receipt: uploadedFiles[0] // For now, take the first uploaded file
    };

    onSubmit(expenseData);
    toast.success('Expense added successfully!');
  };

  // Get member by ID
  const getMemberById = (id: string) => members.find(m => m.id === id);

  // Update split amount/percentage
  const updateSplit = (memberId: string, field: 'amount' | 'percentage', value: number) => {
    setFormData(prev => ({
      ...prev,
      splits: prev.splits.map(split => 
        split.memberId === memberId 
          ? { 
              ...split, 
              [field]: value,
              ...(field === 'percentage' 
                ? { amount: parseFloat(((parseFloat(prev.amount) * value) / 100).toFixed(2)) }
                : { percentage: parseFloat(((value / parseFloat(prev.amount)) * 100).toFixed(2)) }
              )
            }
          : split
      )
    }));
  };

  const totalSplitAmount = formData.splits.reduce((sum, split) => sum + (split.amount || 0), 0);
  const totalSplitPercentage = formData.splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
  
  // Memoize form validation to prevent infinite re-renders
  const isFormValid = React.useMemo(() => {
    if (!formData.title.trim()) return false;
    if (!formData.amount || parseFloat(formData.amount) <= 0) return false;
    if (!formData.payerId) return false;
    if (formData.selectedMembers.length === 0) return false;
    
    // Validate custom splits
    if (formData.splitType === 'exact' || formData.splitType === 'percentage') {
      const totalAmount = parseFloat(formData.amount) || 0;
      const totalSplit = formData.splits.reduce((sum, split) => sum + (split.amount || 0), 0);
      
      if (formData.splitType === 'exact' && Math.abs(totalSplit - totalAmount) > 0.01) {
        return false;
      }
      
      if (formData.splitType === 'percentage') {
        const totalPercentage = formData.splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          return false;
        }
      }
    }
    
    return true;
  }, [formData]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white font-medium">Expense Title *</Label>
              <Input
                placeholder="e.g., Lunch at restaurant, Train tickets"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              />
              {errors.title && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Amount *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white pl-10 placeholder:text-white/60"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.amount && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white font-medium">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Date</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/95 border-white/20">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, date }));
                        setShowCalendar(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Payer Selection */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Who Paid? *</Label>
            <Select value={formData.payerId} onValueChange={(value) => setFormData(prev => ({ ...prev, payerId: value }))}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="Select who paid for this expense" />
              </SelectTrigger>
              <SelectContent>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payerId && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.payerId}
              </p>
            )}
          </div>

          {/* Split Type */}
          <div className="space-y-4">
            <Label className="text-white font-medium">How to Split?</Label>
            <RadioGroup 
              value={formData.splitType} 
              onValueChange={(value: 'equal' | 'percentage' | 'exact') => 
                setFormData(prev => ({ ...prev, splitType: value }))
              }
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal" className="text-white cursor-pointer">
                  Equal Split
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="text-white cursor-pointer">
                  By Percentage
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exact" id="exact" />
                <Label htmlFor="exact" className="text-white cursor-pointer">
                  Exact Amounts
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Member Selection */}
          <div className="space-y-4">
            <Label className="text-white font-medium">Split Between *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.filter(m => m.isActive).map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={member.id}
                    checked={formData.selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          selectedMembers: [...prev.selectedMembers, member.id]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          selectedMembers: prev.selectedMembers.filter(id => id !== member.id)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={member.id} className="text-white cursor-pointer flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </Label>
                </div>
              ))}
            </div>
            {errors.selectedMembers && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.selectedMembers}
              </p>
            )}
          </div>

          {/* Split Preview */}
          {formData.selectedMembers.length > 0 && parseFloat(formData.amount) > 0 && (
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Split Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {formData.splits.map((split) => {
                    const member = getMemberById(split.memberId);
                    if (!member) return null;

                    return (
                      <div key={split.memberId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white font-medium">{member.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {formData.splitType === 'percentage' && (
                            <Input
                              type="number"
                              value={split.percentage}
                              onChange={(e) => updateSplit(split.memberId, 'percentage', parseFloat(e.target.value) || 0)}
                              className="w-20 bg-white/10 border-white/30 text-white text-center"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          )}
                          {formData.splitType === 'exact' && (
                            <Input
                              type="number"
                              value={split.amount}
                              onChange={(e) => updateSplit(split.memberId, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-24 bg-white/10 border-white/30 text-white text-center"
                              min="0"
                              step="0.01"
                            />
                          )}
                          <Badge variant="outline" className="border-green-500 text-green-400">
                            ₹{split.amount.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">
                    Total: ₹{parseFloat(formData.amount).toFixed(2)}
                  </span>
                  <span className={`font-medium ${
                    Math.abs(totalSplitAmount - parseFloat(formData.amount)) < 0.01 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    Split: ₹{totalSplitAmount.toFixed(2)}
                    {formData.splitType === 'percentage' && ` (${totalSplitPercentage.toFixed(1)}%)`}
                  </span>
                </div>
                
                {errors.splits && (
                  <Alert className="border-red-500 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-400">
                      {errors.splits}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Notes (Optional)</Label>
            <Textarea
              placeholder="Add any additional details about this expense..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              rows={3}
            />
          </div>

          {/* Receipt Upload */}
          <div className="space-y-4">
            <Label className="text-white font-medium">Attach Receipt (Optional)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-white/30 hover:border-white/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
              <p className="text-white/70 mb-2">
                Drag and drop files here, or{' '}
                <label className="text-blue-400 cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-white/50 text-sm">Support: Images and PDF files up to 10MB</p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="w-5 h-5 text-blue-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-white text-sm font-medium">{file.name}</p>
                        <p className="text-white/60 text-xs">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpenseForm;