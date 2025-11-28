import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Flower } from 'lucide-react';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  wanPhraDays: number[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, selectedDate, onSelectDate, wanPhraDays }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 bg-[#800000] text-white">
        {weekDays.map((day, idx) => (
          <div 
            key={day} 
            className={`py-3 text-center text-sm font-semibold ${idx === 0 || idx === 6 ? 'bg-[#900000]' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isTodayDay = isToday(day);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const thaiDateNum = day.getDate();
          
          // Check if it is Wan Phra (only for current month days to ensure accuracy with the fetched list)
          const isWanPhra = isCurrentMonth && wanPhraDays.includes(thaiDateNum);

          return (
            <div
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`
                min-h-[80px] md:min-h-[100px] p-2 border-b border-r border-gray-100 relative cursor-pointer transition-all duration-200 group
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : 'bg-white hover:bg-[#fffdf5]'}
                ${isSelected ? 'ring-2 ring-inset ring-[#d4af37] z-10 bg-[#fffdf0]' : ''}
                ${isWanPhra && isCurrentMonth && !isSelected ? 'bg-yellow-50/50' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <span 
                  className={`
                    text-lg font-medium leading-none z-10
                    ${isTodayDay ? 'bg-[#d4af37] text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md' : ''}
                    ${!isTodayDay && isWeekend && isCurrentMonth ? 'text-red-500' : ''}
                    ${!isTodayDay && !isWeekend && isCurrentMonth ? 'text-gray-700' : ''}
                  `}
                >
                  {thaiDateNum}
                </span>
                
                {/* Wan Phra Indicator */}
                {isWanPhra && (
                  <div className="absolute top-2 right-2 animate-in fade-in zoom-in duration-300">
                    <div className="bg-yellow-100 p-1 rounded-full border border-yellow-200 shadow-sm">
                        <Flower size={14} className="text-[#d4af37] fill-[#d4af37]" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Label for Wan Phra (Visible on larger screens or hover) */}
              {isWanPhra && (
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="hidden md:block text-[10px] font-bold text-[#b5952f] bg-yellow-100/80 rounded-full px-1 py-0.5 w-full truncate">
                    วันพระ
                  </span>
                  {/* Dot for mobile */}
                  <div className="md:hidden mx-auto w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;