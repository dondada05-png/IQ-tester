import { useState, useEffect } from 'react';
import { Brain, Users, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { DashboardResult } from './types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vtlxbfmepwnhsxjmmsva.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bHhiZm1lcHduaHN4am1tc3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjYxODcsImV4cCI6MjA2NzIwMjE4N30.6DPOWkJIrWHqlE2hSnpI16DmbTZspUZeWUMmDVlhwcE';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function App() {
  const [results, setResults] = useState<DashboardResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'iq'>('date');
  const [statistics, setStatistics] = useState({ totalTests: 0, averageScore: 0, averageIQ: 0, averagePercentage: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to fetch data from Supabase...');
      
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      setResults(data || []);
      // Calculate statistics
      if (data && data.length > 0) {
        const totalTests = data.length;
        const averageScore = data.reduce((sum, r) => sum + (r.score || 0), 0) / totalTests;
        const averageIQ = data.reduce((sum, r) => sum + (r.iq_score || 0), 0) / totalTests;
        const averagePercentage = data.reduce((sum, r) => sum + (r.percentage || 0), 0) / totalTests;
        setStatistics({
          totalTests,
          averageScore: Math.round(averageScore * 10) / 10,
          averageIQ: Math.round(averageIQ * 10) / 10,
          averagePercentage: Math.round(averagePercentage * 10) / 10,
        });
      } else {
        setStatistics({ totalTests: 0, averageScore: 0, averageIQ: 0, averagePercentage: 0 });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load dashboard data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredAndSortedResults = results
    .filter(result => 
      result.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'iq':
          return (b.iq_score || 0) - (a.iq_score || 0);
        default:
          return 0;
      }
    });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor((seconds || 0) / 60);
    const secs = (seconds || 0) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-emerald-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={fetchData} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IQ Tester Dashboard</h1>
                <p className="text-sm text-gray-600">Admin Panel - View all test results</p>
              </div>
            </div>
            <button 
              onClick={fetchData}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalTests}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.averageScore}/10</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="text-purple-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average IQ</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.averageIQ}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="text-orange-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Percentage</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.averagePercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name to search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'iq')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date (Newest)</option>
                <option value="score">Score (Highest)</option>
                <option value="iq">IQ (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Test Results ({filteredAndSortedResults.length})
          </h2>
          {filteredAndSortedResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IQ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {result.score}/{result.total_questions}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPerformanceColor(result.percentage)} bg-opacity-10`}>
                            {result.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.iq_score}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatTime(result.time_spent)}
                          {result.time_expired_count > 0 && (
                            <span className="text-xs text-red-600 ml-1">
                              ({result.time_expired_count} expired)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.created_at?.split('T')[0]}</div>
                        <div className="text-xs text-gray-500">{result.created_at?.split('T')[1]?.slice(0, 8)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 