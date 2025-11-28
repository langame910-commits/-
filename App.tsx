import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Flower } from 'lucide-react';
import CalendarGrid from './components/CalendarGrid';
import AuspiciousCard from './components/AuspiciousCard';
import { fetchAuspiciousData, fetchWanPhraDays } from './services/geminiService';
import { AuspiciousData } from './types';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [auspiciousData, setAuspiciousData] = useState<AuspiciousData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wanPhraDays, setWanPhraDays] = useState<number[]>([]);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    handleDateSelect(today);
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    // If selecting a date in a different month, switch the view
    if (date.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(date);
    }
    
    setLoading(true);
    try {
      const data = await fetchAuspiciousData(date);
      setAuspiciousData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Wan Phra days when month changes
  useEffect(() => {
    const loadWanPhra = async () => {
      const days = await fetchWanPhraDays(currentDate);
      setWanPhraDays(days);
    };
    loadWanPhra();
  }, [currentDate]);

  // Initial load
  useEffect(() => {
    handleDateSelect(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format header date (e.g., มกราคม 2567)
  const thaiMonth = format(currentDate, 'MMMM', { locale: th });
  const thaiYear = currentDate.getFullYear() + 543;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#333] pb-12">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-[#e5e5e5] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#800000] rounded-lg flex items-center justify-center text-white">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#800000] leading-none">ปฏิทินสิริมงคล</h1>
                <p className="text-xs text-gray-500">Thai-Chinese Official Calendar</p>
              </div>
            </div>
            <button 
              onClick={goToToday}
              className="px-4 py-2 bg-[#d4af37] text-white text-sm font-medium rounded-full hover:bg-[#b5952f] transition-colors shadow-sm"
            >
              วันนี้
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Calendar */}
          <div className="flex-grow lg:w-2/3 space-y-6">
            
            {/* Calendar Controls */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800">
                {thaiMonth} <span className="text-[#800000]">Wait, {thaiYear}</span>
                <span className="hidden sm:inline-block text-[#800000] ml-2">({thaiYear})</span>
                {/* Re-rendering logic for proper format: Thai users expect BE */}
                <span className="block sm:hidden text-sm font-normal text-center text-gray-500">พุทธศักราช {thaiYear}</span>
              </h2>
              
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Grid */}
            <CalendarGrid 
              currentDate={currentDate} 
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              wanPhraDays={wanPhraDays}
            />

            {/* Legend / Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div>
                <span>วันนี้</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#800000]"></div>
                <span>วันหยุด</span>
              </div>
               <div className="flex items-center gap-2">
                <Flower size={14} className="text-[#d4af37] fill-[#d4af37]" />
                <span className="font-semibold text-[#8c7851]">วันพระ</span>
              </div>
              <div className="flex items-center gap-2">
                <Info size={14} />
                <span>คลิกเพื่อดูฤกษ์</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:w-1/3 min-h-[500px]">
             <div className="sticky top-24 h-full max-h-[calc(100vh-8rem)]">
               <AuspiciousCard 
                 data={auspiciousData} 
                 loading={loading} 
                 date={selectedDate} 
               />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;