import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  AlertTriangle, 
  Eye,
  FileText,
  Clock,
  Activity,
  BarChart3,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentDetailModal from '@/components/counselor/StudentDetailModal';
import PrivacyControls from '@/components/counselor/PrivacyControls';

// Mock student data - In real app, this would come from backend
const MOCK_STUDENTS = [
  {
    id: 'STU001',
    ephemeralHandle: 'anonymous_butterfly',
    institution: 'University of Kashmir',
    department: 'Computer Science',
    year: '3rd Year',
    joinedDate: '2024-01-15',
    lastActive: '2024-01-20',
    sessionsCount: 3,
    riskLevel: 'moderate' as const,
    currentIssues: ['Academic Stress', 'Anxiety'],
    conversationInsights: {
      primaryConcerns: ['Academic Stress', 'Anxiety'],
      lastChatSession: '2024-01-18',
      engagementLevel: 'high'
    },
    recentActivity: 'Completed mood tracking',
    academicInfo: {
      gpa: 3.2,
      attendanceRate: 85,
      coursesEnrolled: 6
    },
    sessionHistory: [
      {
        date: '2024-01-18',
        type: 'Individual Counseling',
        duration: 45,
        notes: 'Discussed academic stress and coping strategies'
      },
      {
        date: '2024-01-15',
        type: 'Initial Assessment',
        duration: 60,
        notes: 'Comprehensive intake and risk assessment'
      }
    ],
    emergencyContact: {
      name: 'Sarah Johnson',
      relationship: 'Mother',
      phone: '+91 98765 43210'
    },
    consentLevel: 'partial' as const
  },
  {
    id: 'STU002',
    ephemeralHandle: 'quiet_ocean',
    institution: 'University of Kashmir',
    department: 'Psychology',
    year: '2nd Year',
    joinedDate: '2024-01-10',
    lastActive: '2024-01-19',
    sessionsCount: 5,
    riskLevel: 'high' as const,
    currentIssues: ['Depression', 'Social Isolation'],
    conversationInsights: {
      primaryConcerns: ['Depression', 'Social Isolation'],
      lastChatSession: '2024-01-17',
      engagementLevel: 'very high'
    },
    recentActivity: 'Requested urgent support',
    academicInfo: {
      gpa: 2.8,
      attendanceRate: 65,
      coursesEnrolled: 5
    },
    sessionHistory: [
      {
        date: '2024-01-17',
        type: 'Crisis Intervention',
        duration: 90,
        notes: 'Emergency session for severe depressive episode'
      },
      {
        date: '2024-01-14',
        type: 'Individual Counseling',
        duration: 50,
        notes: 'Ongoing therapy for depression and social anxiety'
      }
    ],
    emergencyContact: {
      name: 'Michael Chen',
      relationship: 'Father',
      phone: '+91 98765 43211'
    },
    consentLevel: 'full' as const
  },
  {
    id: 'STU003',
    ephemeralHandle: 'bright_star',
    institution: 'University of Kashmir',
    department: 'Business Administration',
    year: '1st Year',
    joinedDate: '2024-01-12',
    lastActive: '2024-01-20',
    sessionsCount: 2,
    riskLevel: 'low' as const,
    currentIssues: ['Time Management'],
    conversationInsights: {
      primaryConcerns: ['Time Management'],
      lastChatSession: '2024-01-19',
      engagementLevel: 'moderate'
    },
    recentActivity: 'Joined peer support chat',
    academicInfo: {
      gpa: 3.8,
      attendanceRate: 95,
      coursesEnrolled: 4
    },
    sessionHistory: [
      {
        date: '2024-01-19',
        type: 'Academic Counseling',
        duration: 30,
        notes: 'Time management and study skills workshop'
      }
    ],
    consentLevel: 'anonymous' as const
  },
  {
    id: 'STU004',
    ephemeralHandle: 'peaceful_mind',
    institution: 'University of Kashmir',
    department: 'Engineering',
    year: '4th Year',
    joinedDate: '2024-01-08',
    lastActive: '2024-01-21',
    sessionsCount: 7,
    riskLevel: 'moderate' as const,
    currentIssues: ['Career Anxiety', 'Perfectionism'],
    conversationInsights: {
      primaryConcerns: ['Career Anxiety', 'Perfectionism'],
      lastChatSession: '2024-01-20',
      engagementLevel: 'high'
    },
    recentActivity: 'Completed stress management module',
    academicInfo: {
      gpa: 3.9,
      attendanceRate: 92,
      coursesEnrolled: 7
    },
    sessionHistory: [
      {
        date: '2024-01-20',
        type: 'Career Counseling',
        duration: 45,
        notes: 'Discussed job market anxiety and perfectionist tendencies'
      }
    ],
    emergencyContact: {
      name: 'Priya Sharma',
      relationship: 'Sister',
      phone: '+91 98765 43212'
    },
    consentLevel: 'partial' as const
  }
];

const ANALYTICS_DATA = {
  totalStudents: 156,
  activeToday: 23,
  highRiskStudents: 8,
  completedSessions: 45,
  averageRiskScore: 7.2,
  trendsData: {
    weeklyEngagement: [12, 19, 15, 27, 23, 31, 28],
    riskDistribution: { low: 45, moderate: 35, high: 20 }
  }
};

