import { useState, useMemo } from 'react';
import { MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';
import NewsMap from './components/NewsMap';
import FilterPanel from './components/FilterPanel';
import TimeSlider from './components/TimeSlider';
import InsightsPanel from './components/InsightsPanel';
import UserPreferences from './components/UserPreferences';
import { newsData } from './data/newsData';
import {
  filterNewsByDateRange,
  filterNewsByTopic,
  filterNewsBySentiment,
  filterNewsBySearch,
  filterNewsByImportance
} from './utils/dataUtils';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '2025-10-23', end: '2025-10-29' });
  const [colorBy, setColorBy] = useState('topic');
  const [importanceLevel, setImportanceLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [showInsights, setShowInsights] = useState(true);
  const [personalizationMode, setPersonalizationMode] = useState(false);
  const [showUserPreferences, setShowUserPreferences] = useState(false);

  // Hardcoded demo user interests
  const demoUser = {
    interests: ['Healthcare', 'Technology', 'Sports'],
    locations: ['San Francisco', 'Tokyo', 'London']
  };

  // Apply all filters
  const filteredNews = useMemo(() => {
    let filtered = newsData;
    
    filtered = filterNewsBySearch(filtered, searchTerm);
    filtered = filterNewsByDateRange(filtered, dateRange.start, dateRange.end);
    filtered = filterNewsByTopic(filtered, selectedTopics);
    filtered = filterNewsBySentiment(filtered, selectedSentiments);
    filtered = filterNewsByImportance(filtered, importanceLevel);
    
    // Apply personalization filter if mode is on
    if (personalizationMode) {
      filtered = filtered.filter(article => {
        const matchesTopic = demoUser.interests.includes(article.topic);
        return matchesTopic;
      });
    }
    
    return filtered;
  }, [searchTerm, dateRange, selectedTopics, selectedSentiments, importanceLevel, personalizationMode]);

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin size={28} className="text-gray-900" strokeWidth={1.5} />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Map My News</h1>
              <p className="text-xs text-gray-500">Local news visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPersonalizationMode(!personalizationMode)}
              className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                personalizationMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {personalizationMode ? '✓ Personalized for You' : 'All News'}
            </button>
            <button
              onClick={() => setShowUserPreferences(!showUserPreferences)}
              className="p-2 hover:bg-gray-100 rounded transition-colors relative"
              title="User profile"
            >
              <User size={20} className="text-gray-700" />
            </button>
            <UserPreferences isOpen={showUserPreferences} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters */}
        <div className={`transition-all duration-300 ${showFilters ? 'w-72' : 'w-0'} overflow-hidden border-r border-gray-200`}>
          <div className="h-full overflow-y-auto p-6 bg-white">
            <FilterPanel
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTopics={selectedTopics}
              onTopicChange={setSelectedTopics}
              selectedSentiments={selectedSentiments}
              onSentimentChange={setSelectedSentiments}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              colorBy={colorBy}
              onColorByChange={setColorBy}
              importanceLevel={importanceLevel}
              onImportanceLevelChange={setImportanceLevel}
            />
            
            <div className="mt-4">
              <TimeSlider
                news={newsData}
                onDateChange={setDateRange}
                dateRange={dateRange}
              />
            </div>
          </div>
        </div>

        {/* Toggle Button - Left */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="z-20 bg-white hover:bg-gray-100 border border-gray-200 p-2 rounded self-start mt-4 transition-colors"
          title={showFilters ? 'Hide filters' : 'Show filters'}
        >
          {showFilters ? <ChevronLeft size={18} className="text-gray-600" /> : <ChevronRight size={18} className="text-gray-600" />}
        </button>

        {/* Map Container */}
        <div className="flex-1 relative">
          <NewsMap
            news={filteredNews}
            colorBy={colorBy}
            isPersonalized={personalizationMode}
            userInterests={demoUser.interests}
          />
          
          {/* Stats Overlay */}
          <div className="absolute top-4 left-4 bg-white border border-gray-200 rounded px-4 py-2 z-10">
            <p className="text-xs text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredNews.length}</span> of{' '}
              <span className="font-semibold">{newsData.length}</span> stories
            </p>
          </div>
        </div>

        {/* Toggle Button - Right */}
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="z-20 bg-white hover:bg-gray-100 border border-gray-200 p-2 rounded self-start mt-4 transition-colors"
          title={showInsights ? 'Hide insights' : 'Show insights'}
        >
          {showInsights ? <ChevronRight size={18} className="text-gray-600" /> : <ChevronLeft size={18} className="text-gray-600" />}
        </button>

        {/* Right Sidebar - Insights */}
        <div className={`transition-all duration-300 ${showInsights ? 'w-72' : 'w-0'} overflow-hidden border-l border-gray-200`}>
          <div className="h-full overflow-y-auto p-6 bg-white">
            <InsightsPanel news={filteredNews} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-8 py-3 text-center text-xs text-gray-500 z-10">
        <p>Visualizing local news geographically</p>
      </footer>
    </div>
  );
}

export default App;
