import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileText,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  BarChart3,
  Heart,
  UserCheck,
  BookOpen,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const CounselorDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Mock data for demonstration
  const stats = {
    totalStudents: 156,
    activeStudents: 89,
    pendingAppointments: 12,
    completedSessions: 234,
    urgentCases: 3,
    weeklyGrowth: 8.2
  };

  const recentStudents = [
    { id: 1, name: 'Sarah Johnson', status: 'urgent', lastSession: '2 hours ago', risk: 'high' },
    { id: 2, name: 'Mike Chen', status: 'scheduled', lastSession: '1 day ago', risk: 'medium' },
    { id: 3, name: 'Emma Davis', status: 'completed', lastSession: '3 days ago', risk: 'low' },
    { id: 4, name: 'Alex Rodriguez', status: 'pending', lastSession: '1 week ago', risk: 'medium' },
  ];

  const upcomingAppointments = [
    { id: 1, student: 'Sarah Johnson', time: '10:00 AM', type: 'Individual Session', duration: '50 min' },
    { id: 2, student: 'Mike Chen', time: '2:00 PM', type: 'Follow-up', duration: '30 min' },
    { id: 3, student: 'Emma Davis', time: '4:00 PM', type: 'Group Session', duration: '60 min' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Counselor Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Overview */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Students</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.activeStudents}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.pendingAppointments}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Urgent Cases</p>
                      <p className="text-3xl font-bold text-red-600">{stats.urgentCases}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Students */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Student Activity</CardTitle>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Student
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentStudents.map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-500">{student.lastSession}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={student.risk === 'high' ? 'destructive' : student.risk === 'medium' ? 'default' : 'secondary'}
                              >
                                {student.risk} risk
                              </Badge>
                              <Badge variant="outline">{student.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Today's Appointments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Appointments</CardTitle>
                      <CardDescription>Your scheduled sessions for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{appointment.student}</p>
                                <p className="text-sm text-gray-500">{appointment.type} • {appointment.duration}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{appointment.time}</p>
                              <Button variant="ghost" size="sm">
                                Join
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Student Management</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Student management interface will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Appointment scheduling and management interface will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics & Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Analytics dashboard with charts and reports will be implemented here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CounselorDashboard;