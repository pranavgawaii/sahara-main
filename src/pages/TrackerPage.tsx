import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar,
  Heart,
  Brain,
  Target,
  Award,
  BarChart3,
  LineChart,
  Download,
  Plus,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

interface MoodEntry {
  date: Date;
  mood: number; // 1-5 scale
  note?: string;
  activities: string[];
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'daily' | 'weekly' | 'monthly';
  category: string;
}

const TrackerPage = () => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { student } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock data for demonstration
  const mockMoodData: MoodEntry[] = [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), mood: 3, activities: ['study', 'exercise'] },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), mood: 4, activities: ['socializing'] },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), mood: 2, activities: ['study'] },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), mood: 4, activities: ['exercise', 'meditation'] },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), mood: 5, activities: ['socializing', 'hobbies'] },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), mood: 3, activities: ['study', 'rest'] },
    { date: new Date(), mood: 4, activities: ['exercise'] }
  ];

  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Daily Meditation',
      target: 7,
      current: 5,
      type: 'weekly',
      category: 'wellness'
    },
    {
      id: '2',
      title: 'Exercise Sessions',
      target: 3,
      current: 2,
      type: 'weekly',
      category: 'fitness'
    },
    {
      id: '3',
      title: 'Social Activities',
      target: 4,
      current: 3,
      type: 'weekly',
      category: 'social'
    },
    {
      id: '4',
      title: 'Sleep 8+ Hours',
      target: 30,
      current: 22,
      type: 'monthly',
      category: 'sleep'
    }
  ];

  const averageMood = mockMoodData.reduce((sum, entry) => sum + entry.mood, 0) / mockMoodData.length;
  const moodTrend = mockMoodData[mockMoodData.length - 1].mood - mockMoodData[0].mood;

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Smile className="w-5 h-5 text-success" />;
    if (mood >= 3) return <Meh className="w-5 h-5 text-warning" />;
    return <Frown className="w-5 h-5 text-destructive" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return 'bg-success';
    if (mood >= 3) return 'bg-warning';
    return 'bg-destructive';
  };

  const getGoalProgress = (goal: Goal) => (goal.current / goal.target) * 100;

  const periods = [
    { id: '7d' as const, label: '7 Days' },
    { id: '30d' as const, label: '30 Days' },
    { id: '90d' as const, label: '90 Days' }
  ];

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
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Wellness Tracker</h1>
                <p className="text-sm text-muted-foreground">Monitor your mental health journey</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {periods.map((period) => (
                <Button
                  key={period.id}
                  variant={selectedPeriod === period.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.id)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Heart className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-bold text-foreground">{averageMood.toFixed(1)}/5</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mood Trend</p>
                <p className={`text-2xl font-bold ${moodTrend >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {moodTrend >= 0 ? '+' : ''}{moodTrend.toFixed(1)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockGoals.filter(g => getGoalProgress(g) >= 100).length}/{mockGoals.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Award className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak Days</p>
                <p className="text-2xl font-bold text-foreground">7</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="mood" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Mood
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mood Chart */}
              <Card className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Mood Over Time
                </h3>
                
                <div className="space-y-4">
                  {mockMoodData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="text-xs text-muted-foreground w-16">
                        {entry.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-8 rounded-full ${getMoodColor(entry.mood)}`} />
                          {getMoodIcon(entry.mood)}
                          <span className="font-medium">{entry.mood}/5</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {entry.activities.map((activity, actIndex) => (
                          <Badge key={actIndex} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Mood Log */}
              <Card className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Log Today's Mood
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">How are you feeling today?</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <Button
                          key={mood}
                          variant="outline"
                          size="sm"
                          className="p-3 h-auto flex-col gap-2"
                        >
                          {getMoodIcon(mood)}
                          <span className="text-xs">{mood}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Activities today:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Exercise', 'Study', 'Social', 'Rest', 'Hobbies', 'Work'].map((activity) => (
                        <Badge key={activity} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full">Save Mood Entry</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockGoals.map((goal) => (
                <Card key={goal.id} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{goal.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {goal.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{goal.current}/{goal.target}</span>
                    </div>
                    
                    <Progress value={getGoalProgress(goal)} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {getGoalProgress(goal).toFixed(0)}% complete
                      </span>
                      
                      <Button size="sm" variant="ghost">
                        <Plus className="w-3 h-3 mr-1" />
                        Log
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Card className="glass-card p-6 border-dashed border-2 border-muted-foreground/30 flex items-center justify-center">
                <div className="text-center">
                  <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-foreground">Add New Goal</p>
                  <p className="text-xs text-muted-foreground">Set a wellness goal to track</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Create Goal
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>



          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Weekly Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2" />
                    <div>
                      <p className="font-medium text-foreground">Improved Sleep Pattern</p>
                      <p className="text-sm text-muted-foreground">You've been more consistent with bedtime this week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                    <div>
                      <p className="font-medium text-foreground">Exercise Goal Behind</p>
                      <p className="text-sm text-muted-foreground">Consider shorter workout sessions to stay consistent</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium text-foreground">Social Activity Boost</p>
                      <p className="text-sm text-muted-foreground">Your mood improves on days with social activities</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="font-medium text-primary">Try Morning Meditation</p>
                    <p className="text-sm text-muted-foreground">Based on your stress patterns</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="font-medium text-accent">Schedule Study Breaks</p>
                    <p className="text-sm text-muted-foreground">To maintain consistent mood levels</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                    <p className="font-medium text-success">Weekend Social Plans</p>
                    <p className="text-sm text-muted-foreground">Your mood peaks with social activities</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrackerPage;