import { useState, useMemo } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import NewsMap from './components/NewsMap';
import FilterPanel from './components/FilterPanel';
import TimeSlider from './components/TimeSlider';
import InsightsPanel from './components/InsightsPanel';
import { newsData } from './data/newsData';
import {
  filterNewsByDateRange,
  filterNewsByTopic,
  filterNewsBySentiment,
  filterNewsBySearch
} from './utils/dataUtils';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '2025-10-22', end: '2025-10-27' });
  const [colorBy, setColorBy] = useState('topic');
  const [showFilters, setShowFilters] = useState(true);
  const [showInsights, setShowInsights] = useState(true);

  // Apply all filters
  const filteredNews = useMemo(() => {
    let filtered = newsData;
    
    filtered = filterNewsBySearch(filtered, searchTerm);
    filtered = filterNewsByDateRange(filtered, dateRange.start, dateRange.end);
    filtered = filterNewsByTopic(filtered, selectedTopics);
    filtered = filterNewsBySentiment(filtered, selectedSentiments);
    
    return filtered;
  }, [searchTerm, dateRange, selectedTopics, selectedSentiments]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <MapPin size={32} className="text-blue-200" />
            <div>
              <h1 className="text-2xl font-bold">Map My News</h1>
              <p className="text-sm text-blue-100">Visualize Local News Geographically</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters */}
        <div className={`transition-all duration-300 ${showFilters ? 'w-80' : 'w-0'} overflow-hidden`}>
          <div className="h-full overflow-y-auto p-4 bg-gray-50">
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
          className="z-20 bg-white hover:bg-gray-100 shadow-lg p-2 rounded-r-lg self-start mt-4 transition-colors"
          title={showFilters ? 'Hide filters' : 'Show filters'}
        >
          {showFilters ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Map Container */}
        <div className="flex-1 relative">
          <NewsMap
            news={filteredNews}
            colorBy={colorBy}
          />
          
          {/* Stats Overlay */}
          <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg px-4 py-2 z-10">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-blue-600">{filteredNews.length}</span> of{' '}
              <span className="font-bold">{newsData.length}</span> stories
            </p>
          </div>
        </div>

        {/* Toggle Button - Right */}
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="z-20 bg-white hover:bg-gray-100 shadow-lg p-2 rounded-l-lg self-start mt-4 transition-colors"
          title={showInsights ? 'Hide insights' : 'Show insights'}
        >
          {showInsights ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Right Sidebar - Insights */}
        <div className={`transition-all duration-300 ${showInsights ? 'w-80' : 'w-0'} overflow-hidden`}>
          <div className="h-full overflow-y-auto p-4 bg-gray-50">
            <InsightsPanel news={filteredNews} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3 text-center text-sm text-gray-600 z-10">
        <p>
          🗺️ Empowering young people to explore and understand local news through interactive visualization
        </p>
      </footer>
    </div>
  );
}

export default App;
