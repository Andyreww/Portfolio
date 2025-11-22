import React from 'react';
import { motion } from 'framer-motion';
import Dock from './Dock';

const itemVariants = {
  hidden: { 
    y: 100,             
    opacity: 0, 
    filter: "blur(15px)" 
  },
  show: (delay = 0) => ({ 
    y: 0, 
    opacity: 1, 
    filter: "blur(0px)", 
    transition: {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1] 
    }
  })
};

const buildBaseDelay = 0.2;

const letterVariants = {
  hidden: { opacity: 0, y: '120%', rotateX: 80, filter: 'blur(8px)' },
  show: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      delay: buildBaseDelay + i * 0.04,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }
  })
};

const buildOverlayVariants = {
  hidden: { scaleY: 1, opacity: 1, transformOrigin: 'bottom center' },
  show: (i) => ({
    scaleY: 0,
    opacity: 0,
    transformOrigin: 'bottom center',
    transition: {
      delay: buildBaseDelay + 0.1 + i * 0.06,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  })
};

const buildLetters = ['B','U','I','L','D'];

export default function Hero({ showDock, isMobile, isCompact }) {
  const [canShowDock, setCanShowDock] = React.useState(false);
  const [hasAnimatedDock, setHasAnimatedDock] = React.useState(false);

  React.useEffect(() => {
    // Wait for title animation to complete (approx 1.5s now)
    const timer = setTimeout(() => {
      setCanShowDock(true);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Track if the dock has been shown and animated
  React.useEffect(() => {
    if (canShowDock && showDock && isCompact && !hasAnimatedDock) {
      const timer = setTimeout(() => {
        setHasAnimatedDock(true);
      }, 2000); // Wait for the full dock animation to complete
      return () => clearTimeout(timer);
    }
  }, [canShowDock, showDock, isCompact, hasAnimatedDock]);

  const handleScroll = () => {
    const projectSection = document.getElementById('projects');
    if (projectSection) {
      projectSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" data-tab-section className="min-h-[100dvh] w-full flex flex-col justify-between bg-[#f4f4f0] px-4 py-6 md:p-12 relative overflow-hidden">

      {/* Ambient animated layers inspired by React Bits */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          aria-hidden
          initial={{ opacity: 0.2, scale: 0.95 }}
          animate={{ opacity: 0.45, scale: 1.08, x: -35, y: -25 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-[-28%] left-[-25%] md:top-[-15%] md:left-[-5%] w-[95vw] md:w-[50vw] h-[95vw] md:h-[50vw] min-w-[260px] min-h-[260px] rounded-[45%] blur-[150px]"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,138,5,0.62), transparent 65%)' }}
        />

        <motion.div
          aria-hidden
          initial={{ opacity: 0.25, rotate: 6 }}
          animate={{ opacity: 0.45, rotate: -8, x: 35, y: 55 }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute bottom-[-30%] right-[-30%] md:bottom-[-20%] md:right-[-10%] w-[105vw] md:w-[55vw] h-[105vw] md:h-[55vw] min-w-[280px] min-h-[280px] rounded-[40%] blur-[160px]"
          style={{ background: 'radial-gradient(circle at 70% 30%, rgba(8,168,138,0.6), transparent 60%)' }}
        />

        <motion.div
          aria-hidden
          initial={{ opacity: 0.05, scale: 0.85 }}
          animate={{ opacity: 0.3, scale: 1, x: [0, 20, -15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_55%)] mix-blend-multiply" />
        </motion.div>
      </div>
      
      {/* Top Bar */}
      <div className="flex justify-between items-start uppercase text-xs md:text-sm font-medium tracking-wide border-b-2 border-black pb-4 z-10">
        <span>Andrew Angulo</span>
        <span>Based in NY</span>
        <span className="hidden md:inline">Available for Work</span>
      </div>

      {/* Center Content: Title */}
      <div className="flex-grow flex flex-col justify-center items-center z-10 pointer-events-none w-full">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full px-2 md:px-0 text-[clamp(2.75rem,15vw,7.5rem)] md:text-[12vw] leading-[0.82] md:leading-[0.8] font-display font-black uppercase text-center tracking-tighter mix-blend-difference flex flex-col items-center"
        >
          <motion.span 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            custom={0}
          >
            Dream
          </motion.span>
          
          <span 
            className="text-transparent flex gap-[0.15em]" 
            style={{ WebkitTextStroke: '2px black' }}
          >
            {buildLetters.map((letter, idx) => (
              <span 
                key={`${letter}-${idx}`}
                className="relative inline-block leading-none overflow-hidden"
              >
                <motion.span
                  custom={idx}
                  initial="hidden"
                  animate="show"
                  variants={letterVariants}
                  className="inline-block"
                >
                  {letter}
                </motion.span>

                <motion.span
                  custom={idx}
                  initial="hidden"
                  animate="show"
                  variants={buildOverlayVariants}
                  className="pointer-events-none absolute inset-0 border border-black/40 rounded-[2px]"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, rgba(0,0,0,0.12) 0.5px, transparent 0.5px),
                      linear-gradient(180deg, rgba(0,0,0,0.12) 0.5px, transparent 0.5px)
                    `,
                    backgroundSize: '12px 12px',
                    mixBlendMode: 'multiply'
                  }}
                />
              </span>
            ))}
          </span>
          
          <motion.span 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            custom={0.8}
          >
            Play
          </motion.span>
        </motion.h1>
      </div>

      {/* Bottom Group: Dock + Info */}
      <div className="w-full z-10 flex flex-col">
        {/* Dock for Mobile */}
        {showDock && (
          <div className="w-full flex justify-center pb-6">
             {canShowDock ? (
                <Dock 
                  key="visible"
                  layoutId="shared-dock" 
                  animateIn={!hasAnimatedDock}
                  isMobile={isCompact}
                  className={`relative w-full flex justify-center pointer-events-none max-w-[min(720px,95vw)] ${isCompact ? 'translate-y-2' : ''}`}
                />
             ) : (
                <div className="h-[64px] w-full" />
             )}
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t-2 border-black pt-6 md:pt-4 mb-12 md:mb-0">
          
          <div className="max-w-md text-base md:text-lg font-medium leading-snug">
            I build digital experiences that bridge the gap between <span className="underline decoration-2">functionality</span> and <span className="italic font-serif">art</span>.
          </div>
          
          <motion.button 
            onClick={handleScroll}
            whileHover={{ scale: 1.05, backgroundColor: "#000000", color: "#ffffff" }}
            whileTap={{ scale: 0.95, backgroundColor: "#000000", color: "#ffffff" }}
            className="w-full md:w-auto px-8 py-4 border-2 border-black rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-colors bg-[#f4f4f0] hover:!bg-black hover:!text-white active:!bg-black active:!text-white focus:outline-none"
            initial={{ backgroundColor: "#f4f4f0", color: "#000000" }}
          >
            Scroll Down ↓
          </motion.button>
        </div>
      </div>

    </section>
  );
}