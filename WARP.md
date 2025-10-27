# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000 (auto-opens)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint checks
```

### Single Component Development
To work on a specific component in isolation:
1. Modify the component in `src/components/`
2. The dev server will hot-reload automatically
3. Check browser console for any React warnings or errors

## Architecture

### Core Data Flow
The application follows a **top-down, unidirectional data flow** pattern:

1. **App.jsx** is the root component that manages all application state
   - Filter state (search, topics, sentiments, date range, color mode)
   - UI state (sidebar visibility)
   - Applies all filters using `useMemo` to create `filteredNews` array

2. **newsData.js** is the single source of truth for all news data
   - Contains `newsData` array with 20 sample stories
   - Exports `topics` array with colors for each category
   - Exports `sentiments` object with color mappings
   - All coordinates are for San Francisco Bay Area (lat: ~37.7, lng: ~-122.4)

3. **dataUtils.js** contains pure filter functions
   - Each filter function takes news array + criteria, returns filtered array
   - Filters are composable and side-effect free
   - Uses `date-fns` for date range filtering

4. **Component responsibilities**:
   - **NewsMap**: Renders Leaflet map with custom colored markers, handles popups
   - **FilterPanel**: User inputs for search, topics, sentiment, dates, color mode
   - **TimeSlider**: Timeline animation with play/pause controls
   - **InsightsPanel**: Charts and stats using Recharts

### Leaflet Integration
- **Custom markers**: Created via `L.divIcon()` with inline HTML/CSS
- **Marker colors**: Dynamically set based on topic or sentiment
- **Map bounds**: Automatically fit to visible markers using `MapUpdater` component
- **Popup content**: Full article details with topic/sentiment badges

### State Management Pattern
All state lives in `App.jsx` and flows down as props. When adding new filters:
1. Add state variable in `App.jsx` (e.g., `const [newFilter, setNewFilter] = useState(default)`)
2. Create filter function in `dataUtils.js`
3. Apply filter in `useMemo` chain
4. Pass state + setter to relevant component

### Styling System
- **Tailwind CSS**: All component styling
- **Custom colors**: Defined in `tailwind.config.js` (`news-blue`, `news-green`, etc.)
- **Topic/sentiment colors**: Hardcoded in `newsData.js` exports
- **Responsive layout**: Collapsible sidebars with transition animations

## Adding News Stories

When adding or modifying news data in `src/data/newsData.js`:
- Each article requires: `id`, `headline`, `summary`, `source`, `date`, `lat`, `lng`, `topic`, `sentiment`, `importance`
- Date format: `YYYY-MM-DD`
- Coordinates: Use San Francisco Bay Area lat/lng or modify map center in `NewsMap.jsx`
- Topics must match one defined in `topics` array
- Sentiment must be `positive`, `negative`, or `neutral`
- Importance: `high`, `medium`, or `low`

## ESLint Configuration
- React 18+ rules enabled
- PropTypes validation disabled (using plain JS, not TypeScript)
- React Refresh warnings for HMR compatibility
- Run `npm run lint` before committing changes

## Vite Configuration
- Dev server on port 3000, auto-opens browser
- React plugin with Fast Refresh enabled
- No custom build optimizations or aliases configured
