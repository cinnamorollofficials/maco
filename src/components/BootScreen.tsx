import React, { useState, useEffect } from "react";
import { Apple } from "lucide-react";
import { motion } from "motion/react";

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 30) {
        currentProgress += Math.random() * 5;
      } else if (currentProgress < 70) {
        currentProgress += Math.random() * 2;
      } else if (currentProgress < 100) {
        currentProgress += Math.random() * 8;
      } else {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center select-none"
    >
      <div className="flex flex-col items-center gap-12 -mt-20">
        <img src="public/apple_logo_white.png" alt="Apple Logo" className="w-[80px] h-[80px] object-contain" />
        
        <div className="w-[200px] h-[4px] bg-[#333333] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BootScreen;
