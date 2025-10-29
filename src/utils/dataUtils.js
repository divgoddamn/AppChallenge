import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const filterNewsByDateRange = (news, startDate, endDate) => {
  if (!startDate || !endDate) return news;
  
  return news.filter(article => {
    const articleDate = parseISO(article.date);
    return isWithinInterval(articleDate, {
      start: startOfDay(parseISO(startDate)),
      end: endOfDay(parseISO(endDate))
    });
  });
};

export const filterNewsByTopic = (news, topics) => {
  if (!topics || topics.length === 0) return news;
  return news.filter(article => topics.includes(article.topic));
};

export const filterNewsBySentiment = (news, sentiments) => {
  if (!sentiments || sentiments.length === 0) return news;
  return news.filter(article => sentiments.includes(article.sentiment));
};

export const filterNewsBySearch = (news, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return news;
  
  const term = searchTerm.toLowerCase();
  return news.filter(article => 
    article.headline.toLowerCase().includes(term) ||
    article.summary.toLowerCase().includes(term) ||
    article.source.toLowerCase().includes(term)
  );
};

export const filterNewsByImportance = (news, importanceLevel) => {
  if (!importanceLevel || importanceLevel === 'all') return news;
  if (importanceLevel === 'high+moderate') {
    return news.filter(article => article.importance === 'high' || article.importance === 'moderate');
  }
  if (importanceLevel === 'high') {
    return news.filter(article => article.importance === 'high');
  }
  return news;
};

export const getTopicCounts = (news) => {
  const counts = {};
  news.forEach(article => {
    counts[article.topic] = (counts[article.topic] || 0) + 1;
  });
  return Object.entries(counts).map(([topic, count]) => ({ topic, count }));
};

export const getSentimentCounts = (news) => {
  const counts = { positive: 0, negative: 0, neutral: 0 };
  news.forEach(article => {
    counts[article.sentiment] = (counts[article.sentiment] || 0) + 1;
  });
  return counts;
};

export const getTopStories = (news, limit = 5) => {
  return news
    .filter(article => article.importance === 'high')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const getUnderreportedAreas = (news) => {
  // Group by approximate neighborhood based on coordinates
  const areaCounts = {};
  
  news.forEach(article => {
    const areaKey = `${Math.round(article.lat * 100) / 100},${Math.round(article.lng * 100) / 100}`;
    areaCounts[areaKey] = (areaCounts[areaKey] || 0) + 1;
  });
  
  // Find areas with fewer stories
  const avgCount = Object.values(areaCounts).reduce((a, b) => a + b, 0) / Object.keys(areaCounts).length;
  
  return Object.entries(areaCounts)
    .filter(([, count]) => count < avgCount * 0.5)
    .map(([area, count]) => ({ area, count }));
};

export const getTrendingTopics = (news, days = 7) => {
  const recentNews = news.filter(article => {
    const articleDate = parseISO(article.date);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    return articleDate >= daysAgo;
  });
  
  return getTopicCounts(recentNews)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};
