import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Phone, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

// Mock user data - In real app, this would come from backend
interface StudentData {
  id: string;
  ephemeralHandle: string;
  email: string;
  institution: string;
  department: string;
  year: string;
  joinedDate: string;
  lastActive: string;
  sessionsCount: number;
  phone: string;
  emergencyContact: string;
}

interface CounselorData {
  id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  specialization: string;
  license: string;
  experience: string;
  joinedDate: string;
  phone: string;
  office: string;
}

const MOCK_USER_DATA: { student: StudentData; counselor: CounselorData } = {
  student: {
    id: 'STU001',
    ephemeralHandle: 'anonymous_butterfly',
    email: 'student@university.edu',
    institution: 'University of Kashmir',
    department: 'Computer Science',
    year: '3rd Year',
    joinedDate: '2024-01-15',
    lastActive: '2024-01-20',
    sessionsCount: 3,
    phone: '+91 98765 43210',
    emergencyContact: '+91 98765 43211'
  },
  counselor: {
    id: 'COUN001',
    name: 'Aiswarya Menon',
    email: 'aiswarya.menon@university.edu',
    institution: 'University of Kashmir',
    department: 'Student Counseling Services',
    specialization: 'Clinical Psychology',
    license: 'PSY-12345',
    experience: '8 years',
    joinedDate: '2020-03-15',
    phone: '+91 98765 43200',
    office: 'Building A, Room 205'
  }
};

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const isStudent = user?.role === 'student';
  const userData = MOCK_USER_DATA[user?.role || 'student'];
  const [editedData, setEditedData] = useState(userData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleSave = () => {
    // In real app, this would update the backend
    console.log('Saving user data:', editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">
            {isStudent ? 'Manage your student profile and preferences' : 'Manage your counselor profile and information'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isStudent ? (userData as StudentData).ephemeralHandle : (userData as CounselorData).name}
                </h3>
                <Badge variant="outline" className="mb-4">
                  {isStudent ? 'Student' : 'Counselor'}
                </Badge>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.institution}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(userData.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User ID */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">User ID</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm">{userData.id}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    {isEditing ? (
                      <Input
                        value={editedData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{userData.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Institution */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Institution</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{userData.institution}</span>
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Department</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{userData.department}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    {isEditing ? (
                      <Input
                        value={editedData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{userData.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Role-specific fields */}
                  {isStudent ? (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Academic Year</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{(userData as StudentData).year}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
                        {isEditing ? (
                          <Input
                            value={(editedData as StudentData).emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm">{(userData as StudentData).emergencyContact}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Sessions Completed</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{(userData as StudentData).sessionsCount}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Specialization</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{(userData as CounselorData).specialization}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">License Number</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{(userData as CounselorData).license}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Experience</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{(userData as CounselorData).experience}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Office Location</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{(userData as CounselorData).office}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {new Date(userData.joinedDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {isStudent ? (userData as StudentData).sessionsCount : '45+'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isStudent ? 'Sessions Attended' : 'Students Helped'}
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {new Date((isStudent ? (userData as StudentData).lastActive : userData.joinedDate) || userData.joinedDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Last Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;