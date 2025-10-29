import { Search, Filter, Calendar, Tag, Heart } from 'lucide-react';
import { topics, sentiments } from '../data/newsData';

const FilterPanel = ({ 
  searchTerm, 
  onSearchChange, 
  selectedTopics, 
  onTopicChange,
  selectedSentiments,
  onSentimentChange,
  dateRange,
  onDateRangeChange,
  colorBy,
  onColorByChange
}) => {
  const handleTopicToggle = (topicName) => {
    if (selectedTopics.includes(topicName)) {
      onTopicChange(selectedTopics.filter(t => t !== topicName));
    } else {
      onTopicChange([...selectedTopics, topicName]);
    }
  };

  const handleSentimentToggle = (sentiment) => {
    if (selectedSentiments.includes(sentiment)) {
      onSentimentChange(selectedSentiments.filter(s => s !== sentiment));
    } else {
      onSentimentChange([...selectedSentiments, sentiment]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Search</h3>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
        />
      </div>

      {/* Color By */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Color Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onColorByChange('topic')}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              colorBy === 'topic'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Topic
          </button>
          <button
            onClick={() => onColorByChange('sentiment')}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              colorBy === 'sentiment'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sentiment
          </button>
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Date Range</h3>
        <div className="space-y-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Topics */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Topics</h3>
        <div className="flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <button
              key={topic.name}
              onClick={() => handleTopicToggle(topic.name)}
              className={`px-2.5 py-1.5 rounded text-xs font-medium text-white transition-all ${
                selectedTopics.length === 0 || selectedTopics.includes(topic.name)
                  ? 'opacity-100'
                  : 'opacity-40'
              }`}
              style={{
                backgroundColor: topic.color
              }}
            >
              {topic.name}
            </button>
          ))}
        </div>
        {selectedTopics.length > 0 && (
          <button
            onClick={() => onTopicChange([])}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Sentiments */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Sentiment</h3>
        <div className="flex gap-2">
          {Object.entries(sentiments).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleSentimentToggle(key)}
              className={`flex-1 px-3 py-2 rounded text-xs font-medium text-white capitalize transition-all ${
                selectedSentiments.length === 0 || selectedSentiments.includes(key)
                  ? 'opacity-100'
                  : 'opacity-50'
              }`}
              style={{ backgroundColor: value.color }}
            >
              {value.label}
            </button>
          ))}
        </div>
        {selectedSentiments.length > 0 && (
          <button
            onClick={() => onSentimentChange([])}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
