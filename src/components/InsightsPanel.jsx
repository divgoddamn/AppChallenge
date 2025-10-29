import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Newspaper, AlertTriangle } from 'lucide-react';
import { getTopicCounts, getSentimentCounts, getTopStories } from '../utils/dataUtils';
import { topics, sentiments } from '../data/newsData';

const InsightsPanel = ({ news }) => {
  const topicCounts = getTopicCounts(news);
  const sentimentCounts = getSentimentCounts(news);
  const topStories = getTopStories(news, 3);

  // Prepare data for charts
  const topicChartData = topicCounts.map(item => {
    const topic = topics.find(t => t.name === item.topic);
    return {
      name: item.topic,
      value: item.count,
      color: topic?.color || '#6b7280'
    };
  }).sort((a, b) => b.value - a.value).slice(0, 8);

  const sentimentChartData = [
    { name: 'Positive', value: sentimentCounts.positive, color: sentiments.positive.color },
    { name: 'Negative', value: sentimentCounts.negative, color: sentiments.negative.color },
    { name: 'Neutral', value: sentimentCounts.neutral, color: sentiments.neutral.color }
  ];

  return (
    <div className="space-y-4">
      {/* Top Stories */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-800">Top Stories</h3>
        </div>
        <div className="space-y-3">
          {topStories.map((story) => (
            <div key={story.id} className="border-l-4 pl-3 py-1" style={{ borderColor: topics.find(t => t.name === story.topic)?.color || '#6b7280' }}>
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                {story.headline}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {story.source} • {story.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Distribution */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={20} className="text-green-600" />
          <h3 className="font-semibold text-gray-800">Topic Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topicChartData}>
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {topicChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {topicChartData.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={20} className="text-amber-600" />
          <h3 className="font-semibold text-gray-800">Sentiment Analysis</h3>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={sentimentChartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {sentimentChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {sentimentChartData.map((item) => (
            <div key={item.name} className="text-xs">
              <div className="font-semibold text-lg" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-gray-600">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Stories:</span>
            <span className="font-semibold text-gray-900">{news.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">High Importance:</span>
            <span className="font-semibold text-gray-900">
              {news.filter(n => n.importance === 'high').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Most Covered Topic:</span>
            <span className="font-semibold text-gray-900">
              {topicChartData[0]?.name || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Positive Rate:</span>
            <span className="font-semibold text-green-600">
              {news.length > 0 ? Math.round((sentimentCounts.positive / news.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
