import React from "react";
import { motion } from "motion/react";

const CalendarWidget = () => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' }).toUpperCase();
  const today = now.getDate();
  
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-[160px] h-[160px] bg-[#1a1c1e]/85 backdrop-blur-2xl border border-white/10 rounded-[32px] p-[18px] flex flex-col shadow-2xl group select-none pointer-events-auto cursor-default overflow-hidden"
    >
      <div className="text-[#ff453a] font-bold text-[10px] tracking-widest mb-3 px-0.5 uppercase">{month}</div>
      <div className="grid grid-cols-7 text-[9px] font-bold text-white/25 mb-2">
        {daysOfWeek.map((d, i) => <div key={i} className="flex justify-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 flex-1">
        {days.map((day, i) => (
          <div key={i} className="flex items-center justify-center relative h-[16px]">
            {day && (
              <>
                {day === today && (
                  <div className="absolute w-[18px] h-[18px] bg-[#ff453a] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg" />
                )}
                <span className={`text-[10px] font-semibold relative z-10 ${day === today ? 'text-white' : 'text-white/80'}`}>
                  {day}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarWidget;
