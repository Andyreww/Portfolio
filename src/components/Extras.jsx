import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Film, Plus, FolderOpen, ChevronRight, Radio, Target, Gamepad2, ArrowUpRight, ArrowUp } from 'lucide-react';

// --- DATA ---
const movies = [
  { title: "Infinity War", img: "/assets/Infinity_War.jpg", trailer: "https://www.youtube.com/watch?v=6ZfuNTqbHE8" },
  { title: "Interstellar", img: "/assets/Interstellar.jpg", trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E" },
  { title: "Oppenheimer", img: "/assets/Oppenheimer.jpg", trailer: "https://www.youtube.com/watch?v=uYPbbksJxIg" },
  { title: "EEAAO", img: "/assets/EEAAO.jpg", trailer: "https://www.youtube.com/watch?v=wxN1T1uxQ2g" },
  { title: "Civil War", img: "/assets/CACV.jpg", trailer: "https://www.youtube.com/watch?v=43NWzay3W4s" },
  { title: "Spider-Verse", img: "/assets/ATSV.jpg", trailer: "https://www.youtube.com/watch?v=cqGjhVJWtEg" },
  { title: "Magazine Dreams", img: "/assets/MD.jpg", trailer: "https://www.youtube.com/watch?v=imqmeRe46iE" },
  { title: "No Way Home", img: "/assets/NWH.jpg", trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA" },
  { title: "Smile 2", img: "/assets/S2.jpg", trailer: "https://www.youtube.com/watch?v=0HY6QFlBzUY" },
  { title: "Avengers", img: "/assets/A1.jpg", trailer: "https://www.youtube.com/watch?v=eOrNdBpGMv8" },
  { title: "Weapons", img: "/assets/WEAPONS.png", trailer: "https://www.youtube.com/watch?v=QKHySfXqN0I" },
];

// --- COMPONENTS ---

const MovieMarquee = () => {
  return (
    <div className="relative flex overflow-hidden py-6 md:py-8 border-y-[1px] border-black/10 bg-white select-none">
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#f4f4f0] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#f4f4f0] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex w-max"
        animate={{ x: "-50%" }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      >
        {[...movies, ...movies].map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </motion.div>
    </div>
  );
};

const MovieCard = ({ movie }) => (
  <motion.a
    href={movie.trailer}
    target="_blank"
    rel="noopener noreferrer"
    // MOBILE FIX: Smaller width (120px) on mobile, 240px on desktop
    className="relative group w-[120px] md:w-[240px] aspect-[2/3] bg-black rounded-sm overflow-hidden cursor-pointer shrink-0 mr-4 md:mr-12 block"
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <img 
      src={movie.img} 
      alt={movie.title}
      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out opacity-90 group-hover:opacity-100"
      onError={(e) => { e.target.src = `https://placehold.co/400x600/1a1a1a/ffffff?text=${movie.title}` }} 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {movie.title}
    </span>
  </motion.a>
);

// CountUp Component
const CountUp = ({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = num => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    latest => {
      const hasDecimals = maxDecimals > 0;
      const options = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      };
      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);
      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') onStart();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') onEnd();
        },
        delay * 1000 + duration * 1000
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', latest => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("Dec 18, 2026 00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { clearInterval(interval); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimeBlock = ({ val, label }) => (
    // MOBILE FIX: Smaller blocks (w-16) and font sizes for mobile
    <div className="flex flex-col items-center justify-center border border-black/10 bg-white p-2 md:p-6 w-16 md:w-32 aspect-square">
      <span className="text-lg md:text-4xl font-mono font-black tracking-tighter">
        {val < 10 ? `0${val}` : val}
      </span>
      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-black/40 mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-2 md:gap-4 mt-6 md:mt-8 justify-start">
      <TimeBlock val={timeLeft.days} label="Days" />
      <TimeBlock val={timeLeft.hours} label="Hrs" />
      <TimeBlock val={timeLeft.minutes} label="Min" />
      <TimeBlock val={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export default function Extras() {
  return (
    <section id="extras" className="py-12 md:py-24 bg-[#f4f4f0] relative overflow-hidden">
      
      {/* --- THE BRIDGE: Directory Bar --- */}
      <div id="extras-content" className="w-full border-b border-black/10 mb-12 md:mb-16">
        {/* MOBILE FIX: Overflow-x-auto allows scrolling on small screens */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-black/40 uppercase tracking-widest whitespace-nowrap">
                <FolderOpen size={12} />
                <span>System</span>
                <ChevronRight size={12} />
                <span>Users</span>
                <ChevronRight size={12} />
                <span>Andrew</span>
                <ChevronRight size={12} />
                <span className="text-black font-bold">Relax_Mode</span>
            </div>
        </div>
      </div>
      
      {/* --- Section Header --- */}
      <div className="px-4 md:px-12 mb-12 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 max-w-[1600px] mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-2 text-black/60 font-mono text-xs uppercase tracking-wider">
            <Film size={14} />
            <span>Off-Duty Logs</span>
          </div>
          {/* MOBILE FIX: Clamp size so headline fits on narrow screens */}
          <h2 className="text-[clamp(2.75rem,14vw,5rem)] md:text-6xl font-display font-black uppercase tracking-tighter leading-[0.95]">
            The Cinema<br />Logs
          </h2>
        </div>
        
        <div className="max-w-md text-sm md:text-base font-medium text-black/70 leading-relaxed">
          <span className="font-bold text-black">Honestly? I just love good visuals.</span><br/>
          These films define my taste and help me understand style, atmosphere, and pacing. Stuff I try to bring into my own work.
          <div className="mt-6">
            <a 
              href="https://boxd.it/oYUOo" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
            >
              View Full Letterboxd List
            </a>
          </div>
        </div>
      </div>

      {/* --- Infinite Film Strip --- */}
      <div className="mb-12 md:mb-24">
        <MovieMarquee />
      </div>

      {/* --- The "Upcoming" Section --- */}
      <div className="px-4 md:px-12 max-w-[1400px] mx-auto mb-12 md:mb-24">
        <div className="pt-8 md:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          
          {/* Left: Info & Countdown */}
          <div className="lg:col-span-5 flex flex-col justify-between order-2 lg:order-1">
             <div>
                <div className="flex items-center gap-2 mb-4 text-[#2d5a27] font-mono text-xs uppercase tracking-widest font-bold animate-pulse">
                    <Target size={12} className="text-[#2d5a27]" />
                    <span>COUNTDOWN TO PEAK CINEMA</span>
                </div>
                
                <h3 className="text-3xl md:text-5xl font-display font-black uppercase mb-6 leading-tight">
                    Avengers: Doomsday
                </h3>

                {/* HUMAN CONTEXT BLOCK */}
                <div className="border-l-2 border-[#2d5a27] pl-4 mb-8">
                   <p className="text-[10px] font-mono uppercase text-[#2d5a27] mb-1 font-bold">
                      Personal Note:
                   </p>
                   <p className="text-base md:text-lg font-medium leading-relaxed opacity-80 max-w-md">
                      No deep technical analysis needed here. <br/>
                      The Avengers films shaped my love for epic storytelling and visual spectacle. I'm just here for the action, the scale, and seeing this universe's next chapter unfold on the biggest screen possible. <span className="underline"> I can't wait.</span>
                   </p>
                </div>
             </div>
             
             <div className="mt-4 md:mt-auto">
                 <div className="flex items-center gap-2 font-mono text-xs uppercase opacity-50 mb-2">
                    <Radio size={12} className="animate-spin" />
                    Time to Premiere
                 </div>
                 <Countdown />
             </div>
          </div>

          {/* Right: The Trailer Feed */}
          <div className="lg:col-span-7 order-1 lg:order-2">
             <div className="relative w-full aspect-video bg-black border-2 border-black p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                 <Plus className="absolute top-4 left-4 text-white/20" size={20} />
                 <Plus className="absolute top-4 right-4 text-white/20" size={20} />
                 <Plus className="absolute bottom-4 left-4 text-white/20" size={20} />
                 <Plus className="absolute bottom-4 right-4 text-white/20" size={20} />

                 <iframe 
                    className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                    src="https://www.youtube.com/embed/UiMg566PREA?si=zJI9PM1gp2WSw0b4" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                 />
             </div>
          </div>

        </div>
      </div>

      {/* --- Gaming Stats Section --- */}
      <div className="px-4 md:px-12 max-w-[1400px] mx-auto">
        <div className="border-t-2 border-black pt-12">
          <div className="flex items-center gap-2 mb-6 text-black/60 font-mono text-xs uppercase tracking-wider">
            <Gamepad2 size={14} />
            <span>Gaming Activity</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Description */}
            <div>
              <h3 className="text-2xl md:text-4xl font-display font-black uppercase mb-4 leading-tight">
                Steam Library
              </h3>
              <p className="text-base md:text-lg font-medium text-black/70 leading-relaxed mb-6">
              When the code editor is closed, Steam is usually open. I sink a lot of my free time into gaming and it's how I relax... Here's a look at what I'm currently playing and the stats to prove it.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-black/10">
                <div>
                  <div className="text-2xl md:text-3xl font-mono font-black mb-1">
                    <CountUp to={18} from={0} duration={1.5} />
                  </div>
                  <div className="text-xs font-mono uppercase text-black/50 tracking-wider">Level</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-mono font-black mb-1">
                    <CountUp to={80} from={0} duration={1.5} />
                  </div>
                  <div className="text-xs font-mono uppercase text-black/50 tracking-wider">Games</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-mono font-black mb-1">
                    <CountUp to={731} from={0} duration={2} />
                  </div>
                  <div className="text-xs font-mono uppercase text-black/50 tracking-wider">Achievements</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-mono font-black mb-1">
                    <CountUp to={1} from={0} duration={1} />
                  </div>
                  <div className="text-xs font-mono uppercase text-black/50 tracking-wider">Perfect Game</div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="mb-6 pb-6 border-b border-black/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono uppercase text-black/50 tracking-wider">Recent Activity</div>
                  <div className="text-xs font-mono text-black/60">1.4 hours past 2 weeks</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-bold">Wallpaper Engine</div>
                      <div className="text-xs text-black/60">10.1 hrs</div>
                    </div>
                    <div className="text-xs text-black/50">5 of 17 achievements</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-bold">PEAK</div>
                      <div className="text-xs text-black/60">25 hrs</div>
                    </div>
                    <div className="text-xs text-black/50">22 of 54 achievements</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-bold">Marvel Rivals</div>
                      <div className="text-xs text-black/60">18.6 hrs</div>
                    </div>
                    <div className="text-xs text-black/50">8 of 49 achievements</div>
                  </div>
                </div>
              </div>
              
              {/* Favorite Game */}
              <div className="mb-6 pb-6 border-b border-black/10">
                <div className="text-xs font-mono uppercase text-black/50 tracking-wider mb-2">Favorite Game</div>
                <div className="text-lg md:text-xl font-bold">Hi-Fi RUSH</div>
                <div className="text-sm text-black/60 mt-1">15 hours • 28 achievements</div>
              </div>
              
              {/* Steam Links */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://steamcommunity.com/id/NovusTM/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-black bg-white text-black font-bold uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-200 group"
                >
                  Steam Profile <ArrowUpRight size={14} />
                </a>
                <a 
                  href="https://s.team/y25/ccnmmmjp?l=english" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-black bg-white text-black font-bold uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-200 group"
                >
                  Steam Replay 2025 <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            
            {/* Right: Stacked Game Images */}
            <div className="flex flex-col gap-4">
              {/* Steam Stats Image */}
              <div className="relative">
                <div className="relative w-full border-2 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Plus className="absolute top-2 left-2 text-black/10" size={16} />
                  <Plus className="absolute top-2 right-2 text-black/10" size={16} />
                  <Plus className="absolute bottom-2 left-2 text-black/10" size={16} />
                  <Plus className="absolute bottom-2 right-2 text-black/10" size={16} />
                  <img 
                    src="/assets/Steam-Fav.png" 
                    alt="Steam Gaming Statistics" 
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.target.src = `https://placehold.co/800x600/1a1a1a/ffffff?text=Steam+Stats` }} 
                  />
                </div>
              </div>
              
              {/* The Last of Us Image - Hidden on mobile */}
              <div className="relative hidden md:block">
                <div className="relative w-full border-2 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Plus className="absolute top-2 left-2 text-black/10" size={16} />
                  <Plus className="absolute top-2 right-2 text-black/10" size={16} />
                  <Plus className="absolute bottom-2 left-2 text-black/10" size={16} />
                  <Plus className="absolute bottom-2 right-2 text-black/10" size={16} />
                  <img 
                    src="/assets/LOU.png" 
                    alt="The Last of Us Part II Remastered" 
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.target.src = `https://placehold.co/800x600/1a1a1a/ffffff?text=The+Last+of+Us` }} 
                  />
                </div>
              </div>
              
              {/* Hi-Fi RUSH Image - Hidden on mobile */}
              <div className="relative hidden md:block">
                <div className="relative w-full border-2 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Plus className="absolute top-2 left-2 text-black/10" size={16} />
                  <Plus className="absolute top-2 right-2 text-black/10" size={16} />
                  <Plus className="absolute bottom-2 left-2 text-black/10" size={16} />
                  <Plus className="absolute bottom-2 right-2 text-black/10" size={16} />
                  <img 
                    src="/assets/HIFIRUSH.png" 
                    alt="Hi-Fi RUSH" 
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.target.src = `https://placehold.co/800x600/1a1a1a/ffffff?text=Hi-Fi+RUSH` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}