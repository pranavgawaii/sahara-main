import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Heart, 
  Shield, 
  Calendar, 
  BarChart3,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface AssessmentHistory {
  date: Date;
  phq9Score: number;
  gad7Score: number;
  depressionLevel: string;
  anxietyLevel: string;
}

interface StatsDashboardProps {
  currentAssessment: {
    phq9Score: number;
    gad7Score: number;
    depressionLevel: string;
    anxietyLevel: string;
  };
  history?: AssessmentHistory[];
}

const SEVERITY_COLORS = {
  "Minimal depression": "bg-green-100 text-green-800 border-green-200",
  "Mild depression": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Moderate depression": "bg-orange-100 text-orange-800 border-orange-200",
  "Moderately severe depression": "bg-red-100 text-red-800 border-red-200",
  "Severe depression": "bg-red-200 text-red-900 border-red-300",
  "Minimal anxiety": "bg-green-100 text-green-800 border-green-200",
  "Mild anxiety": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Moderate anxiety": "bg-orange-100 text-orange-800 border-orange-200",
  "Severe anxiety": "bg-red-100 text-red-800 border-red-200"
};

const SCORE_INTERPRETATIONS = {
  phq9: {
    ranges: [
      { min: 0, max: 4, level: "Minimal", color: "text-green-600", bgColor: "bg-green-50" },
      { min: 5, max: 9, level: "Mild", color: "text-yellow-600", bgColor: "bg-yellow-50" },
      { min: 10, max: 14, level: "Moderate", color: "text-orange-600", bgColor: "bg-orange-50" },
      { min: 15, max: 19, level: "Moderately Severe", color: "text-red-600", bgColor: "bg-red-50" },
      { min: 20, max: 27, level: "Severe", color: "text-red-800", bgColor: "bg-red-100" }
    ]
  },
  gad7: {
    ranges: [
      { min: 0, max: 4, level: "Minimal", color: "text-green-600", bgColor: "bg-green-50" },
      { min: 5, max: 9, level: "Mild", color: "text-yellow-600", bgColor: "bg-yellow-50" },
      { min: 10, max: 14, level: "Moderate", color: "text-orange-600", bgColor: "bg-orange-50" },
      { min: 15, max: 21, level: "Severe", color: "text-red-600", bgColor: "bg-red-50" }
    ]
  }
};

