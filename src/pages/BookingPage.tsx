import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  Video, 
  MapPin,
  Shield,
  AlertTriangle,
  User,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useToast } from '@/hooks/use-toast';

const BookingPage = () => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { student, currentProblemId } = useStore();
  const { toast } = useToast();
  
  const [contactMethod, setContactMethod] = useState<'phone' | 'video' | 'in_person'>('video');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');
  const [revealIdentity, setRevealIdentity] = useState(false);
  const [preferredTime, setPreferredTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      id: 'video' as const,
      icon: Video,
      title: 'Video Session',
      description: 'Secure video call with counselor',
      availability: 'Available 24/7'
    },
    {
      id: 'phone' as const,
      icon: Phone, 
      title: 'Phone Call',
      description: 'Anonymous phone consultation',
      availability: 'Available 8 AM - 10 PM'
    },
    {
      id: 'in_person' as const,
      icon: MapPin,
      title: 'In-Person Meeting',
      description: 'Face-to-face counseling session',
      availability: 'Campus hours only'
    }
  ];

  const urgencyLevels = [
    {
      id: 'low' as const,
      label: 'General Support',
      description: 'Can wait 24-48 hours',
      color: 'text-success'
    },
    {
      id: 'medium' as const,
      label: 'Moderate Concern',
      description: 'Would like to talk within 12 hours',
      color: 'text-warning'
    },
    {
      id: 'high' as const,
      label: 'Urgent Need',
      description: 'Need support as soon as possible',
      color: 'text-destructive'
    }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Booking Request Submitted",
      description: revealIdentity 
        ? "A counselor will contact you directly within 2 hours."
        : "You'll receive an anonymous contact link via your student portal.",
    });
    
    setIsSubmitting(false);
    navigate(-1);
  };

  const getSelectedMethodIcon = () => {
    const method = contactMethods.find(m => m.id === contactMethod);
    return method ? method.icon : Video;
  };

  const SelectedIcon = getSelectedMethodIcon();

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-border/50 glass-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Connect with a Counselor</h1>
                <p className="text-sm text-muted-foreground">Professional mental health support</p>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            {revealIdentity ? 'Identity Revealed' : 'Anonymous by Default'}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
        {/* Privacy Notice */}
        <Card className="glass-card p-6 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Your Privacy is Protected</h3>
              <p className="text-muted-foreground mb-3">
                By default, your identity remains private. Counselors will only see your anonymous profile and the information you choose to share below.
              </p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">You're booking as: {student?.ephemeralHandle || 'Anonymous User'}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Method Selection */}
          <Card className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <SelectedIcon className="w-5 h-5" />
              How would you like to connect?
            </h3>
            
            <RadioGroup value={contactMethod} onValueChange={(value) => setContactMethod(value as any)}>
              <div className="space-y-3">
                {contactMethods.map((method) => (
                  <div key={method.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <method.icon className="w-4 h-4" />
                          <span className="font-medium">{method.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <p className="text-xs text-success mt-1">{method.availability}</p>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>

          {/* Urgency Level */}
          <Card className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              How urgent is your need?
            </h3>
            
            <RadioGroup value={urgency} onValueChange={(value) => setUrgency(value as any)}>
              <div className="space-y-3">
                {urgencyLevels.map((level) => (
                  <div key={level.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={level.id} className="cursor-pointer">
                        <div className={`font-medium ${level.color} mb-1`}>
                          {level.label}
                        </div>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Tell us more (optional)</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                What would you like to discuss? This helps us match you with the right counselor.
              </Label>
              <Textarea
                id="description"
                placeholder="e.g., anxiety about exams, relationship issues, family stress..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This information remains anonymous unless you choose to reveal your identity below.
              </p>
            </div>

            <div>
              <Label htmlFor="preferred-time" className="text-sm font-medium mb-2 block">
                Preferred time (optional)
              </Label>
              <input
                type="datetime-local"
                id="preferred-time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full p-2 border rounded-lg bg-background text-foreground"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        </Card>

        {/* Identity Reveal Option */}
        <Card className="glass-card p-6 border-warning/30 bg-warning/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Optional: Reveal Identity</h3>
              <p className="text-muted-foreground mb-4">
                You can choose to share your contact information directly with the counselor. 
                This action is logged for security and cannot be undone.
              </p>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reveal-identity"
                  checked={revealIdentity}
                  onCheckedChange={(checked) => setRevealIdentity(checked as boolean)}
                />
                <Label htmlFor="reveal-identity" className="cursor-pointer">
                  I consent to revealing my identity to the counselor
                </Label>
              </div>
              
              {revealIdentity && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                >
                  <p className="text-sm text-destructive">
                    ⚠️ Your identity will be shared with the counselor and this action will be logged with timestamp.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-ambient text-lg px-8 py-4 min-w-[200px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Request Counselor Session
              </div>
            )}
          </Button>
        </div>

        {/* Emergency Contact */}
        <Card className="glass-card p-6 border-destructive/30 bg-destructive/5">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Crisis Support</h3>
            <p className="text-muted-foreground mb-4">
              If you're in immediate crisis or having thoughts of self-harm, please contact:
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">National Suicide Prevention Lifeline: 988</p>
              <p className="font-semibold text-foreground">Campus Emergency: (555) 123-4567</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;