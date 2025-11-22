import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Home, 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  FileText,
  Monitor,
  Popcorn 
} from 'lucide-react';
import GlassSurface from './GlassSurface.jsx';

const BASE_WIDTH = 50; 
const MAX_WIDTH = 85;  
const DISTANCE_LIMIT = 200;

// Helper hook
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return false;
    });
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return isMobile;
};

function DockIcon({ 
  mouseX, 
  icon: Icon, 
  label, 
  onClick, 
  href, 
  isMobile, 
  index, 
  animateIcons,
  iconDelayOffset = 0.3,
  iconDelayStep = 0.07
}) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(
    distance, 
    [-DISTANCE_LIMIT, 0, DISTANCE_LIMIT], 
    [BASE_WIDTH, MAX_WIDTH, BASE_WIDTH]
  );

  let width = useSpring(widthSync, { 
    mass: 0.1, 
    stiffness: 120, 
    damping: 25 
  });

  const shouldAnimateIcons = Boolean(animateIcons);
  const initial = shouldAnimateIcons 
    ? { opacity: 0, y: 20, scale: isMobile ? 0.5 : 0.85 } 
    : {};
  const animate = shouldAnimateIcons 
    ? { opacity: 1, y: 0, scale: 1 } 
    : {};
  const transition = shouldAnimateIcons 
    ? { 
        duration: 0.32, 
        ease: [0.2, 0.8, 0.2, 1], 
        delay: iconDelayOffset + (index * iconDelayStep) 
      } 
    : {};

  const iconStyle = isMobile ? { width: 40 } : { width };

  return (
    <motion.div
      ref={ref}
      style={iconStyle}
      className={`aspect-square ${isMobile ? 'rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.18)] ring-1 ring-black/10' : 'rounded-2xl shadow-lg ring-1 ring-white/20'} bg-black text-white flex items-center justify-center relative group cursor-pointer shrink-0`}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      <a 
        href={href} 
        target={href?.startsWith('http') || href?.endsWith('.pdf') ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="w-full h-full flex items-center justify-center"
        onClick={(e) => {
            if (onClick) {
                e.preventDefault();
                onClick(e);
                return;
            }
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const isHome = href === '#' || href === '#home';
                if (isHome) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }}
      >
        <Icon className="w-1/2 h-1/2 stroke-[1.5]" />
      </a>
      
      {!isMobile && (
        <motion.div 
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            whileHover={{ opacity: 1, y: 0, x: "-50%" }}
            className="absolute -top-12 left-1/2 px-3 py-1 bg-black/90 backdrop-blur-md border border-white/10 text-white text-xs font-medium rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50"
        >
            {label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Dock({ 
  className, 
  layoutId, 
  onResumeClick, 
  onContactClick, 
  onAboutClick, 
  onGithubClick, 
  onLinkedinClick, 
  onPopcornClick, 
  onMonitorClick, 
  animateIn = false, 
  animateIcons: animateIconsProp,
  iconDelayOffset = 0.3,
  iconDelayStep = 0.07,
  isMobile: isMobileProp 
}) {
  let mouseX = useMotionValue(Infinity);
  const hookIsMobile = useIsMobile();
  // Use prop if available, else hook
  const isMobile = isMobileProp !== undefined ? isMobileProp : hookIsMobile;
  const shouldAnimateIcons = typeof animateIconsProp === 'boolean' 
    ? animateIconsProp 
    : (isMobile && animateIn);

  const icons = [
    { icon: Home, label: 'Home', href: '#' },
    { 
        icon: Monitor, 
        label: 'System', 
        href: '#projects',
        onClick: onMonitorClick ? onMonitorClick : null
    },
    { 
        icon: User, 
        label: 'About', 
        href: '#about', 
        onClick: onAboutClick ? onAboutClick : null 
    },
    { 
        icon: Popcorn, 
        label: 'Extras', 
        href: '#extras',
        onClick: onPopcornClick ? onPopcornClick : null
    }, 
    { 
        icon: Github, 
        label: 'Terminal', 
        href: 'https://github.com/andyreww/',
        onClick: onGithubClick ? onGithubClick : null
    },
    { 
        icon: Linkedin, 
        label: 'Profile', 
        href: 'https://www.linkedin.com/in/andyrew/',
        onClick: onLinkedinClick ? onLinkedinClick : null
    },
    { 
        icon: FileText, 
        label: 'Resume', 
        href: '/assets/Andrew Angulo Resume 2025F.pdf',
        onClick: onResumeClick ? onResumeClick : null 
    },
    { 
        icon: Mail, 
        label: 'Contact', 
        href: 'mailto:ajangulo8@gmail.com',
        onClick: onContactClick ? onContactClick : null
    },
  ];

  const iconRow = icons.map((item, i) => (
    <DockIcon 
      key={i} 
      mouseX={mouseX} 
      isMobile={isMobile} 
      index={i}
      animateIcons={shouldAnimateIcons}
      iconDelayOffset={iconDelayOffset}
      iconDelayStep={iconDelayStep}
      {...item} 
    />
  ));

  return (
    // FIXED: Changed bottom-8 to bottom-6 to align with the audio player
    <div className={className || "fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 perspective-1000 w-full flex justify-center pointer-events-none"}>
      <motion.div
        layoutId={layoutId}
        onMouseMove={(e) => !isMobile && mouseX.set(e.pageX)}
        onMouseLeave={() => !isMobile && mouseX.set(Infinity)}
        style={{ height: 'auto' }}
        initial={animateIn ? { scale: 0.92, opacity: 0, y: 16 } : {}}
        animate={animateIn ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={animateIn ? { 
            duration: 0.35, 
            ease: [0.2, 0.8, 0.2, 1] 
        } : {}}
        className="pointer-events-auto"
      >
        {isMobile ? (
          <div className="flex items-center justify-between gap-1 px-2.5 py-2 md:pb-3 md:pt-3 rounded-full border border-black/5 bg-white/80 backdrop-blur-xl dark:bg-black/20 w-full max-w-md">
            {iconRow}
          </div>
        ) : (
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={21}
            borderWidth={0.02}
            displace={0.5}
            distortionScale={-180}
            brightness={48}
            opacity={1}
            blur={8}
            backgroundOpacity={0.06}
            saturation={1}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            mixBlendMode="screen"
            className="pointer-events-auto px-1 md:px-2"
            style={{ maxWidth: 'min(90vw, 720px)' }}
          >
            <div className="flex items-end gap-2 md:gap-3 px-2 md:px-3 py-2">
              {iconRow}
            </div>
          </GlassSurface>
        )}
      </motion.div>
    </div>
  );
}