import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const languageMessages = [
  {
    lang: 'English',
    text: 'Your studio ran into a problem and needs to restart.',
  },
  {
    lang: 'Español',
    text: 'Tu estudio encontró un problema y necesita reiniciarse.',
  },
  {
    lang: 'Français',
    text: 'Votre studio a rencontré un problème et doit redémarrer.',
  },
];

const diagnostics = [
  { label: 'Process', value: 'com.andrew.portfolio' },
  { label: 'Reason', value: 'Kernel Panic: UI_DESKTOP_MISSING' },
  { label: 'Thread', value: 'DockAnimation-01' },
];

const noiseTexture =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

const KernelPanic = () => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const previousTitle = document.title;
    document.title = 'Kernel Panic — Andrew Angulo';

    return () => {
      document.title = previousTitle || 'Andrew | Portfolio';
    };
  }, []);

  const handleRestart = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-[100dvh] bg-[#030a18] text-white flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#071630] via-[#050c19] to-[#000205] opacity-90" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: noiseTexture }} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-3xl text-center space-y-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/20 bg-white/5 text-xs tracking-[0.35em] uppercase text-white/70"
        >
          Simulated Panic Screen
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-20 h-20 rounded-[28px] border border-white/30 flex items-center justify-center text-4xl font-semibold"
        >
          !
        </motion.div>
        <div className="space-y-4">
          <p className="text-3xl md:text-[2.75rem] leading-snug font-semibold tracking-tight">
            Your Studio has encountered a kernel panic.
          </p>
          <p className="text-base md:text-lg text-white/80">
            Hold the power button until the system shuts off. Then press power again to recover the desktop.
          </p>
          <p className="text-sm md:text-base text-white/60">
            (Kidding—this is just a playful 404. The page you requested doesn’t exist.)
          </p>
        </div>

        <div className="space-y-5 text-left">
          {languageMessages.map(({ lang, text }) => (
            <p key={lang} className="text-white/75 font-medium text-base md:text-lg tracking-tight">
              <span className="uppercase text-xs tracking-[0.4em] text-white/50 mr-4">{lang}</span>
              {text}
            </p>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-left space-y-4 font-mono text-sm md:text-base">
          <p className="text-white/70">panic(cpu 0 caller 0xfffffff0070c1a4c): UI_DESKTOP_NOT_FOUND</p>
          <div className="space-y-2 text-white/60">
            {diagnostics.map((item) => (
              <div key={item.label} className="flex flex-col md:flex-row md:items-center md:gap-2">
                <span className="uppercase tracking-[0.3em] text-xs text-white/40">{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Return to Desktop
          </button>
          <p className="text-white/60 text-xs tracking-[0.3em] uppercase">Command + Control + Power (or just click above)</p>
        </div>
      </motion.div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: noiseTexture }} />
    </div>
  );
};

export default KernelPanic;


