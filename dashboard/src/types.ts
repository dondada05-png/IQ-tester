export interface DashboardResult {
  id: string;
  name: string;
  score: number;
  total_questions: number;
  iq_score: number;
  percentage: number;
  time_spent: number;
  time_expired_count: number;
  answers: any;
  created_at: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent?: number;
  timeExpired?: boolean;
}

export interface DashboardStatistics {
  totalTests: number;
  averageScore: number;
  averageIQ: number;
  averagePercentage: number;
}

export interface DashboardData {
  results: DashboardResult[];
  statistics: DashboardStatistics;
} 