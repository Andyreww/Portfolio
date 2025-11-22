import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, Music4, X } from 'lucide-react';
import { subscribeGlobalAudioControls } from '../lib/audioControls';
import GlassSurface from './GlassSurface.jsx';

const FloatingAudioController = () => {
  const [controls, setControls] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [manuallyClosed, setManuallyClosed] = useState(false);
  const [hasUnmutedOnce, setHasUnmutedOnce] = useState(false);
  const [projectsInView, setProjectsInView] = useState(false);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const unsubscribe = subscribeGlobalAudioControls((payload) => {
      setControls(payload);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const {
    songTitle,
    songArtist,
    artwork,
    accent = '#ffffff',
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
  } = controls || {};

  useEffect(() => {
    if (controls && controls.isMuted === false) {
      setHasUnmutedOnce(true);
    }
  }, [controls]);

  useEffect(() => {
    if (!isDesktop || typeof window === 'undefined' || typeof document === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setProjectsInView(false);
      return undefined;
    }

    const section = document.getElementById('projects');
    if (!section) {
      setProjectsInView(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setProjectsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [isDesktop]);

  const shouldDisplay =
    Boolean(controls) &&
    isDesktop &&
    hasUnmutedOnce &&
    !manuallyClosed &&
    !projectsInView;

  return (
    <AnimatePresence>
      {shouldDisplay && (
        <motion.div
          key="floating-audio-controller"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: projectsInView ? -20 : 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-2 right-6 z-[180] group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button
            onClick={() => setManuallyClosed(true)}
            className="absolute -top-2 -right-2 bg-neutral-800 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 hover:bg-red-500"
            title="Close Player"
          >
            <X size={10} />
          </button>
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
            className="pointer-events-auto select-none px-2 md:px-3 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
            style={{ minWidth: '260px', background: 'rgba(10,10,10,0.35)' }}
          >
            <div className="flex items-center gap-3 py-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/10 flex items-center justify-center">
                {artwork ? (
                  <img src={artwork} alt="" className="w-full h-full object-cover" draggable={false} />
                ) : (
                  <Music4 size={20} className="text-white/70" />
                )}
                <span
                  className="absolute inset-0 rounded-xl border border-white/30 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${accent}40` }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold leading-tight text-white truncate">{songTitle}</span>
                <span className="text-[11px] text-white/80 truncate">{songArtist}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => togglePlay?.()}
                  className="w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow-inner focus:outline-none hover:scale-105 transition-transform"
                  aria-label={isPlaying ? 'Pause music' : 'Play music'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="translate-x-[1px]" />}
                </button>
                <button
                  onClick={() => toggleMute?.()}
                  className="w-8 h-8 rounded-full border border-white/40 text-white flex items-center justify-center focus:outline-none hover:bg-white/10 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
          </GlassSurface>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 block text-[10px] text-white/60 text-right font-mono uppercase tracking-[0.4em]"
          >
            quick audio controls
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingAudioController;