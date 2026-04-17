import React, { useState, useEffect } from "react";
import { Apple } from "lucide-react";
import { motion } from "motion/react";

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center select-none"
    >
      <div className="flex flex-col items-center gap-12 -mt-20">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          src="/apple_logo_white.png" 
          alt="Apple Logo" 
          className="w-[80px] h-[80px] object-contain" 
        />
        
        <div className="w-[200px] h-[4px] bg-[#333333] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2.5, 
              ease: [0.4, 0, 0.2, 1], // Custom smooth ease
              delay: 0.2
            }}
            onAnimationComplete={() => setTimeout(onComplete, 300)}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BootScreen;
