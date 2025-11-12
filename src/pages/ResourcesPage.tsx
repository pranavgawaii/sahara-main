import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  BookOpen, 
  Search,
  Play,
  Download,
  FileText,
  Video,
  Headphones,
  Heart,
  Brain,
  Users,
  Calendar,
  Star,
  Clock,
  Eye
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'pdf' | 'article';
  category: string;
  duration: string;
  description: string;
  tags: string[];
  rating: number;
  views: number;
  featured?: boolean;
}

const ResourcesPage = () => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Managing Academic Stress: A Complete Guide',
      type: 'video',
      category: 'academic_stress',
      duration: '15 min',
      description: 'Learn evidence-based techniques to handle academic pressure and maintain mental wellness during exams.',
      tags: ['stress management', 'study tips', 'exams'],
      rating: 4.8,
      views: 1243,
      featured: true
    },
    {
      id: '2', 
      title: 'Breathing Exercises for Anxiety Relief',
      type: 'audio',
      category: 'anxiety',
      duration: '10 min',
      description: 'Guided breathing techniques you can use anywhere to calm anxiety and racing thoughts.',
      tags: ['breathing', 'anxiety', 'relaxation'],
      rating: 4.9,
      views: 2105,
      featured: true
    },
    {
      id: '3',
      title: 'Building Healthy Relationships in College',
      type: 'pdf',
      category: 'relationships',
      duration: '12 min read',
      description: 'Practical advice for navigating friendships, romantic relationships, and family dynamics during college years.',
      tags: ['relationships', 'communication', 'boundaries'],
      rating: 4.6,
      views: 987
    },
    {
      id: '4',
      title: 'Career Anxiety: From Fear to Confidence',
      type: 'article',
      category: 'career',
      duration: '8 min read',
      description: 'Transform career worries into actionable steps toward your professional goals.',
      tags: ['career', 'confidence', 'planning'],
      rating: 4.7,
      views: 1156
    },
    {
      id: '5',
      title: 'Sleep Hygiene for Better Mental Health',
      type: 'video',
      category: 'sleep',
      duration: '12 min',
      description: 'Discover how proper sleep habits can dramatically improve your mood and cognitive function.',
      tags: ['sleep', 'routine', 'wellness'],
      rating: 4.8,
      views: 1834
    },
    {
      id: '6',
      title: 'Overcoming Social Anxiety on Campus',
      type: 'audio',
      category: 'social',
      duration: '18 min',
      description: 'Practical strategies for building social confidence and meaningful connections in college.',
      tags: ['social anxiety', 'confidence', 'friendships'],
      rating: 4.5,
      views: 743
    },
    // New Instructional Videos
    {
      id: '7',
      title: 'Mindfulness Meditation for Beginners',
      type: 'video',
      category: 'anxiety',
      duration: '20 min',
      description: 'Step-by-step video guide to practicing mindfulness meditation for stress reduction and mental clarity.',
      tags: ['mindfulness', 'meditation', 'stress relief', 'beginners'],
      rating: 4.9,
      views: 3421,
      featured: true
    },
    {
      id: '8',
      title: 'Cognitive Behavioral Therapy Techniques',
      type: 'video',
      category: 'anxiety',
      duration: '25 min',
      description: 'Professional therapist demonstrates CBT techniques for managing negative thought patterns and anxiety.',
      tags: ['CBT', 'therapy', 'negative thoughts', 'coping skills'],
      rating: 4.8,
      views: 2876
    },
    {
      id: '9',
      title: 'Time Management Strategies for Students',
      type: 'video',
      category: 'academic_stress',
      duration: '18 min',
      description: 'Comprehensive video tutorial on effective time management techniques to reduce academic overwhelm.',
      tags: ['time management', 'productivity', 'study skills', 'organization'],
      rating: 4.7,
      views: 1987
    },
    {
      id: '10',
      title: 'Building Self-Confidence and Self-Esteem',
      type: 'video',
      category: 'social',
      duration: '22 min',
      description: 'Interactive video workshop on developing healthy self-confidence and overcoming self-doubt.',
      tags: ['self-confidence', 'self-esteem', 'personal growth', 'motivation'],
      rating: 4.6,
      views: 1654
    },
    {
      id: '11',
      title: 'Effective Communication in Relationships',
      type: 'video',
      category: 'relationships',
      duration: '30 min',
      description: 'Learn essential communication skills for healthier relationships with family, friends, and partners.',
      tags: ['communication', 'relationships', 'conflict resolution', 'empathy'],
      rating: 4.8,
      views: 2234
    },
    {
      id: '12',
      title: 'Career Planning and Goal Setting',
      type: 'video',
      category: 'career',
      duration: '28 min',
      description: 'Comprehensive guide to career exploration, goal setting, and creating actionable career plans.',
      tags: ['career planning', 'goal setting', 'professional development', 'future planning'],
      rating: 4.7,
      views: 1432
    },
    {
      id: '13',
      title: 'Progressive Muscle Relaxation Technique',
      type: 'video',
      category: 'sleep',
      duration: '16 min',
      description: 'Guided video instruction for progressive muscle relaxation to improve sleep quality and reduce tension.',
      tags: ['relaxation', 'sleep', 'muscle tension', 'stress relief'],
      rating: 4.8,
      views: 1876
    },
    {
      id: '14',
      title: 'Understanding and Managing Depression',
      type: 'video',
      category: 'anxiety',
      duration: '35 min',
      description: 'Educational video about depression symptoms, causes, and evidence-based management strategies.',
      tags: ['depression', 'mental health', 'coping strategies', 'awareness'],
      rating: 4.9,
      views: 3102
    },
    {
      id: '15',
      title: 'Healthy Boundaries in College Life',
      type: 'video',
      category: 'relationships',
      duration: '24 min',
      description: 'Learn how to set and maintain healthy boundaries in academic, social, and personal situations.',
      tags: ['boundaries', 'self-care', 'assertiveness', 'personal space'],
      rating: 4.6,
      views: 1543
    },
    {
      id: '16',
      title: 'Financial Wellness for Students',
      type: 'video',
      category: 'career',
      duration: '26 min',
      description: 'Practical video guide to managing finances, budgeting, and reducing financial stress as a student.',
      tags: ['financial wellness', 'budgeting', 'money management', 'student finances'],
      rating: 4.5,
      views: 1298
    },
    {
      id: '17',
      title: 'Study Techniques for Better Learning',
      type: 'video',
      category: 'academic_stress',
      duration: '32 min',
      description: 'Evidence-based study methods and learning techniques to improve academic performance and reduce stress.',
      tags: ['study techniques', 'learning', 'memory', 'academic success'],
      rating: 4.8,
      views: 2567
    },
    {
      id: '18',
      title: 'Creating a Healthy Sleep Routine',
      type: 'video',
      category: 'sleep',
      duration: '19 min',
      description: 'Step-by-step guide to establishing healthy sleep habits and creating an optimal sleep environment.',
      tags: ['sleep routine', 'sleep hygiene', 'bedtime habits', 'rest'],
      rating: 4.7,
      views: 1789
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'academic_stress', label: 'Academic Stress', icon: Brain },
    { id: 'anxiety', label: 'Anxiety & Worry', icon: Heart },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'career', label: 'Career & Future', icon: Calendar },
    { id: 'sleep', label: 'Sleep & Rest', icon: Heart },
    { id: 'social', label: 'Social Connection', icon: Users }
  ];

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'pdf': return FileText;
      case 'article': return BookOpen;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'video': return 'text-destructive';
      case 'audio': return 'text-accent';
      case 'pdf': return 'text-warning';
      case 'article': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredResources = mockResources.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-border/50 glass-card">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
              <div className="p-2 rounded-lg bg-success/10">
                <BookOpen className="w-5 h-5 text-success" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Mental Health Resources</h1>
                <p className="text-sm text-muted-foreground">Curated content for student wellness</p>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="flex items-center gap-2">
            <BookOpen className="w-3 h-3" />
            {filteredResources.length} Resources Available
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Search and Filter */}
        <Card className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2 text-sm"
                >
                  <category.icon className="w-3 h-3" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Featured Resources */}
        {selectedCategory === 'all' && searchQuery === '' && (
          <div className="mb-8">
            <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6">
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredResources.map((resource, index) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card p-6 hover:shadow-ambient transition-all cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors`}>
                          <TypeIcon className={`w-6 h-6 ${getTypeColor(resource.type)}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {resource.title}
                            </h3>
                            <Badge variant="secondary" className="ml-2">
                              {resource.type.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-3">
                            {resource.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {resource.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-warning fill-warning" />
                                {resource.rating}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {resource.views.toLocaleString()}
                              </div>
                            </div>
                            
                            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-3 h-3 mr-1" />
                              Access
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-playfair font-semibold text-foreground">
              {selectedCategory === 'all' ? 'All Resources' : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <p className="text-muted-foreground">
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card p-6 hover:shadow-ambient transition-all cursor-pointer group h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10`}>
                        <TypeIcon className={`w-5 h-5 ${getTypeColor(resource.type)}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      {resource.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          {resource.rating}
                        </div>
                      </div>
                      
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity p-2">
                        {resource.type === 'pdf' ? <Download className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <Card className="glass-card p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse different categories
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;