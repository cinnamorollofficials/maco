import React from 'react';
import { motion } from 'motion/react';

interface HomeIndicatorProps {
  onClick: () => void;
}

const HomeIndicator: React.FC<HomeIndicatorProps> = ({ onClick }) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-[30px] flex items-center justify-center z-[10000] lg:hidden select-none pointer-events-none"
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-32 h-[5px] bg-white/40 rounded-full backdrop-blur-md pointer-events-auto hover:bg-white/60 transition-colors"
        aria-label="Home"
      />
    </div>
  );
};

export default HomeIndicator;
