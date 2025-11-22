import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TERMINAL_STEPS = [
  { text: '> INITIALIZING SYSTEM...', delay: 280 },
  { text: '> LOADING FONTS...', delay: 320 },
  { text: '> LOADING ASSETS...', delay: 360 },
  { text: '> READY', delay: 420 },
];

const FINAL_STEP_INDEX = TERMINAL_STEPS.length - 1;
const LOOPING_MAX_STEP = FINAL_STEP_INDEX - 1;
const TYPING_INTERVAL_MS = 28;
const EXIT_DELAY_MS = 420;
const FALLBACK_FORCE_FINISH_MS = 8000;

const Preloader = ({ onComplete, forceFinish = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [allowExit, setAllowExit] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    setAllowExit(forceFinish);
  }, [forceFinish]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setAllowExit(true);
    }, FALLBACK_FORCE_FINISH_MS);

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (allowExit && currentStep < FINAL_STEP_INDEX) {
      setCurrentStep(FINAL_STEP_INDEX);
    }
  }, [allowExit, currentStep]);

  useEffect(() => {
    if (currentStep >= TERMINAL_STEPS.length) {
      setIsComplete(true);
      const exitTimer = setTimeout(() => {
        onComplete?.();
      }, EXIT_DELAY_MS);
      return () => clearTimeout(exitTimer);
    }

    const step = TERMINAL_STEPS[currentStep] ?? TERMINAL_STEPS[0];
    const fullText = step.text;
    const pauseAfter = step.delay ?? 260;

    setDisplayText('');
    let charIndex = 0;
    let nextStepTimeout;

    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, charIndex));
        charIndex += 1;
      } else {
        clearInterval(typingInterval);
        nextStepTimeout = setTimeout(() => {
          setCurrentStep((prev) => {
            const tentative = prev + 1;
            if (!allowExit && tentative > LOOPING_MAX_STEP) {
              return 0;
            }
            return tentative;
          });
        }, pauseAfter);
      }
    }, TYPING_INTERVAL_MS);

    return () => {
      clearInterval(typingInterval);
      if (nextStepTimeout) {
        clearTimeout(nextStepTimeout);
      }
    };
  }, [currentStep, allowExit, onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center font-mono"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}
        >
          {/* Terminal-style cursor */}
          <motion.div
            className="flex items-center gap-2 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-base md:text-lg tracking-wider">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block w-[2px] h-4 md:h-5 bg-white ml-1 align-middle"
              />
            </span>
          </motion.div>

          {/* Subtle terminal scanline effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            animate={{
              backgroundPosition: ['0% 0%', '0% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
              )`,
              backgroundSize: '100% 4px',
            }}
          />

          {/* Subtle terminal noise/texture overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.015 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

