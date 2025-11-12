// Mock student data for demonstration
const MOCK_STUDENTS_DATA = [
  {
    id: 'STU001',
    ephemeralHandle: 'AnonymousLearner23',
    email: 'student1@university.edu',
    institution: 'University of Technology',
    year: 'Third Year',
    major: 'Computer Science',
    emergencyContact: '+1-555-0123',
    joinedDate: '2024-01-15',
    lastActive: '2024-01-20',
    sessionsCount: 5,
    riskLevel: 'low' as const,
    status: 'active' as const,
    mentalHealthScore: 7.2,
    lastAssessment: '2024-01-18',
    notes: 'Student showing good progress in managing academic stress.',
    tags: ['academic-stress', 'time-management']
  },
  {
    id: 'STU002',
    ephemeralHandle: 'StudyBuddy42',
    email: 'student2@university.edu',
    institution: 'University of Technology',
    year: 'Second Year',
    major: 'Psychology',
    emergencyContact: '+1-555-0124',
    joinedDate: '2024-01-10',
    lastActive: '2024-01-19',
    sessionsCount: 8,
    riskLevel: 'moderate' as const,
    status: 'active' as const,
    mentalHealthScore: 5.8,
    lastAssessment: '2024-01-17',
    notes: 'Experiencing some anxiety related to social situations. Regular check-ins recommended.',
    tags: ['social-anxiety', 'peer-pressure']
  },
  {
    id: 'STU003',
    ephemeralHandle: 'QuietThinker',
    email: 'student3@university.edu',
    institution: 'University of Technology',
    year: 'First Year',
    major: 'Engineering',
    emergencyContact: '+1-555-0125',
    joinedDate: '2024-01-05',
    lastActive: '2024-01-20',
    sessionsCount: 12,
    riskLevel: 'high' as const,
    status: 'needs_attention' as const,
    mentalHealthScore: 4.1,
    lastAssessment: '2024-01-19',
    notes: 'Student showing signs of depression. Immediate follow-up required.',
    tags: ['depression', 'academic-pressure', 'family-issues']
  },
  {
    id: 'STU004',
    ephemeralHandle: 'CreativeSpirit',
    email: 'student4@university.edu',
    institution: 'University of Technology',
    year: 'Fourth Year',
    major: 'Fine Arts',
    emergencyContact: '+1-555-0126',
    joinedDate: '2024-01-12',
    lastActive: '2024-01-18',
    sessionsCount: 3,
    riskLevel: 'low' as const,
    status: 'active' as const,
    mentalHealthScore: 8.1,
    lastAssessment: '2024-01-16',
    notes: 'Well-adjusted student seeking occasional guidance on career decisions.',
    tags: ['career-guidance', 'self-improvement']
  },
  {
    id: 'STU005',
    ephemeralHandle: 'NightOwl99',
    email: 'student5@university.edu',
    institution: 'University of Technology',
    year: 'Third Year',
    major: 'Business Administration',
    emergencyContact: '+1-555-0127',
    joinedDate: '2024-01-08',
    lastActive: '2024-01-20',
    sessionsCount: 6,
    riskLevel: 'moderate' as const,
    status: 'active' as const,
    mentalHealthScore: 6.3,
    lastAssessment: '2024-01-18',
    notes: 'Struggling with work-life balance and sleep issues.',
    tags: ['sleep-issues', 'work-life-balance', 'stress-management']
  }
];

export interface StudentDataFilters {
  riskLevel?: 'low' | 'moderate' | 'high';
  status?: 'active' | 'inactive' | 'needs_attention';
  institution?: string;
  year?: string;
  searchQuery?: string;
}

export interface StudentAnalytics {
  totalStudents: number;
  activeStudents: number;
  highRiskStudents: number;
  averageMentalHealthScore: number;
  recentAssessments: number;
  sessionsTodayCount: number;
}

class StudentDataService {
  private students = MOCK_STUDENTS_DATA;

  // Get all students with optional filtering
  async getStudents(filters?: StudentDataFilters) {
    let filteredStudents = [...this.students];

    if (filters) {
      if (filters.riskLevel) {
        filteredStudents = filteredStudents.filter(s => s.riskLevel === filters.riskLevel);
      }
      if (filters.status) {
        filteredStudents = filteredStudents.filter(s => s.status === filters.status);
      }
      if (filters.institution) {
        filteredStudents = filteredStudents.filter(s => 
          s.institution.toLowerCase().includes(filters.institution!.toLowerCase())
        );
      }
      if (filters.year) {
        filteredStudents = filteredStudents.filter(s => s.year === filters.year);
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredStudents = filteredStudents.filter(s => 
          s.ephemeralHandle.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query) ||
          s.major.toLowerCase().includes(query) ||
          s.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
    }

    return filteredStudents;
  }

  // Get student by ID
  async getStudentById(id: string) {
    return this.students.find(s => s.id === id);
  }

  // Get analytics data
  async getAnalytics(): Promise<StudentAnalytics> {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.status === 'active').length;
    const highRiskStudents = this.students.filter(s => s.riskLevel === 'high').length;
    const averageMentalHealthScore = this.students.reduce((sum, s) => sum + s.mentalHealthScore, 0) / totalStudents;
    
    // Mock recent assessments (last 7 days)
    const recentAssessments = this.students.filter(s => {
      const assessmentDate = new Date(s.lastAssessment);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return assessmentDate >= weekAgo;
    }).length;

    // Mock sessions today
    const sessionsTodayCount = Math.floor(Math.random() * 15) + 5;

    return {
      totalStudents,
      activeStudents,
      highRiskStudents,
      averageMentalHealthScore: Math.round(averageMentalHealthScore * 10) / 10,
      recentAssessments,
      sessionsTodayCount
    };
  }

  // Update student notes
  async updateStudentNotes(id: string, notes: string) {
    const studentIndex = this.students.findIndex(s => s.id === id);
    if (studentIndex !== -1) {
      this.students[studentIndex].notes = notes;
      return this.students[studentIndex];
    }
    throw new Error('Student not found');
  }

  // Update student risk level
  async updateStudentRiskLevel(id: string, riskLevel: 'low' | 'moderate' | 'high') {
    const studentIndex = this.students.findIndex(s => s.id === id);
    if (studentIndex !== -1) {
      this.students[studentIndex].riskLevel = riskLevel;
      return this.students[studentIndex];
    }
    throw new Error('Student not found');
  }

  // Get students by risk level
  async getStudentsByRiskLevel(riskLevel: 'low' | 'moderate' | 'high') {
    return this.students.filter(s => s.riskLevel === riskLevel);
  }

  // Search students
  async searchStudents(query: string) {
    return this.getStudents({ searchQuery: query });
  }

  // Get recent activity
  async getRecentActivity() {
    return this.students
      .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
      .slice(0, 10);
  }
}

// Export singleton instance
export const studentDataService = new StudentDataService();
export default studentDataService;