import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Copy, Check, FolderOpen, ChevronRight } from 'lucide-react';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const email = "ajangulo8@gmail.com";
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or restricted contexts
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Copy failed:', err);
      // Still show feedback even if copy fails
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer id="footer" data-tab-section className="bg-[#121212] text-white pt-10 md:pt-16 pb-24 md:pb-12 px-0 md:px-12 relative overflow-x-hidden selection:bg-green-400 selection:text-black w-full max-w-none">
      
      {/* --- Background Grid (Subtle) --- */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="max-w-[1600px] mx-auto relative z-10 px-6 md:px-0">

        {/* --- DIRECTORY BAR (Footer Edition) --- */}
        <div className="w-full border-b border-white/10 mb-10 md:mb-12">
          <div className="px-0 py-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-white/50 uppercase tracking-[0.35em] whitespace-nowrap">
              <FolderOpen size={12} className="text-white/60" />
              <span>System</span>
              <ChevronRight size={12} />
              <span>Users</span>
              <ChevronRight size={12} />
              <span>Andrew</span>
              <ChevronRight size={12} />
              <span className="text-white font-bold tracking-[0.4em]">Connect</span>
            </div>
          </div>
        </div>
        
        {/* --- HEADER: CALL TO ACTION --- */}
        <div className="flex flex-col items-start gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="flex items-center gap-3 text-green-400 font-mono text-[10px] md:text-sm uppercase tracking-widest mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Status: Available for Work
            </div>
            {/* MOBILE FIX: clamp text size + balanced wrap so CTA fits on small screens */}
            <h2 
              className="text-left text-[clamp(2.2rem,9vw,7.5rem)] md:text-[8vw] leading-[0.96] md:leading-[0.85] font-display font-black uppercase tracking-tight" 
              style={{ textWrap: 'balance' }}
            >
                <span className="block tracking-[-0.04em]">Enough Scrolling</span>
                <span className="block mt-1 md:mt-3 text-transparent stroke-text-white tracking-[0.06em]">Let's Work!</span>
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 lg:gap-6 border-t border-white/10 pt-12">
            
            {/* --- COL 1: CONTACT --- */}
            <div className="flex flex-col items-start gap-4">
                <span className="text-[10px] md:text-xs font-mono text-white/50 uppercase tracking-wider">Lets Talk :)</span>
                
                <button 
                    onClick={handleCopy}
                    className="group flex flex-wrap items-center gap-3 text-xl md:text-xl lg:text-2xl font-bold hover:text-gray-300 transition-colors text-left touch-manipulation cursor-pointer active:opacity-80"
                    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                >
                    <span className="break-words">ajangulo8@gmail.com</span>
                    <div className="bg-white/10 p-2 rounded-md group-hover:bg-white/20 transition-colors shrink-0">
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </div>
                </button>
                
                {copied && (
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-mono text-green-400"
                    >
                        // Address Copied to Clipboard
                    </motion.span>
                )}
            </div>

            {/* --- COL 2: SOCIALS (Text Links) --- */}
            <div className="flex flex-col gap-4">
                <span className="text-[10px] md:text-xs font-mono text-white/50 uppercase tracking-wider">My Socials</span>
                <div className="flex flex-col gap-3 md:gap-2">
                    <a href="https://github.com/andyreww/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lg font-medium hover:text-gray-400 transition-colors w-max">
                        GitHub <ArrowUpRight size={14} className="opacity-50"/>
                    </a>
                    <a href="https://www.linkedin.com/in/andyrew/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lg font-medium hover:text-gray-400 transition-colors w-max">
                        LinkedIn <ArrowUpRight size={14} className="opacity-50"/>
                    </a>
                    <a href="/assets/Andrew Angulo Resume 2025F.pdf" target="_blank" className="flex items-center gap-2 text-lg font-medium hover:text-gray-400 transition-colors w-max">
                        Resume / CV <ArrowUpRight size={14} className="opacity-50"/>
                    </a>
                </div>
            </div>

            {/* --- COL 3: METADATA --- */}
            {/* MOBILE FIX: text-left on mobile, text-right on desktop */}
            <div className="flex flex-col md:justify-start lg:justify-between gap-8 text-left lg:text-right">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] md:text-xs font-mono text-white/50 uppercase tracking-wider">Location</span>
                    <span className="text-lg font-medium">Queens, New York (EST)</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] md:text-xs font-mono text-white/50 uppercase tracking-wider">Version</span>
                    <span className="text-lg font-medium">Portfolio OS v2.0.25</span>
                </div>
            </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        {/* MOBILE FIX: Stacked on mobile, Row on desktop */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6 text-[10px] md:text-xs font-mono text-white/30 uppercase text-center lg:text-left pb-8 md:pb-12">
            <span className="break-words max-w-full">© {new Date().getFullYear()} Andrew Angulo. All Rights Reserved.</span>
            <span className="lg:text-right break-words max-w-full">Created with React + Framer Motion + Genuine Love</span>
        </div>

      </div>
    </footer>
  );
}