import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { topics, sentiments } from '../data/newsData';
import ArticleQAModal from './ArticleQAModal';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom marker icons based on topic color
const createCustomIcon = (color, sentiment) => {
  const size = sentiment === 'positive' ? 12 : sentiment === 'negative' ? 10 : 11;
  const opacity = sentiment === 'neutral' ? 0.7 : 1;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      opacity: ${opacity};
    "></div>`,
    iconSize: [size + 4, size + 4],
    iconAnchor: [size / 2 + 2, size / 2 + 2]
  });
};

// Component to update map view when bounds change
const MapUpdater = ({ news }) => {
  const map = useMap();
  
  useEffect(() => {
    if (news && news.length > 0) {
      try {
        const bounds = news
          .filter(article => article.lat && article.lng && !isNaN(article.lat) && !isNaN(article.lng))
          .map(article => [article.lat, article.lng]);
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (e) {
        console.error('Error updating map bounds:', e);
      }
    }
  }, [news, map]);
  
  return null;
};

const NewsMap = ({ news, onMarkerClick, colorBy = 'topic' }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const center = [37.7749, -122.4194]; // San Francisco
  
  const getMarkerColor = (article) => {
    if (colorBy === 'sentiment') {
      return sentiments[article.sentiment].color;
    } else {
      const topic = topics.find(t => t.name === article.topic);
      return topic ? topic.color : '#6b7280';
    }
  };
  
  const handleOpenQAModal = (article) => {
    setSelectedArticle(article);
    setIsQAModalOpen(true);
  };
  
  const handleCloseQAModal = () => {
    setIsQAModalOpen(false);
    setSelectedArticle(null);
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
      
      {news.map((article) => (
        <Marker
          key={article.id}
          position={[article.lat, article.lng]}
          icon={createCustomIcon(getMarkerColor(article), article.sentiment)}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(article)
          }}
        >
          <Popup maxWidth={350}>
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
                <span 
                  className="px-2 py-1 rounded text-xs text-white capitalize"
                  style={{ backgroundColor: sentiments[article.sentiment].color }}
                >
                  {article.sentiment}
                </span>
              </div>
              
              <button
                onClick={() => handleOpenQAModal(article)}
                className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition font-medium"
              >
                Ask a Question
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <ArticleQAModal 
        isOpen={isQAModalOpen}
        onClose={handleCloseQAModal}
        article={selectedArticle}
      />
    </MapContainer>
  );
};

export default NewsMap;
