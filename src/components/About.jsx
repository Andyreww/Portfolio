import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, FolderOpen, ChevronRight, ChevronLeft, Calendar, BookOpen, Award } from 'lucide-react';

// Calculate age that updates on May 30th at 12:00 AM EST
const calculateAge = () => {
  const now = new Date();
  
  // Get current time in EST/EDT
  // EST is UTC-5, EDT is UTC-4 (daylight saving)
  // We'll use a simple approach: check if we're in DST period (roughly March-November)
  const isDST = now.getMonth() >= 2 && now.getMonth() <= 10; // March (2) to November (10)
  const estOffset = isDST ? -4 * 60 : -5 * 60; // EDT or EST in minutes
  const estTime = new Date(now.getTime() + (now.getTimezoneOffset() - estOffset) * 60 * 1000);
  
  const currentYear = estTime.getFullYear();
  const currentMonth = estTime.getMonth() + 1; // getMonth() returns 0-11
  const currentDay = estTime.getDate();
  const currentHour = estTime.getHours();
  
  // Birthday is May 30th at 12:00 AM EST
  const birthMonth = 5;
  const birthDay = 30;
  const birthYear = 2003; // Born in 2003
  
  // Check if May 30th at 12:00 AM EST has passed this year
  const hasBirthdayPassed = 
    currentMonth > birthMonth || 
    (currentMonth === birthMonth && currentDay > birthDay) ||
    (currentMonth === birthMonth && currentDay === birthDay && currentHour >= 0);
  
  // Calculate age: if birthday has passed, subtract 0, otherwise subtract 1
  return currentYear - birthYear - (hasBirthdayPassed ? 0 : 1);
};

