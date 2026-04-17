import React from "react";
import { motion } from "motion/react";

const CalendarWidget = () => {
  const now = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayName = days[now.getDay()];
  const dateNum = now.getDate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-[160px] h-[160px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-5 flex flex-col shadow-2xl group select-none pointer-events-auto cursor-default"
    >
      <span className="text-red-500 font-bold text-[13px] tracking-wider mb-1 px-1">{dayName}</span>
      <span className="text-white text-6xl font-extralight tracking-tight px-1 mb-2">{dateNum}</span>
      <div className="mt-auto grid grid-cols-7 gap-1 px-1">
        {[...Array(7)].map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full ${i === now.getDay() ? 'bg-white' : 'bg-white/20'}`} />
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarWidget;
