import React, { useState, useEffect, useRef } from 'react';
import Dock from './components/Dock';
import Hero from './components/Hero';
import About from './components/About';
import ProjectsDesktop from './components/ProjectsDesktop';
import Marquee from './components/Marquee';
import Extras from './components/Extras';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import KernelPanic from './components/KernelPanic';
import FloatingAudioController from './components/FloatingAudioController';

// Helper hooks for viewport detection
const useViewportFlag = (breakpoint) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const handler = () => setMatches(window.innerWidth < breakpoint);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return matches;
};

const useIsMobile = () => useViewportFlag(768);
const useIsCompact = () => useViewportFlag(1024);

const DESKTOP_DOCK_DELAY_MS = 1600;
const DESKTOP_DOCK_ANIMATION_DURATION_MS = 2000;
const DESKTOP_DOCK_LAYOUT_ID = 'shared-desktop-dock';
const TAB_SECTION_IDS = ['hero', 'projects', 'about', 'extras', 'footer'];
const PRIMARY_MARQUEE_ITEMS = ['Developer', 'Designer', 'Creator', 'Engineer', 'Problem Solver'];
const SECONDARY_MARQUEE_ITEMS = ['Available for Work', 'Based in NYC', "Open to Collab", "Let's Talk"];
const MARQUEE_DURATION = 90;

const normalizePathname = (pathname) => {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
};

