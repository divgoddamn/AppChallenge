import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { topics, sentiments } from '../data/newsData';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom marker icons based on topic color
const createCustomIcon = (color, sentiment, isPersonalized = false) => {
  const size = sentiment === 'positive' ? 12 : sentiment === 'negative' ? 10 : 11;
  const opacity = sentiment === 'neutral' ? 0.7 : 1;
  const borderColor = isPersonalized ? '#FFD700' : 'white';
  const borderWidth = isPersonalized ? 3 : 2;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: ${borderWidth}px solid ${borderColor};
      box-shadow: 0 2px 4px rgba(0,0,0,0.3)${isPersonalized ? ', 0 0 6px rgba(255,215,0,0.6)' : ''};
      opacity: ${opacity};
    "></div>`,
    iconSize: [size + 4, size + 4],
    iconAnchor: [size / 2 + 2, size / 2 + 2]
  });
};

// Component to update map view when bounds change - only on initial load
const MapUpdater = ({ news }) => {
  const map = useMap();
  const hasInitialized = useState(false)[0];
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Only fit bounds on initial load when news first has data
    if (!initialized && news && news.length > 0) {
      try {
        const bounds = news
          .filter(article => article.lat && article.lng && !isNaN(article.lat) && !isNaN(article.lng))
          .map(article => [article.lat, article.lng]);
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
          setInitialized(true);
        }
      } catch (e) {
        console.error('Error updating map bounds:', e);
      }
    }
  }, [initialized, map]);
  
  return null;
};

const NewsMap = ({ news, onMarkerClick, colorBy = 'topic', isPersonalized = false, userInterests = [] }) => {
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [qaQuestions, setQaQuestions] = useState({});
  const center = [37.7749, -122.4194]; // San Francisco
  
  const isArticlePersonalized = (article) => {
    return userInterests.includes(article.topic);
  };
  
  const getMarkerColor = (article) => {
    if (colorBy === 'sentiment') {
      return sentiments[article.sentiment].color;
    } else {
      const topic = topics.find(t => t.name === article.topic);
      return topic ? topic.color : '#6b7280';
    }
  };
  
  const handleToggleQA = (article) => {
    setExpandedArticleId(expandedArticleId === article.id ? null : article.id);
  };
  
  const handleAskQuestion = async (articleId, question) => {
    if (!question.trim()) return;
    
    const normalizedQuestion = question.toLowerCase().trim();
    const DEMO_QA = {
      "how will this affect low income families": "This SNAP shutdown will have a significant impact on low-income families in New Hampshire. With benefits potentially interrupted on November 1st, families relying on food assistance will face immediate food insecurity. The uncertainty about whether EBT cards will continue functioning creates additional stress. Additionally, the new federal rules that remove certain legal immigrants from the program will disproportionately affect immigrant families. The expansion of work requirements may exclude elderly, disabled, or caregiving individuals. Without WIC support beyond November 7th, pregnant women and young children will be especially vulnerable. Food banks are preparing for increased demand during this transition period.",
      "what are the new federal rules": "Starting November 1st, New Hampshire must implement new federal SNAP rules from the budget reconciliation bill. These include: (1) Removal of certain legal immigrants from the program, affecting mixed-status families; (2) Expanded work requirements, potentially affecting students, elderly, and disabled individuals; (3) Changes to how benefits are calculated, which may reduce monthly assistance amounts. These are nationwide rules, but their specific impact varies by state implementation.",
      "when will this be resolved": "The SNAP program transitions permanently starting November 1st, 2025. This isn't a temporary shutdown - it's a shift to the new federal requirements. However, there's a critical 4-day window before then for residents to use their remaining benefits. The WIC program is secured through at least November 7th, providing some continued support for pregnant women and young children. The permanent implementation means New Hampshire residents should prepare for longer-term adjustments to their benefits.",
    };
    
    let answer = "I can help answer questions about this article. Try asking specific questions about the topic.";
    
    // Check for key phrases (more flexible matching)
    if (normalizedQuestion.includes('low income') || normalizedQuestion.includes('low-income')) {
      answer = DEMO_QA["how will this affect low income families"];
    } else if (normalizedQuestion.includes('federal rules') || normalizedQuestion.includes('new rules')) {
      answer = DEMO_QA["what are the new federal rules"];
    } else if (normalizedQuestion.includes('resolved') || normalizedQuestion.includes('when will')) {
      answer = DEMO_QA["when will this be resolved"];
    }
    
    setQaQuestions(prev => ({
      ...prev,
      [articleId]: { question, answer, loading: false }
    }));
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater news={news} />
      
      {news.map((article) => {
        const isPersonal = isPersonalized && isArticlePersonalized(article);
        return (
        <Marker
          key={article.id}
          position={[article.lat, article.lng]}
          icon={createCustomIcon(getMarkerColor(article), article.sentiment, isPersonal)}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(article)
          }}
        >
          <Popup maxWidth={400}>
            <div className="p-3 max-h-96 overflow-y-auto">
              <h3 className="font-bold text-sm mb-2 text-gray-900">
                {article.headline}
              </h3>
              
              {article.aiOverview && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">AI Overview:</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {article.aiOverview}
                  </p>
                </div>
              )}
              
              {article.summary && !article.aiOverview && (
                <p className="text-xs text-gray-600 mb-2">
                  {article.summary}
                </p>
              )}
              
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-500">{article.date}</span>
                </div>
                
                {article.sourceUrl && (
                  <a 
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline block mb-2"
                  >
                    Read full story →
                  </a>
                )}
                
                <p className="text-xs text-gray-500 mb-2">Source: {article.source}</p>
              </div>
              
              <div className="mt-2 flex gap-2 flex-wrap mb-3">
                <span 
                  className="px-2 py-1 rounded text-xs text-white"
                  style={{ backgroundColor: getMarkerColor(article) }}
                >
                  {article.topic}
                </span>
                {isPersonal && (
                  <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 font-semibold">
                    ★ For You
                  </span>
                )}
              </div>
              
              {/* Q&A Section */}
              <div className="mt-3 pt-2 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleToggleQA(article);
                  }}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition font-medium"
                >
                  {expandedArticleId === article.id ? 'Close Q&A' : 'Ask Question'}
                </button>
                
                {expandedArticleId === article.id && (
                  <div className="mt-3 space-y-3">
                    {qaQuestions[article.id]?.answer ? (
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Q:</p>
                          <p className="text-xs text-gray-600">{qaQuestions[article.id].question}</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-xs font-semibold text-gray-700 mb-1">A:</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{qaQuestions[article.id].answer}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setQaQuestions(prev => ({ ...prev, [article.id]: undefined }));
                          }}
                          className="w-full px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
                        >
                          Ask Another
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Type your question..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.stopPropagation();
                            handleAskQuestion(article.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      );
      })}
    </MapContainer>
  );
};

export default NewsMap;
