import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AccessLog {
  id: string;
  studentId: string;
  studentHandle: string;
  accessType: 'view' | 'edit' | 'export';
  timestamp: string;
  counselorId: string;
  counselorName: string;
  dataAccessed: string[];
  purpose: string;
}

interface PrivacyControlsProps {
  studentId?: string;
  onAccessLog?: (log: AccessLog) => void;
}

// Mock access logs - In real app, this would come from backend
const MOCK_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'LOG001',
    studentId: 'STU001',
    studentHandle: 'anonymous_butterfly',
    accessType: 'view',
    timestamp: '2024-01-21T10:30:00Z',
    counselorId: 'COUN001',
    counselorName: 'Dr. Sarah Wilson',
    dataAccessed: ['Profile', 'Session History', 'Screening Scores'],
    purpose: 'Regular counseling session preparation'
  },
  {
    id: 'LOG002',
    studentId: 'STU002',
    studentHandle: 'quiet_ocean',
    accessType: 'edit',
    timestamp: '2024-01-21T09:15:00Z',
    counselorId: 'COUN001',
    counselorName: 'Dr. Sarah Wilson',
    dataAccessed: ['Session Notes', 'Risk Assessment'],
    purpose: 'Crisis intervention documentation'
  },
  {
    id: 'LOG003',
    studentId: 'STU001',
    studentHandle: 'anonymous_butterfly',
    accessType: 'export',
    timestamp: '2024-01-20T16:45:00Z',
    counselorId: 'COUN002',
    counselorName: 'Akeela P',
    dataAccessed: ['Academic Records', 'Attendance Data'],
    purpose: 'Academic support planning'
  }
];

const CONSENT_LEVELS = {
  full: {
    label: 'Full Consent',
    description: 'Student has provided full consent for data sharing and counselor access',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  partial: {
    label: 'Partial Consent',
    description: 'Student has limited consent - some data may be restricted',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertTriangle
  },
  anonymous: {
    label: 'Anonymous Only',
    description: 'Student prefers anonymous interaction - personal data restricted',
    color: 'bg-blue-100 text-blue-800',
    icon: Eye
  },
  revoked: {
    label: 'Consent Revoked',
    description: 'Student has revoked consent - access restricted to emergency only',
    color: 'bg-red-100 text-red-800',
    icon: Lock
  }
};

export default function PrivacyControls({ studentId, onAccessLog }: PrivacyControlsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [showDetailedLogs, setShowDetailedLogs] = useState(false);

  // Filter logs based on student ID if provided
  const filteredLogs = studentId 
    ? MOCK_ACCESS_LOGS.filter(log => log.studentId === studentId)
    : MOCK_ACCESS_LOGS;

  // Filter logs based on timeframe
  const timeframeLogs = filteredLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
    
    switch (selectedTimeframe) {
      case '24h': return diffHours <= 24;
      case '7d': return diffHours <= 168; // 7 days
      case '30d': return diffHours <= 720; // 30 days
      default: return true;
    }
  });

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'view': return Eye;
      case 'edit': return FileText;
      case 'export': return Download;
      default: return Eye;
    }
  };

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'view': return 'bg-blue-100 text-blue-800';
      case 'edit': return 'bg-orange-100 text-orange-800';
      case 'export': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportLogs = () => {
    // In real app, this would export access logs
    console.log('Exporting access logs...', timeframeLogs);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Privacy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            Data Privacy & Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              All student data access is logged and monitored for compliance with HIPAA and institutional privacy policies.
              Access is granted based on student consent levels and counselor authorization.
            </AlertDescription>
          </Alert>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(CONSENT_LEVELS).map(([key, level]) => {
              const Icon = level.icon;
              return (
                <div key={key} className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <Badge className={level.color}>
                      {level.label}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{level.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Access Logs */}
      <Card>
        <CardHeader>
          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Access Logs
              <Badge variant="outline" className="text-xs">{timeframeLogs.length} entries</Badge>
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleExportLogs} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeframeLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No access logs found for the selected timeframe</p>
              </div>
            ) : (
              timeframeLogs.map((log) => {
                const AccessIcon = getAccessTypeIcon(log.accessType);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <AccessIcon className="w-4 h-4 sm:w-5 sm:h-5 mt-1 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge className={`${getAccessTypeColor(log.accessType)} text-xs`}>
                              {log.accessType.toUpperCase()}
                            </Badge>
                            <span className="text-sm sm:text-base font-medium truncate">{log.studentHandle}</span>
                            <span className="text-xs sm:text-sm text-gray-500">({log.studentId})</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">{log.purpose}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{log.counselorName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                          {showDetailedLogs && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm font-medium text-gray-700 mb-1">Data Accessed:</p>
                              <div className="flex flex-wrap gap-1">
                                {log.dataAccessed.map((data, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {data}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {timeframeLogs.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedLogs(!showDetailedLogs)}
                className="w-full"
              >
                {showDetailedLogs ? 'Hide' : 'Show'} Detailed Information
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            Compliance & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="text-sm sm:text-base font-medium mb-3">Data Protection Standards</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  HIPAA Compliant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  End-to-end Encryption
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Role-based Access Control
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Audit Trail Logging
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-medium mb-3">Access Guidelines</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>• Access student data only when necessary for counseling</li>
                <li>• Respect student consent levels and preferences</li>
                <li>• Document the purpose of each data access</li>
                <li>• Report any privacy concerns immediately</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}