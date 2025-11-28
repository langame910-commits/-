import React from 'react';
import { AuspiciousData } from '../types';
import { Sparkles, Moon, Sun, Clock, Palette, AlertOctagon, ScrollText, Flame } from 'lucide-react';

interface AuspiciousCardProps {
  data: AuspiciousData | null;
  loading: boolean;
  date: Date;
}

const AuspiciousCard: React.FC<AuspiciousCardProps> = ({ data, loading, date }) => {
  const formattedDate = date.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Thai BE Year
  const beYear = date.getFullYear() + 543;
  const formattedDateHeader = `${date.getDate()} ${date.toLocaleDateString('th-TH', { month: 'long' })} พ.ศ. ${beYear}`;

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 space-y-4 bg-white/50 rounded-2xl border border-[#d4af37]/20 shadow-sm animate-pulse">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#8c7851] font-medium">กำลังทำนายดวงชะตา...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 text-center bg-white/50 rounded-2xl border border-gray-200">
        <p className="text-gray-500">เลือกวันที่เพื่อดูรายละเอียดความเป็นสิริมงคล</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#d4af37]/30 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#800000] to-[#a01e1e] text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Sparkles size={120} />
        </div>
        <h2 className="text-2xl font-bold relative z-10">{formattedDateHeader}</h2>
        <p className="text-red-100 mt-1 relative z-10 opacity-90">{data.zodiac}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        
        {/* Lunar Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#fff9e6] p-4 rounded-xl border border-[#d4af37]/20">
            <div className="flex items-center gap-2 mb-2 text-[#b08d55]">
              <Moon size={18} />
              <span className="text-sm font-semibold">ปฏิทินจันทรคติไทย</span>
            </div>
            <p className="text-lg font-bold text-[#5c4d3c]">{data.thaiDate}</p>
            {data.isWanPhra && (
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                วันพระ
              </span>
            )}
          </div>
          <div className="bg-[#fff0f0] p-4 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <Sun size={18} />
              <span className="text-sm font-semibold">ปฏิทินจีน</span>
            </div>
            <p className="text-lg font-bold text-[#800000]">{data.chineseDate}</p>
            <p className="text-sm text-red-700 mt-1">ธาตุ: {data.element}</p>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <h3 className="text-[#5c4d3c] font-bold text-lg flex items-center gap-2">
            <Palette size={20} className="text-[#d4af37]" />
            สีมงคลประจำวัน
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
              <span className="text-green-800 font-medium">สีเสริมดวง</span>
              <span className="text-green-700 font-bold">{data.auspiciousColor}</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-600 font-medium flex items-center gap-1">
                <AlertOctagon size={14} /> กาลกิณี
              </span>
              <span className="text-gray-500 line-through">{data.forbiddenColor}</span>
            </div>
          </div>
        </div>

        {/* Time & Advice */}
        <div className="space-y-4">
           <div className="flex items-start gap-4">
             <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <Clock size={24} />
             </div>
             <div>
               <h4 className="font-bold text-gray-800">ฤกษ์ดีเวลา</h4>
               <p className="text-gray-600">{data.auspiciousTime}</p>
             </div>
           </div>

           <div className="bg-[#fcfbf9] border border-[#e8dfc8] p-4 rounded-xl relative">
              <Flame className="absolute top-4 right-4 text-[#d4af37] opacity-20" size={48} />
              <div className="flex items-center gap-2 mb-2 text-[#d4af37]">
                <ScrollText size={18} />
                <span className="font-bold">คำแนะนำประจำวัน</span>
              </div>
              <p className="text-gray-700 leading-relaxed relative z-10 italic">
                "{data.advice}"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuspiciousCard;