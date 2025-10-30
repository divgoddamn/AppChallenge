import React from 'react';
import { User, Heart, MapPin } from 'lucide-react';

export default function UserPreferences({ isOpen }) {
  // Hardcoded demo user profile
  const demoUser = {
    name: 'Alex Chen',
    interests: ['Healthcare', 'Technology', 'Environment'],
    locations: ['San Francisco', 'Tokyo', 'London'],
    savedArticles: 12
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 w-64 bg-white rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <User size={20} className="text-blue-600" />
        <div>
          <h3 className="font-semibold text-gray-900">{demoUser.name}</h3>
          <p className="text-xs text-gray-500">Demo Profile</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Heart size={16} className="text-red-500" />
          Interests
        </h4>
        <div className="flex flex-wrap gap-2">
          {demoUser.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <MapPin size={16} className="text-green-600" />
          Preferred Locations
        </h4>
        <div className="flex flex-wrap gap-2">
          {demoUser.locations.map((location) => (
            <span
              key={location}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
            >
              {location}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{demoUser.savedArticles}</span> articles saved for later
        </p>
      </div>
    </div>
  );
}