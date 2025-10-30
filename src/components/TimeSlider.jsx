import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';

const TimeSlider = ({ news, onDateChange, dateRange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Get min and max dates from news data
  const dates = news.map(article => article.date).sort();
  const minDate = dates[0] || '2025-10-16';
  const maxDate = '2025-10-29'; // Hardcoded max date
  
  const totalDays = differenceInDays(parseISO(maxDate), parseISO(minDate));

  useEffect(() => {
    if (!currentDate && dateRange.end) {
      setCurrentDate(dateRange.end);
    }
  }, [currentDate, dateRange.end]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDate(prev => {
          const current = parseISO(prev || minDate);
          const next = addDays(current, 1);
          const nextStr = format(next, 'yyyy-MM-dd');
          
          if (nextStr > maxDate) {
            setIsPlaying(false);
            return maxDate;
          }
          
          onDateChange({ start: minDate, end: nextStr });
          return nextStr;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, minDate, maxDate, onDateChange]);

  const handleSliderChange = (e) => {
    const dayOffset = parseInt(e.target.value);
    const newDate = format(addDays(parseISO(minDate), dayOffset), 'yyyy-MM-dd');
    setCurrentDate(newDate);
    onDateChange({ start: minDate, end: newDate });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentDate(minDate);
    onDateChange({ start: minDate, end: minDate });
  };

  const handleSkipToEnd = () => {
    setIsPlaying(false);
    setCurrentDate(maxDate);
    onDateChange({ start: minDate, end: maxDate });
  };

  const currentDayOffset = currentDate 
    ? differenceInDays(parseISO(currentDate), parseISO(minDate))
    : totalDays;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{format(parseISO(minDate), 'MMM d, yyyy')}</span>
          <span className="font-medium text-gray-900">
            {currentDate ? format(parseISO(currentDate), 'MMM d, yyyy') : 'Select date'}
          </span>
          <span>{format(parseISO(maxDate), 'MMM d, yyyy')}</span>
        </div>

        <input
          type="range"
          min="0"
          max={totalDays}
          value={currentDayOffset}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Reset to start"
          >
            <SkipBack size={16} className="text-gray-700" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-2 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <button
            onClick={handleSkipToEnd}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Skip to end"
          >
            <SkipForward size={16} className="text-gray-700" />
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Showing {news.filter(article => article.date <= currentDate).length} of {news.length} stories
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
