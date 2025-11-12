import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Calendar,
  Activity,
  AlertTriangle,
  MessageCircle,
  FileText,
  Clock,
  TrendingUp,
  Heart,
  Brain,
  Shield,
  Phone,
  Mail
} from 'lucide-react';

interface StudentData {
  id: string;
  ephemeralHandle: string;
  institution: string;
  department?: string;
  year?: string;
  joinedDate: string;
  lastActive: string;
  sessionsCount: number;
  riskLevel: 'low' | 'moderate' | 'high';
  currentIssues: string[];
  conversationInsights: {
    engagementLevel: 'low' | 'medium' | 'high';
    primaryConcerns: string[];
    lastChatSession: string;
    totalMessages: number;
    averageResponseTime: string;
  };
  recentActivity: string;
  academicInfo?: {
    gpa?: number;
    attendanceRate?: number;
    coursesEnrolled?: number;
  };
  sessionHistory?: {
    date: string;
    type: string;
    duration: number;
    notes: string;
  }[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  consentLevel: 'anonymous' | 'partial' | 'full';
}

interface StudentDetailModalProps {
  student: StudentData | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  if (!student) return null;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreInterpretation = (score: number, type: 'phq9' | 'gad7') => {
    if (type === 'phq9') {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600' };
      if (score <= 9) return { level: 'Mild', color: 'text-yellow-600' };
      if (score <= 14) return { level: 'Moderate', color: 'text-orange-600' };
      if (score <= 19) return { level: 'Moderately Severe', color: 'text-red-600' };
      return { level: 'Severe', color: 'text-red-800' };
    } else {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600' };
      if (score <= 9) return { level: 'Mild', color: 'text-yellow-600' };
      if (score <= 14) return { level: 'Moderate', color: 'text-orange-600' };
      return { level: 'Severe', color: 'text-red-600' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                {student.ephemeralHandle.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold truncate">Student Profile: {student.ephemeralHandle}</h2>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{student.department} • {student.year}</p>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Comprehensive view of student data and mental health status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Privacy Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-blue-800">
                  Privacy Level: {student.consentLevel === 'anonymous' ? 'Anonymous' : 
                    student.consentLevel === 'partial' ? 'Partial Identity' : 'Full Identity'}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                All data access is logged for compliance and security purposes.
              </p>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 rounded-lg border ${getRiskColor(student.riskLevel)} sm:col-span-2 lg:col-span-1`}>
                  <p className="text-sm sm:text-base font-medium">Overall Risk Level</p>
                  <p className="text-xl sm:text-2xl font-bold capitalize">{student.riskLevel}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-sm sm:text-base font-medium text-gray-600">Engagement Level</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 capitalize">{student.conversationInsights.engagementLevel}</p>
                  <p className={`text-xs sm:text-sm ${getEngagementColor(student.conversationInsights.engagementLevel)}`}>Chat Activity</p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-sm sm:text-base font-medium text-gray-600">Total Messages</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{student.conversationInsights.totalMessages}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Conversations</p>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4">
                <p className="text-sm sm:text-base font-medium text-gray-600 mb-2">Current Issues</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {student.currentIssues.map((issue, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{issue}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          {student.academicInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Institution</p>
                    <p className="text-sm sm:text-base font-medium break-words">{student.institution}</p>
                  </div>
                  {student.department && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Department</p>
                      <p className="text-sm sm:text-base font-medium">{student.department}</p>
                    </div>
                  )}
                  {student.year && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Year</p>
                      <p className="text-sm sm:text-base font-medium">{student.year}</p>
                    </div>
                  )}
                  {student.academicInfo.gpa && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">GPA</p>
                      <p className="text-sm sm:text-base font-medium">{student.academicInfo.gpa}</p>
                    </div>
                  )}
                  {student.academicInfo.attendanceRate && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Attendance Rate</p>
                      <p className="text-sm sm:text-base font-medium">{student.academicInfo.attendanceRate}%</p>
                    </div>
                  )}
                  {student.academicInfo.coursesEnrolled && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Courses Enrolled</p>
                      <p className="text-sm sm:text-base font-medium">{student.academicInfo.coursesEnrolled}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">{student.sessionsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Last Active</p>
                    <p className="text-sm sm:text-base font-medium">{formatDate(student.lastActive)}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Recent Activity</p>
                    <p className="text-sm sm:text-base font-medium break-words">{student.recentActivity}</p>
                  </div>
                </div>
                
                {student.sessionHistory && student.sessionHistory.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base font-medium text-gray-600">Recent Sessions</p>
                    {student.sessionHistory.slice(0, 3).map((session, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-base font-medium">{session.type}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{formatDate(session.date)}</p>
                          </div>
                          <Badge variant="outline" className="text-xs self-start">{session.duration} min</Badge>
                        </div>
                        <p className="text-xs sm:text-sm mt-2">{session.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {student.emergencyContact && student.consentLevel !== 'anonymous' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Name</p>
                    <p className="text-sm sm:text-base font-medium break-words">{student.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Relationship</p>
                    <p className="text-sm sm:text-base font-medium">{student.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-sm sm:text-base font-medium break-all">{student.emergencyContact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
            <Button className="flex-1 text-sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Schedule Session</span>
              <span className="sm:hidden">Schedule</span>
            </Button>
            <Button variant="outline" className="flex-1 text-sm">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Notes</span>
              <span className="sm:hidden">Notes</span>
            </Button>
            <Button variant="outline" className="flex-1 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Flag for Review</span>
              <span className="sm:hidden">Flag</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailModal;