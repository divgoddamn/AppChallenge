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
    <div className="bg-white shadow-lg rounded-lg p-4 space-y-4">
      {/* Search */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Search size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Search</h3>
        </div>
        <input
          type="text"
          placeholder="Search headlines, summaries..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Color By */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Filter size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Color By</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onColorByChange('topic')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              colorBy === 'topic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Topic
          </button>
          <button
            onClick={() => onColorByChange('sentiment')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              colorBy === 'sentiment'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sentiment
          </button>
        </div>
      </div>

      {/* Date Range */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Date Range</h3>
        </div>
        <div className="space-y-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Topics */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Tag size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.name}
              onClick={() => handleTopicToggle(topic.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedTopics.length === 0 || selectedTopics.includes(topic.name)
                  ? 'text-white'
                  : 'opacity-40 text-white'
              }`}
              style={{ 
                backgroundColor: topic.color,
                border: selectedTopics.includes(topic.name) ? '2px solid #1f2937' : '2px solid transparent'
              }}
            >
              {topic.name}
            </button>
          ))}
        </div>
        {selectedTopics.length > 0 && (
          <button
            onClick={() => onTopicChange([])}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sentiments */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Heart size={16} className="text-gray-400" />
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Sentiment</h3>
        </div>
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