const CounsellorDashboard = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.ephemeralHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.currentIssues.some(issue => issue.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    const matchesYear = yearFilter === 'all' || student.year === yearFilter;
    return matchesSearch && matchesRisk && matchesDepartment && matchesYear;
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleRefreshData = () => {
    setLastRefresh(new Date());
    // In real app, this would trigger a data refresh from the backend
  };

  const handleExportData = () => {
    // In real app, this would export filtered student data
    console.log('Exporting student data...', filteredStudents);
  };

  // Get unique departments and years for filters
  const departments = [...new Set(MOCK_STUDENTS.map(s => s.department))];
  const years = [...new Set(MOCK_STUDENTS.map(s => s.year))];

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'moderate': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselor Dashboard</h1>
              <p className="text-gray-600">Monitor student wellbeing and manage counseling sessions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => {/* Settings modal */}}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Students</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{ANALYTICS_DATA.totalStudents}</p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-500 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Active Today</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{ANALYTICS_DATA.activeToday}</p>
              </div>
              <Activity className="h-6 w-6 md:h-8 md:w-8 text-green-500 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">High Risk</p>
                <p className="text-xl md:text-2xl font-bold text-red-600">{ANALYTICS_DATA.highRiskStudents}</p>
              </div>
              <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-500 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Sessions Today</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">{ANALYTICS_DATA.completedSessions}</p>
              </div>
              <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-purple-500 flex-shrink-0" />
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="students" className="text-xs md:text-sm">Students</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs md:text-sm col-span-2 md:col-span-1">Privacy & Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{students.filter(s => s.riskLevel === 'high').length}</p>
                    <p className="text-sm text-gray-600">High Risk Students</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{students.filter(s => s.riskLevel === 'moderate').length}</p>
                    <p className="text-sm text-gray-600">Moderate Risk</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{ANALYTICS_DATA.averageRiskScore}</p>
                    <p className="text-sm text-gray-600">Avg Risk Score</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Student Activity</h3>
              <div className="space-y-4">
                {students.slice(0, 5).map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{student.ephemeralHandle}</p>
                        <p className="text-sm text-gray-600">{student.recentActivity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRiskBadgeColor(student.riskLevel)}>
                        {student.riskLevel}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatDate(student.lastActive)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Search and Filter */}
            <Card className="p-6">
              <div className="space-y-4 mb-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search students by handle, department, or issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="moderate">Moderate Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2 sm:ml-auto">
                    <Button variant="outline" size="sm" onClick={handleRefreshData} className="flex-1 sm:flex-none">
                      <RefreshCw className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportData} className="flex-1 sm:flex-none">
                      <Download className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="space-y-4">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 md:p-6 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0">
                            {student.ephemeralHandle.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm md:text-base truncate">{student.ephemeralHandle}</h4>
                            <p className="text-xs md:text-sm text-gray-600 truncate">{student.department} • {student.year}</p>
                          </div>
                        </div>
                        <Badge variant={getRiskBadgeColor(student.riskLevel)} className="text-xs flex-shrink-0">
                          {student.riskLevel} risk
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Institution</p>
                          <p className="truncate">{student.institution}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Last Active</p>
                          <p className="truncate">{formatDate(student.lastActive)}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <p className="font-medium text-gray-600">Sessions</p>
                          <p>{student.sessionsCount}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-600 mb-2">Current Issues</p>
                        <div className="flex flex-wrap gap-1">
                          {student.currentIssues.slice(0, 2).map((issue, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{issue}</Badge>
                          ))}
                          {student.currentIssues.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.currentIssues.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg text-xs md:text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Engagement Level</p>
                          <p className="text-lg md:text-xl font-bold text-blue-600 capitalize">{student.conversationInsights.engagementLevel}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Primary Concerns</p>
                          <p className="text-sm text-green-600">{student.conversationInsights.primaryConcerns.length} identified</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <p className="font-medium text-gray-600">Last Chat Session</p>
                          <p className="truncate">{formatDate(student.conversationInsights.lastChatSession)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" variant="outline" className="gap-2 flex-1" onClick={() => handleViewStudent(student)}>
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 flex-1">
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Risk</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${(ANALYTICS_DATA.trendsData.riskDistribution.low / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{ANALYTICS_DATA.trendsData.riskDistribution.low}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Moderate Risk</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-orange-500 rounded-full" 
                          style={{ width: `${(ANALYTICS_DATA.trendsData.riskDistribution.moderate / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{ANALYTICS_DATA.trendsData.riskDistribution.moderate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">High Risk</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-red-500 rounded-full" 
                          style={{ width: `${(ANALYTICS_DATA.trendsData.riskDistribution.high / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{ANALYTICS_DATA.trendsData.riskDistribution.high}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Engagement</h3>
                <div className="space-y-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-12">{day}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-full h-2 bg-gray-200 rounded-full ml-4">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(ANALYTICS_DATA.trendsData.weeklyEngagement[index] / 35) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-8">{ANALYTICS_DATA.trendsData.weeklyEngagement[index]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy & Access Logs Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <PrivacyControls />
          </TabsContent>
        </Tabs>

        {/* Student Detail Modal */}
        <StudentDetailModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default CounsellorDashboard;