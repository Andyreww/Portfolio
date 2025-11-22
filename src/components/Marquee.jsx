import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ items, repeat = 4, reverse = false, duration = 60 }) => {
  const animation = React.useMemo(
    () => ({ x: reverse ? ["-100%", "0%"] : ["0%", "-100%"] }),
    [reverse]
  );

  const transition = React.useMemo(
    () => ({
      duration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    }),
    [duration]
  );

  const renderTrack = () =>
    [...Array(repeat)].map((_, repeatIndex) => (
      <React.Fragment key={`repeat-${repeatIndex}`}>
        {items.map((item, itemIndex) => (
          <div key={`${item}-${repeatIndex}-${itemIndex}`} className="flex items-center">
            <span className="text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter whitespace-nowrap">
              {item}
            </span>
            <span className="text-6xl md:text-8xl font-display font-extrabold uppercase text-transparent stroke-text opacity-50 mx-8 md:mx-16">
              /
            </span>
          </div>
        ))}
      </React.Fragment>
    ));

  return (
    <div className="relative flex overflow-hidden py-4 bg-black text-white select-none border-y-2 border-black">
      <motion.div
        className="flex shrink-0"
        animate={animation}
        transition={transition}
        style={{ willChange: "transform" }}
      >
        {renderTrack()}
      </motion.div>

      <motion.div
        className="flex shrink-0"
        animate={animation}
        transition={transition}
        style={{ willChange: "transform" }}
      >
        {renderTrack()}
      </motion.div>
    </div>
  );
};

export default React.memo(Marquee);