const BrutalCard = ({ children, className, title, invert = false }) => (
  <div className={`border-2 border-black p-5 md:p-6 flex flex-col justify-between relative ${invert ? 'bg-black text-white' : 'bg-white text-black'} ${className}`}>
    {title && (
      <h3 className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 border-b-2 pb-2 w-max ${invert ? 'border-white' : 'border-black'}`}>
        {title}
      </h3>
    )}
    {children}
  </div>
);

export default function About() {
  const [age, setAge] = useState(calculateAge());
  
  // Update age periodically to ensure it updates on May 30th
  useEffect(() => {
    // Update immediately
    setAge(calculateAge());
    
    // Then check every hour to catch the May 30th update
    const interval = setInterval(() => {
      setAge(calculateAge());
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section id="about" className="pt-12 pb-24 md:pt-0 bg-[#f4f4f0] overflow-hidden">
      
      {/* --- DIRECTORY BAR (Mobile Scrollable) --- */}
      <div className="w-full border-b border-black/10 mb-12 bg-[#f4f4f0]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-black/40 uppercase tracking-widest whitespace-nowrap">
                <FolderOpen size={12} />
                <span>System</span>
                <ChevronRight size={12} />
                <span>Users</span>
                <ChevronRight size={12} />
                <span>Andrew</span>
                <ChevronRight size={12} />
                <span className="text-black font-bold">User_Profile</span>
            </div>
        </div>
      </div>

      <div id="about-content" className="px-4 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            
            {/* Left Column - About Text + Photos (Desktop) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center md:items-end md:justify-start mb-4 md:mb-0 px-6 md:px-0 md:relative">
                {/* Massive 'ABOUT' Text - Tuned for Mobile */}
                <div className="flex items-center justify-center md:justify-center mb-6 md:mb-0 md:absolute md:inset-0 md:pointer-events-none">
                    <h2 className="max-w-full text-[clamp(1.8rem,14vw,7.5rem)] md:text-[8vw] leading-[0.95] font-display font-black uppercase rotate-0 md:-rotate-90 origin-center text-center text-transparent stroke-text md:mt-56 md:mr-24" style={{ WebkitTextStroke: '1px black', textWrap: 'balance', letterSpacing: '-0.03em' }}>
                        About
                    </h2>
                </div>
                
                {/* Photos - Desktop: left side in column, Mobile: hidden (shown below) */}
                <div className="hidden md:flex md:flex-col gap-2 md:gap-3 md:mt-0">
                    <div className="border-2 border-black overflow-hidden bg-white w-fit">
                        <img 
                            src="/assets/Andrew1.png" 
                            alt="Andrew" 
                            className="w-24 h-24 md:w-40 md:h-auto object-cover block"
                            onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                        />
                    </div>
                    <div className="border-2 border-black overflow-hidden bg-white w-fit">
                        <img 
                            src="/assets/Andrew2.png" 
                            alt="Andrew" 
                            className="w-24 h-24 md:w-40 md:h-auto object-cover block"
                            onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                        />
                    </div>
                    <div className="border-2 border-black overflow-hidden bg-white w-fit">
                        <img 
                            src="/assets/Andrew6.png" 
                            alt="Andrew" 
                            className="w-24 h-24 md:w-40 md:h-auto object-cover block"
                            onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                        />
                    </div>
                    <div className="border-2 border-black overflow-hidden bg-white w-fit">
                        <img 
                            src="/assets/Andrew7.png" 
                            alt="Andrew" 
                            className="w-24 h-24 md:w-40 md:h-40 object-cover block"
                            onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                        />
                    </div>
                </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Photos - Mobile: above Biography, centered */}
                <div className="md:hidden flex justify-center mb-4">
                    <div className="flex gap-3">
                        <div className="border-2 border-black overflow-hidden bg-white">
                            <img 
                                src="/assets/Andrew1.png" 
                                alt="Andrew" 
                                className="w-24 h-24 object-cover"
                                onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                            />
                        </div>
                        <div className="border-2 border-black overflow-hidden bg-white">
                            <img 
                                src="/assets/Andrew2.png" 
                                alt="Andrew" 
                                className="w-24 h-24 object-cover"
                                onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                            />
                        </div>
                        <div className="border-2 border-black overflow-hidden bg-white">
                            <img 
                                src="/assets/Andrew6.png" 
                                alt="Andrew" 
                                className="w-24 h-24 object-cover"
                                onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                            />
                        </div>
                        <div className="border-2 border-black overflow-hidden bg-white">
                            <img 
                                src="/assets/Andrew7.png" 
                                alt="Andrew" 
                                className="w-24 h-24 object-cover"
                                onError={(e) => e.target.src = 'https://placehold.co/128x128?text=Photo'}
                            />
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <BrutalCard className="md:col-span-2 aspect-auto" title="Biography">
                    <div className="space-y-4">
                        <p className="text-lg md:text-2xl font-medium leading-snug md:leading-tight">
                            Born and raised in Queens, NY. Just graduated from Denison University with a B.A. in Computer Science. My interest in tech started when I was a kid watching <span className="italic">Iron Man</span> and wanting to build cool stuff like that.
                        </p>
                        <p className="text-base md:text-lg font-medium leading-relaxed text-black/80">
                            Right now I'm focused on building projects that actually help people, while keeping an eye out for a tech job where I can keep learning and creating. Beyond coding, I'm into gaming, 80s music, and sci-fi movies. Always up for a good challenge.
                        </p>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase border border-black px-3 py-1 rounded-full hover:bg-black hover:text-white transition-colors cursor-default">
                            <Calendar size={14} /> {age}
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase border border-black px-3 py-1 rounded-full hover:bg-black hover:text-white transition-colors cursor-default">
                            <MapPin size={14} /> Queens, NY
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase border border-black px-3 py-1 rounded-full hover:bg-black hover:text-white transition-colors cursor-default">
                            <GraduationCap size={14} /> Denison Univ.
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase border border-black px-3 py-1 rounded-full hover:bg-black hover:text-white transition-colors cursor-default">
                            <Award size={14} /> B.A.
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase border border-black px-3 py-1 rounded-full hover:bg-black hover:text-white transition-colors cursor-default">
                            <BookOpen size={14} /> Computer Science
                        </div>
                    </div>
                </BrutalCard>

                {/* Tech Stack */}
                <BrutalCard className="md:col-span-1" title="Arsenal">
                    <ul className="space-y-2 font-mono text-xs md:text-sm uppercase">
                        {["Python", "Java", "JavaScript", "C++", "C#", "SQL", "HTML/CSS", "Unity", "TensorFlow", "Machine Learning", "Data Analysis", "Web Development", "Software Development"].map(tech => (
                            <li key={tech} className="flex items-center justify-between border-b border-gray-200 pb-1">
                                <span>{tech}</span>
                                <span>★</span>
                            </li>
                        ))}
                    </ul>
                </BrutalCard>

                {/* Interests */}
                <BrutalCard className="md:col-span-1" title="Interests">
                    <div className="h-full flex flex-col justify-center text-center gap-3 md:gap-2 py-4 md:py-0">
                        <span className="text-xl md:text-lg font-display uppercase">Gaming</span>
                        <span className="text-xl md:text-lg font-display uppercase text-gray-500">80-90s Music</span>
                        <span className="text-xl md:text-lg font-display uppercase">Sci-Fi Movies</span>
                        <span className="text-xl md:text-lg font-display uppercase text-gray-500">Game Design</span>
                        <span className="text-xl md:text-lg font-display uppercase">Theatre</span>
                        <span className="text-xl md:text-lg font-display uppercase text-gray-500">Food</span>
                        <span className="text-xl md:text-lg font-display uppercase">Augmented Reality</span>
                        <span className="text-xl md:text-lg font-display uppercase text-gray-500">Badminton</span>
                    </div>
                </BrutalCard>
            </div>

        </div>
      </div>
    </section>
  );
}