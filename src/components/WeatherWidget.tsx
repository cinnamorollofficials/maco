import React from "react";
import { motion } from "motion/react";
import { Sun, Cloud } from "lucide-react";

interface WeatherWidgetProps {
  weatherCondition: {
    temp: number;
    condition: string;
  };
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weatherCondition }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ delay: 0.1 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-[160px] h-[160px] bg-blue-600/20 backdrop-blur-2xl border border-white/20 rounded-[32px] p-5 flex flex-col justify-between shadow-2xl group select-none pointer-events-auto cursor-default overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-white font-bold text-[15px] tracking-tight text-shadow-sm">Jakarta</span>
          <span className="text-white/70 text-[12px] font-medium">{weatherCondition.condition}</span>
        </div>
        <div className="relative">
          {weatherCondition.condition === "Sunny" ? (
            <Sun size={24} className="text-yellow-400 fill-yellow-400/30 animate-pulse" />
          ) : (
            <Cloud size={24} className="text-white/60 fill-white/20 animate-pulse" />
          )}
          <div className="absolute inset-0 blur-md bg-yellow-400/20 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-white text-5xl font-extralight tracking-tighter">{weatherCondition.temp}°</span>
        <div className="flex gap-2 mt-1 text-[11px] font-medium text-white/60">
          <span className="flex items-center gap-0.5">H:31°</span>
          <span className="flex items-center gap-0.5">L:24°</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
