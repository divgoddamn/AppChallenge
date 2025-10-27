# Quick Start Guide 🚀

Welcome to Map My News! Get started in 3 simple steps:

## 1. Start the Development Server

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

## 2. Explore the Features

### Interactive Map
- **Click markers** to view full story details in popups
- **Zoom and pan** to explore different areas of San Francisco
- Markers are color-coded by topic or sentiment

### Filter Panel (Left Sidebar)
- **Search**: Type keywords to find specific stories
- **Color By**: Toggle between topic and sentiment visualization
- **Date Range**: Select start and end dates
- **Topics**: Click to filter by specific topics (Housing, Transportation, etc.)
- **Sentiment**: Filter by positive, negative, or neutral stories

### Timeline Slider
- **Drag slider**: Move through time to see stories chronologically
- **Play button**: Animate timeline automatically (1 day per second)
- **Reset/Skip**: Jump to beginning or end instantly

### Insights Panel (Right Sidebar)
- **Top Stories**: See the most important news
- **Topic Distribution**: Bar chart of story counts
- **Sentiment Analysis**: Pie chart showing overall sentiment
- **Quick Stats**: Key metrics at a glance

### Hide/Show Panels
- Click the **chevron buttons** on either side of the map to collapse/expand sidebars
- This gives you more room to explore the map!

## 3. Try These Examples

### Example 1: Find Housing News
1. In the Filter Panel, click the **"Housing"** topic button (blue)
2. See only housing-related stories on the map
3. Check the Insights Panel to see housing sentiment

### Example 2: Watch News Over Time
1. In the Timeline Slider, click **Reset** (skip back button)
2. Click the **Play** button (center)
3. Watch stories appear day by day on the map

### Example 3: Search for Specific Topics
1. Type **"strike"** in the search box
2. Map filters to show only stories mentioning strikes
3. Click the marker to read the full story

### Example 4: Compare Sentiment
1. Click **"Color By: Sentiment"** in the Filter Panel
2. Map markers change color based on article sentiment:
   - 🟢 Green = Positive news
   - 🔴 Red = Negative news
   - ⚪ Gray = Neutral news

## Keyboard Shortcuts

While focused on the map:
- **+/-**: Zoom in/out
- **Arrow keys**: Pan the map
- **Scroll wheel**: Zoom

## Tips for Best Experience

- **Start with all filters cleared** to see the full dataset
- **Use the timeline** to understand how news develops over time
- **Toggle between topic and sentiment colors** for different insights
- **Collapse sidebars** when you want to focus on the map
- **Click markers** for detailed summaries and metadata

## Next Steps

- Modify `src/data/newsData.js` to add your own news stories
- Customize colors in `tailwind.config.js`
- Adjust the map center and zoom in `src/components/NewsMap.jsx`

## Need Help?

Check out the full `README.md` for:
- Detailed feature documentation
- Project architecture
- API reference
- Contributing guidelines

---

**Happy Exploring! 🗺️📰**
