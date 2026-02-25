import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

export default function DateRangePicker({ onDateChange }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      key: 'selection'
    }
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    if (onDateChange) {
      onDateChange({
        checkIn: format(ranges.selection.startDate, 'yyyy-MM-dd'),
        checkOut: format(ranges.selection.endDate, 'yyyy-MM-dd')
      });
    }
  };

  const formatDate = (date) => {
    return format(date, 'dd MMM');
  };

  return (
    <div className="relative flex-1 min-w-[280px]">
      <div 
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center justify-between gap-2 bg-white/10 border border-white/20 px-3 py-2.5 rounded-sm cursor-pointer hover:border-turmeric transition-colors h-[42px]"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1">
            <div className="text-turmeric text-[0.6rem] tracking-widest uppercase font-hind leading-none mb-0.5">
              Check-in
            </div>
            <div className="text-white text-sm font-hind leading-none">
              {formatDate(dateRange[0].startDate)}
            </div>
          </div>
          <div className="text-white/40 text-xs">→</div>
          <div className="flex-1">
            <div className="text-turmeric text-[0.6rem] tracking-widest uppercase font-hind leading-none mb-0.5">
              Check-out
            </div>
            <div className="text-white text-sm font-hind leading-none">
              {formatDate(dateRange[0].endDate)}
            </div>
          </div>
        </div>
        <div className="text-white text-lg">📅</div>
      </div>

      {showCalendar && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowCalendar(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-sm shadow-2xl">
            <DateRange
              ranges={dateRange}
              onChange={handleSelect}
              months={2}
              direction="horizontal"
              minDate={new Date()}
              rangeColors={['#E8721C']}
              className="rounded-sm"
            />
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-sm font-hind bg-gray-200 hover:bg-gray-300 rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-sm font-hind bg-saffron text-white hover:bg-saf-dark rounded-sm transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
