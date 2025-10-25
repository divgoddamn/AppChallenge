// Colors
export const COLORS = {
  primary: '#4F8BF9',      // Main blue
  secondary: '#52C41A',    // Success green
  accent: '#FA8C16',       // Warning orange
  danger: '#F5222D',       // Error red
  light: '#f8f9fa',        // Light gray
  dark: '#212529',         // Dark gray
  text: '#212529',         // Text color
  textLight: '#6c757d',    // Light text
  background: '#ffffff',   // Background
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8000/api',
  RESOURCES: '/resources',
  JOBS: '/jobs',
  CHAT: '/chat',
  RESUME: '/resume',
};

// Resource Types
export const RESOURCE_TYPES = {
  SHELTER: 'shelter',
  FOOD: 'food',
  HEALTH: 'health',
  JOB: 'job',
  EDUCATION: 'education',
  REHAB: 'rehab',
  LEGAL: 'legal',
};

// Filter Options
export const FILTER_OPTIONS = {
  ELIGIBILITY: [
    { key: 'all', label: 'All' },
    { key: 'families', label: 'Families' },
    { key: 'veterans', label: 'Veterans' },
    { key: 'women', label: 'Women' },
    { key: 'men', label: 'Men' },
    { key: 'pets', label: 'Pet-Friendly' },
    { key: 'lgbtq', label: 'LGBTQ+' },
  ],
  DISTANCE: [
    { key: '1', label: 'Within 1 mile' },
    { key: '5', label: 'Within 5 miles' },
    { key: '10', label: 'Within 10 miles' },
    { key: '25', label: 'Within 25 miles' },
  ],
};

// Dimensions
export const DIMENSIONS = {
  borderRadius: 8,
  spacing: 16,
  headerHeight: 60,
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRIES: 3,
};