function App() {
  const [isDockHidden, setDockHidden] = useState(false);
  const [showHeroDock, setShowHeroDock] = useState(true);
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();
  const [desktopDockReady, setDesktopDockReady] = useState(() => isCompact);
  const [hasAnimatedDesktopDock, setHasAnimatedDesktopDock] = useState(() => isCompact);
  const [criticalAssetsReady, setCriticalAssetsReady] = useState(false);
  const [shouldRenderPreloader, setShouldRenderPreloader] = useState(false);
  const [preloaderHasFinished, setPreloaderHasFinished] = useState(false);
  const [isNotFoundRoute, setIsNotFoundRoute] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return normalizePathname(window.location.pathname) !== '/';
  });
  const heroRef = useRef(null);
  const desktopDockDelayRef = useRef(null);
  const preloaderActive = !isNotFoundRoute && shouldRenderPreloader && !preloaderHasFinished;

  const clearDesktopDockDelay = () => {
    if (desktopDockDelayRef.current) {
      clearTimeout(desktopDockDelayRef.current);
      desktopDockDelayRef.current = null;
    }
  };

  useEffect(() => {
    if (isNotFoundRoute) {
      return;
    }

    if (!isMobile) {
      const handleScroll = () => {
        setShowHeroDock(window.scrollY < 100);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const heroElement = heroRef.current;
    if (!heroElement) {
      return;
    }

    const SHOW_THRESHOLD = 0.55;
    const HIDE_THRESHOLD = 0.35;

    const computeHeroVisibility = () => {
      const rect = heroElement.getBoundingClientRect();
      const windowHeight = window.innerHeight || 0;
      const heroHeight = rect.height || heroElement.offsetHeight || 1;
      const visibleStart = Math.max(rect.top, 0);
      const visibleEnd = Math.min(rect.bottom, windowHeight);
      const visibleHeight = Math.max(0, visibleEnd - visibleStart);
      const visibilityRatio = visibleHeight / heroHeight;

      setShowHeroDock((prev) => {
        if (prev && visibilityRatio <= HIDE_THRESHOLD) {
          return false;
        }
        if (!prev && visibilityRatio >= SHOW_THRESHOLD) {
          return true;
        }
        return prev;
      });
    };

    let rafId = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeHeroVisibility);
    };

    const observer = new IntersectionObserver(
      computeHeroVisibility,
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px',
      }
    );

    observer.observe(heroElement);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', computeHeroVisibility);
    computeHeroVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', computeHeroVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile, isNotFoundRoute]);

  useEffect(() => {
    if (isNotFoundRoute) {
      clearDesktopDockDelay();
      return;
    }

    if (preloaderActive) {
      clearDesktopDockDelay();
      if (isCompact) {
        setDesktopDockReady(true);
        setHasAnimatedDesktopDock(true);
      } else {
        setDesktopDockReady(false);
        setHasAnimatedDesktopDock(false);
      }
      return;
    }

    if (isCompact) {
      clearDesktopDockDelay();
      setDesktopDockReady(true);
      setHasAnimatedDesktopDock(true);
      return;
    }

    clearDesktopDockDelay();
    setDesktopDockReady(false);
    setHasAnimatedDesktopDock(false);

    desktopDockDelayRef.current = setTimeout(() => {
      setDesktopDockReady(true);
    }, DESKTOP_DOCK_DELAY_MS);

    return () => clearDesktopDockDelay();
  }, [isCompact, preloaderActive, isNotFoundRoute]);

  useEffect(() => {
    if (isCompact || preloaderActive || isNotFoundRoute) {
      return;
    }

    if (!showHeroDock) {
      clearDesktopDockDelay();
      if (!desktopDockReady) {
        setDesktopDockReady(true);
      }
    }
  }, [isCompact, showHeroDock, desktopDockReady, preloaderActive, isNotFoundRoute]);

  useEffect(() => {
    if (isCompact || preloaderActive || isNotFoundRoute || !desktopDockReady || hasAnimatedDesktopDock) {
      return;
    }

    const timer = setTimeout(() => {
      setHasAnimatedDesktopDock(true);
    }, DESKTOP_DOCK_ANIMATION_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isCompact, desktopDockReady, hasAnimatedDesktopDock, preloaderActive, isNotFoundRoute]);

  // Logic for showing the fixed dock:
  // - Desktop: wait for hero animation unless the user scrolls past (then show immediately)
  // - Compact/mobile: only show when the Hero dock isn't visible
  const showFixedDock = !preloaderActive && !isNotFoundRoute && !isDockHidden && (
    (!isCompact && desktopDockReady) ||
    (isCompact && !showHeroDock)
  );
  useEffect(() => {
    if (isNotFoundRoute) {
      setCriticalAssetsReady(true);
      return;
    }

    let isMounted = true;

    const markReady = () => {
      if (isMounted) {
        setCriticalAssetsReady(true);
      }
    };

    const waitForFonts = async () => {
      if (typeof document === 'undefined' || !document.fonts) {
        return;
      }

      try {
        await document.fonts.ready;
        markReady();
      } catch {
        // Swallow errors and rely on fallback timers/load event.
      }
    };

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        markReady();
      } else {
        window.addEventListener('load', markReady, { once: true });
      }
    }

    waitForFonts();

    const fallbackTimer = setTimeout(markReady, 5000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', markReady);
      }
    };
  }, [isNotFoundRoute]);

  useEffect(() => {
    if (isNotFoundRoute || criticalAssetsReady || preloaderHasFinished || shouldRenderPreloader) {
      return;
    }

    const connection =
      typeof navigator !== 'undefined'
        ? navigator.connection || navigator.webkitConnection || navigator.mozConnection
        : null;

    const effectiveType = connection?.effectiveType ?? '';
    const isLikelySlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g';

    if (isLikelySlowConnection) {
      setShouldRenderPreloader(true);
      return;
    }

    const SHOW_DELAY_MS = 500;
    const showTimer = setTimeout(() => {
      if (!criticalAssetsReady && !preloaderHasFinished) {
        setShouldRenderPreloader(true);
      }
    }, SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, [criticalAssetsReady, preloaderHasFinished, shouldRenderPreloader, isNotFoundRoute]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleRouteChange = () => {
      const normalized = normalizePathname(window.location.pathname);
      setIsNotFoundRoute(normalized !== '/');
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const shouldAnimateFixedDock = !isCompact && !hasAnimatedDesktopDock;
  const dockLayoutId = isCompact ? 'shared-dock' : DESKTOP_DOCK_LAYOUT_ID;

  const handlePreloaderComplete = () => {
    setPreloaderHasFinished(true);
    setShouldRenderPreloader(false);
  };

  useEffect(() => {
    if (isNotFoundRoute || typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const interactiveInputs = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
    const SCROLL_BUFFER = 32;

    const handleTabNavigation = (event) => {
      if (event.key !== 'Tab') {
        return;
      }

      const target = event.target;
      const tagName = target?.tagName;
      if (tagName && interactiveInputs.has(tagName)) {
        return;
      }
      if (target?.isContentEditable) {
        return;
      }

      event.preventDefault();

      if (document.activeElement && document.activeElement !== document.body && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      const sections = TAB_SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
      const direction = event.shiftKey ? -1 : 1;
      const currentScroll = window.scrollY;

      if (!sections.length) {
        window.scrollBy({
          top: direction * window.innerHeight * 0.9,
          behavior: 'smooth',
        });
        return;
      }

      const positions = sections.map((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY - SCROLL_BUFFER;
        return Math.max(0, top);
      });

      let targetIndex;

      if (direction > 0) {
        targetIndex = positions.findIndex((pos) => pos > currentScroll + SCROLL_BUFFER);
        if (targetIndex === -1) {
          targetIndex = positions.length - 1;
        }
      } else {
        for (let i = positions.length - 1; i >= 0; i -= 1) {
          if (positions[i] < currentScroll - SCROLL_BUFFER) {
            targetIndex = i;
            break;
          }
        }
        if (targetIndex === undefined) {
          targetIndex = 0;
        }
      }

      const targetPosition = positions[targetIndex] ?? 0;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    };

    window.addEventListener('keydown', handleTabNavigation);

    return () => {
      window.removeEventListener('keydown', handleTabNavigation);
    };
  }, [isNotFoundRoute]);

  if (isNotFoundRoute) {
    return <KernelPanic />;
  }

  return (
    <>
      {preloaderActive && (
        <Preloader forceFinish={criticalAssetsReady} onComplete={handlePreloaderComplete} />
      )}
      <div className="bg-[#f4f4f0] text-black selection:bg-black selection:text-white overflow-x-hidden">
      <div ref={heroRef}>
        <Hero showDock={showHeroDock && isCompact} isMobile={isMobile} isCompact={isCompact} />
      </div>
      
      <Marquee 
        items={PRIMARY_MARQUEE_ITEMS}
        duration={MARQUEE_DURATION} 
      />

      <ProjectsDesktop 
        setDockHidden={setDockHidden} 
        isDockHidden={isDockHidden} 
      />

      <Marquee 
        items={SECONDARY_MARQUEE_ITEMS}
        reverse={true} 
        duration={MARQUEE_DURATION} 
      />
      
      <About />
      
      <Extras />
      
      {/* Footer sits at the bottom */}
      <Footer /> 
      
      {showFixedDock && (
        <Dock 
          layoutId={dockLayoutId} 
          animateIn={shouldAnimateFixedDock} 
          animateIcons={shouldAnimateFixedDock}
          isMobile={isCompact} 
        />
      )}
      </div>
      <FloatingAudioController />
    </>
  );
}

export default App;