export const StatsDashboard = ({ currentAssessment, history = [] }: StatsDashboardProps) => {
  const [animatedScores, setAnimatedScores] = useState({ phq9: 0, gad7: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores({
        phq9: currentAssessment.phq9Score,
        gad7: currentAssessment.gad7Score
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [currentAssessment]);

  const getScoreInterpretation = (score: number, type: 'phq9' | 'gad7') => {
    const ranges = SCORE_INTERPRETATIONS[type].ranges;
    return ranges.find(range => score >= range.min && score <= range.max) || ranges[0];
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-gray-500" />;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendText = (current: number, previous?: number) => {
    if (!previous) return "No previous data";
    const diff = current - previous;
    if (diff > 0) return `+${diff} from last assessment`;
    if (diff < 0) return `${diff} from last assessment`;
    return "No change from last assessment";
  };

  const getOverallRiskLevel = () => {
    const { phq9Score, gad7Score } = currentAssessment;
    if (phq9Score >= 20 || gad7Score >= 15) return { level: "High", color: "text-red-600", bgColor: "bg-red-50", icon: AlertTriangle };
    if (phq9Score >= 15 || gad7Score >= 10) return { level: "Moderate", color: "text-orange-600", bgColor: "bg-orange-50", icon: Info };
    if (phq9Score >= 10 || gad7Score >= 5) return { level: "Mild", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Info };
    return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle };
  };

  const previousAssessment = history.length > 0 ? history[history.length - 1] : undefined;
  const phq9Interpretation = getScoreInterpretation(currentAssessment.phq9Score, 'phq9');
  const gad7Interpretation = getScoreInterpretation(currentAssessment.gad7Score, 'gad7');
  const overallRisk = getOverallRiskLevel();
  const RiskIcon = overallRisk.icon;

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <Card className={`p-6 border-2 ${overallRisk.bgColor}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${overallRisk.bgColor}`}>
            <RiskIcon className={`w-8 h-8 ${overallRisk.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">Overall Risk Level</h3>
            <p className={`text-lg font-semibold ${overallRisk.color}`}>{overallRisk.level} Risk</p>
            <p className="text-sm text-muted-foreground">
              Based on your current PHQ-9 and GAD-7 scores
            </p>
          </div>
          {history.length > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                {getTrendIcon(
                  currentAssessment.phq9Score + currentAssessment.gad7Score,
                  previousAssessment ? previousAssessment.phq9Score + previousAssessment.gad7Score : undefined
                )}
                <span className="text-sm font-medium">Trend</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getTrendText(
                  currentAssessment.phq9Score + currentAssessment.gad7Score,
                  previousAssessment ? previousAssessment.phq9Score + previousAssessment.gad7Score : undefined
                )}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* PHQ-9 Depression Score */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Depression Assessment</h3>
              <p className="text-sm text-muted-foreground">PHQ-9 Score</p>
            </div>
            {previousAssessment && (
              <div className="text-right">
                {getTrendIcon(currentAssessment.phq9Score, previousAssessment.phq9Score)}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">
                {animatedScores.phq9}
              </span>
              <Badge className={phq9Interpretation.bgColor + " " + phq9Interpretation.color}>
                {phq9Interpretation.level}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score Range</span>
                <span className="font-mono">{animatedScores.phq9}/27</span>
              </div>
              <Progress 
                value={(animatedScores.phq9 / 27) * 100} 
                className="h-3"
              />
            </div>

            <div className={`p-3 rounded-lg ${phq9Interpretation.bgColor}`}>
              <p className={`text-sm font-medium ${phq9Interpretation.color}`}>
                {currentAssessment.depressionLevel}
              </p>
              {previousAssessment && (
                <p className="text-xs text-muted-foreground mt-1">
                  {getTrendText(currentAssessment.phq9Score, previousAssessment.phq9Score)}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* GAD-7 Anxiety Score */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Anxiety Assessment</h3>
              <p className="text-sm text-muted-foreground">GAD-7 Score</p>
            </div>
            {previousAssessment && (
              <div className="text-right">
                {getTrendIcon(currentAssessment.gad7Score, previousAssessment.gad7Score)}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">
                {animatedScores.gad7}
              </span>
              <Badge className={gad7Interpretation.bgColor + " " + gad7Interpretation.color}>
                {gad7Interpretation.level}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score Range</span>
                <span className="font-mono">{animatedScores.gad7}/21</span>
              </div>
              <Progress 
                value={(animatedScores.gad7 / 21) * 100} 
                className="h-3"
              />
            </div>

            <div className={`p-3 rounded-lg ${gad7Interpretation.bgColor}`}>
              <p className={`text-sm font-medium ${gad7Interpretation.color}`}>
                {currentAssessment.anxietyLevel}
              </p>
              {previousAssessment && (
                <p className="text-xs text-muted-foreground mt-1">
                  {getTrendText(currentAssessment.gad7Score, previousAssessment.gad7Score)}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Historical Trend */}
      {history.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Assessment History
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-blue-50">
                <p className="text-sm text-muted-foreground mb-1">Total Assessments</p>
                <p className="text-2xl font-bold text-blue-600">{history.length + 1}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50">
                <p className="text-sm text-muted-foreground mb-1">Days Tracked</p>
                <p className="text-2xl font-bold text-green-600">
                  {history.length > 0 
                    ? Math.ceil((new Date().getTime() - history[0].date.getTime()) / (1000 * 60 * 60 * 24))
                    : 1
                  }
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50">
                <p className="text-sm text-muted-foreground mb-1">Avg. Combined Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    (history.reduce((sum, h) => sum + h.phq9Score + h.gad7Score, 0) + 
                     currentAssessment.phq9Score + currentAssessment.gad7Score) / 
                    (history.length + 1)
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Recent Assessments</h4>
              <div className="space-y-2">
                {/* Current Assessment */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border-2 border-primary/20">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">Today (Current)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">PHQ-9</p>
                      <p className="font-bold text-blue-600">{currentAssessment.phq9Score}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">GAD-7</p>
                      <p className="font-bold text-green-600">{currentAssessment.gad7Score}</p>
                    </div>
                    <Badge className={SEVERITY_COLORS[currentAssessment.depressionLevel as keyof typeof SEVERITY_COLORS]}>
                      {overallRisk.level}
                    </Badge>
                  </div>
                </div>

                {/* Previous Assessments */}
                {history.slice(-3).reverse().map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {assessment.date.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">PHQ-9</p>
                        <p className="font-medium text-blue-600">{assessment.phq9Score}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">GAD-7</p>
                        <p className="font-medium text-green-600">{assessment.gad7Score}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assessment.depressionLevel.split(' ')[0]} / {assessment.anxietyLevel.split(' ')[0]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Score Interpretation Guide */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Understanding Your Scores
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">PHQ-9 Depression Scale</h4>
            <div className="space-y-2">
              {SCORE_INTERPRETATIONS.phq9.ranges.map((range, index) => (
                <div key={index} className={`p-2 rounded text-sm ${range.bgColor}`}>
                  <div className="flex justify-between">
                    <span className={range.color}>{range.level}</span>
                    <span className="font-mono text-xs">{range.min}-{range.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-3">GAD-7 Anxiety Scale</h4>
            <div className="space-y-2">
              {SCORE_INTERPRETATIONS.gad7.ranges.map((range, index) => (
                <div key={index} className={`p-2 rounded text-sm ${range.bgColor}`}>
                  <div className="flex justify-between">
                    <span className={range.color}>{range.level}</span>
                    <span className="font-mono text-xs">{range.min}-{range.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};