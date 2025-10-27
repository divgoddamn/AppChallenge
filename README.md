# Map My News 🗺️📰

An interactive web application that visualizes local news stories geographically on a map, helping young people explore and understand local news through engaging visual storytelling.

## Features

### Core Features ✨

- **Interactive Map Visualization**: News stories displayed as colored markers on an interactive map
- **AI-Generated Summaries**: Short, digestible summaries for each news article
- **Topic Clustering**: Automatic clustering of similar news stories by topic with color-coding
- **Sentiment Analysis**: Visual sentiment indicators (positive, negative, neutral) using colors
- **Timeline Slider**: Explore news trends over time with animated playback
- **Advanced Search & Filters**: Search by keyword and filter by topic, date, sentiment, or region
- **Insights Dashboard**: Interactive charts showing topic distribution, sentiment analysis, and key trends
- **Top Stories Spotlight**: Highlights important and trending news stories

### Visual Design 🎨

- Modern, clean interface built with Tailwind CSS
- Interactive charts using Recharts
- Responsive design for various screen sizes
- Accessibility-focused UI elements
- Collapsible sidebars for maximum map viewing area

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet & React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd map-my-news
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
map-my-news/
├── src/
│   ├── components/
│   │   ├── NewsMap.jsx         # Interactive map component
│   │   ├── FilterPanel.jsx     # Search and filter controls
│   │   ├── TimeSlider.jsx      # Timeline animation component
│   │   └── InsightsPanel.jsx   # Statistics and charts
│   ├── data/
│   │   └── newsData.js         # Sample news dataset
│   ├── utils/
│   │   └── dataUtils.js        # Filtering and analysis functions
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Sample Data

The application comes preloaded with 20 sample news stories from the San Francisco Bay Area, covering topics such as:

- Housing & Development
- Transportation
- Economy & Business
- Public Safety
- Environment
- Education
- Healthcare
- Culture & Community
- Technology
- Infrastructure

Each story includes:
- Headline and summary
- Source and publication date
- Geographic coordinates
- Topic category
- Sentiment (positive/negative/neutral)
- Importance level

## Features in Detail

### Interactive Map
- Click markers to view full article details
- Markers colored by topic or sentiment
- Automatic zoom to fit all visible stories
- Popup displays headline, summary, source, and metadata

### Filters
- **Search**: Find stories by keyword in headline, summary, or source
- **Topics**: Filter by one or more topic categories
- **Sentiment**: Filter by positive, negative, or neutral stories
- **Date Range**: Select custom date ranges
- **Color Mode**: Toggle between topic-based and sentiment-based coloring

### Timeline
- Slide through time to see how stories develop
- Play/pause animation
- Reset to beginning or skip to end
- Shows story count for selected time period

### Insights Panel
- **Top Stories**: Highlights high-importance articles
- **Topic Distribution**: Bar chart of story counts by topic
- **Sentiment Analysis**: Pie chart showing sentiment breakdown
- **Quick Stats**: Key metrics at a glance

## Future Enhancements

- Social media integration (Twitter/X, Reddit, Instagram)
- Heatmap visualization
- Live news API integration
- User authentication and saved preferences
- Custom location selection
- Share and export features
- Mobile app version

## Social Impact

This application aims to:
- Increase civic engagement among young people
- Make local news more accessible and engaging
- Highlight underreported communities and issues
- Promote media literacy through data visualization
- Foster informed community participation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for educational or personal purposes.

## Acknowledgments

- News data is fictional and generated for demonstration purposes
- Map tiles provided by OpenStreetMap contributors
- Built with ❤️ for civic engagement and education
