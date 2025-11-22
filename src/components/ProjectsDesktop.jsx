import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent, useDragControls, useMotionValue } from 'framer-motion';
import { X, ExternalLink, Github, Plus, Terminal, FolderOpen, ChevronRight, Play, Pause, SkipBack, SkipForward, Shuffle, Airplay, Volume2, VolumeX, Disc, FileText, Mail, Send, User, Cpu, MapPin, Calendar, Briefcase, Linkedin, Popcorn, Monitor, AlertTriangle, Ticket, Signal, Wifi, Battery, Phone, Globe } from 'lucide-react';
import Dock from './Dock';
import { setGlobalAudioControls } from '../lib/audioControls';

// --- HELPER HOOK ---
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);
    return isMobile;
};

// --- CONFIGURATION ---
const PLAYLIST = [
  { title: "Angel", artist: "Damiano David", src: "/assets/audio/Damiano David - Angel.mp3", art: "/assets/artwork/Damiano David - Angel.jpg", color: "#f5deb3" },
  { title: "Next Summer", artist: "Damiano David", src: "/assets/audio/Damiano David - Next Summer.mp3", art: "/assets/artwork/Damiano David - Next Summer.jpg", color: "#9ca3af" },
  { title: "Over", artist: "Damiano David", src: "/assets/audio/Damiano David - Over.mp3", art: "/assets/artwork/Damiano David - Over.jpg", color: "#f3d5a6" },
  { title: "For Cryin Out Loud", artist: "FINNEAS", src: "/assets/audio/FINNEAS - For Cryin Out Loud.mp3", art: "/assets/artwork/FINNEAS - For Cryin Out Loud.jpg", color: "#c19a6b" },
  { title: "Past Won't Leave My Bed", artist: "Joji", src: "/assets/audio/Joji - Past Won't Leave My Bed.mp3", art: "/assets/artwork/Joji - Past Won't Leave My Bed.jpg", color: "#c4b5fd" },
  { title: "back to friends", artist: "sombr", src: "/assets/audio/sombr - back to friends.mp3", art: "/assets/artwork/sombr - back to friends.jpg", color: "#36454f" },
  { title: "pollen", artist: "Thomas Day", src: "/assets/audio/Thomas Day - pollen.mp3", art: "/assets/artwork/Thomas Day - pollen.jpg", color: "#ec4899" },
  { title: "Sweetness", artist: "Elliot James Reay", src: "/assets/audio/Elliot James Reay - Sweetness.mp3", art: "/assets/artwork/Elliot James Reay - Sweetness.jpg", color: "#fbbf24" },
  { title: "Sleep When We're Dead", artist: "Thomas Day", src: "/assets/audio/Thomas Day - Sleep When We're Dead.mp3", art: "/assets/artwork/Thomas Day - Sleep When We're Dead.jpg", color: "#f97316" },
  { title: "Higher", artist: "Tom Grennan", src: "/assets/audio/Tom Grennan - Higher.mp3", art: "/assets/artwork/Tom Grennan - Higher.jpg", color: "#f5deb3" }
];

const CROSSFADE_DURATION = 3; // seconds for fade out/in
const CROSSFADE_STEPS = 24;
const CROSSFADE_THRESHOLD = 15; // seconds remaining before triggering fade
const DEFAULT_MOBILE_VOLUME = 0.5;

const createShuffleQueue = (currentIndex) => {
  const remaining = PLAYLIST.map((_, idx) => idx).filter((idx) => idx !== currentIndex);
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  return remaining;
};

const projects = [
  { 
    id: 'vision', 
    title: 'Apple Vision Pro Engagement Analysis', 
    icon: '🥽', 
    color: 'bg-zinc-900', 
    description: 'K-Means clustering analysis of Twitter engagement patterns.', 
    tech: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Seaborn'], 
    link: 'https://github.com/Andyreww/Apple-Vision-Pro-Engagement', 
    video: '/assets/vision-pro-reveal.mp4',
    overview: 'This project uses the K-Means clustering algorithm to analyze engagement metrics on tweets related to the Apple Vision Pro launch. The goal was to uncover patterns in how users interacted with promotional content and discussions surrounding the product.',
    data: 'The analysis utilized a Kaggle dataset containing Twitter engagement metrics (likes, retweets, replies, quotes, views, bookmarks) for tweets mentioning "Apple Vision Pro". Handling missing values through imputation or removal based on metric importance. Scaling metrics using Min-Max normalization to ensure equal weighting in the clustering algorithm. Selecting key metrics relevant to direct user engagement (e.g., Likes, Retweets, Replies, Views).',
    methodology: 'The K-Means algorithm was applied to group tweets into 3 distinct clusters based on their engagement profiles. The optimal number of clusters was determined using the Elbow method. Clusters were visualized using 2D scatter plots generated with Matplotlib and Seaborn: Likes vs. Retweets, Replies vs. Quotes, Views vs. Bookmarks.',
    conclusion: 'The clustering results effectively segmented tweets into distinct engagement categories (e.g., high-reach/low-interaction, high-discussion, balanced engagement). These insights highlight how influential users and specific content types shape public discourse and can inform future marketing strategies.'
  },
  { 
    id: 'music', 
    title: 'Music Classifier & Recommender', 
    icon: '🎵', 
    color: 'bg-neutral-800', 
    description: 'Deep learning system (CNN) to classify music genres.', 
    tech: ['Python', 'Librosa', 'NumPy', 'TensorFlow/Keras', 'Matplotlib', 'JSON', 'OS'], 
    link: 'https://github.com/Andyreww/Music-Classifier-Recommender', 
    video: '/assets/waveform.mp4',
    overview: 'This project analyzes audio features from uploaded .wav files using Librosa and classifies the music genre via a pre-trained Keras neural network. It serves as the analysis core for a potential music recommendation system.',
    methodology: 'The system processes standard .wav audio files: Loads audio data using Librosa. Extracts key audio features, primarily Mel-Frequency Cepstral Coefficients (MFCCs), which represent the short-term power spectrum of sound. Feeds these features into a pre-trained Convolutional Neural Network (CNN) model built with Keras/TensorFlow. The model predicts the most likely music genre.',
    projectRole: 'This component acts as the front-end analysis tool within a larger pipeline: Users can upload a song (.wav). Receives a genre prediction and potentially visual feedback (like the waveform/spectrogram shown). Connects to related notebooks for model training (music_classifier.ipynb) and data preprocessing (music_preprocess.ipynb). Provides the basis for recommending similar music.',
    conclusion: 'The primary goal is accurate music genre classification from raw audio. This enables applications like automated music library organization, content-based recommendation engines, and music information retrieval systems.'
  },
  { 
    id: 'forsaken', 
    title: 'FORSAKEN', 
    icon: '⚔️', 
    color: 'bg-stone-900', 
    description: 'A souls-like dungeon crawler built in Unity.', 
    tech: ['Unity', 'C#'], 
    link: 'games/Forsaken/index.html', 
    isGame: true, 
    video: '/assets/Forsaken_vid.mp4',
    overview: 'Forsaken is a souls-like game where the player navigates challenging dungeons, defeating bosses, and finding cool weapons! Built with Unity, the game explores unique gameplay mechanics.',
    keyMechanics: 'Gameplay innovation centers around high-risk, high-reward combat and resource management: Revive slain bosses/enemies as temporary allies. Unique weapons with stats dependent on the player\'s current HP/Mana levels. Killing enemies restores HP/Mana, encouraging aggressive play. High-cost spells with cooldowns to ensure strategic use.',
    development: 'This game was developed as a team project using the Unity engine. My specific responsibilities included: Wrote modular C# scripts for reusability across different enemies, and player abilities. Led & Developed implementation of inventory systems, UI, combat animations, movement mechanics, enemy behaviors, and revival mechanic to better enhance player experience. Collaborated with a 4-person team to balance difficulty and create an immersive gameplay loop.',
    webBuild: 'Web Build Available!'
  },
  { 
    id: 'network', 
    title: 'NetworkAI', 
    icon: '🤝', 
    color: 'bg-gray-900', 
    description: 'AI-powered platform connecting job seekers with company insiders.', 
    tech: ['Python', 'Flask', 'HTML', 'CSS', 'JavaScript', 'Bootstrap', 'AI/ML'], 
    link: '#', 
    video: '/assets/NetWorkAI_v.mp4',
    overview: 'NetworkAI addresses the common job market challenge where college students and early-career professionals face the frustrating cycle of cold applications. Instead of the "apply and pray" method, this platform provides a smarter, more personal way to connect with people behind job listings—hiring managers, alumni, or team members—giving applications context and visibility.',
    howItWorks: 'The platform intelligently enhances the job search process: Pulls job listings from popular sites. Uses AI and publicly available data to identify key employees at target companies associated with those listings. Surfaces relevant contact information where available and appropriate. Provides users with suggested outreach strategies and templates. Acts as a "LinkedIn power-up" focused on facilitating human connection, without requiring sign-ups from hiring managers.',
    features: 'NetworkAI aims to make networking less intimidating and more effective: Increases the likelihood of securing interviews by fostering warm connections. Helps users develop stronger, lasting professional networks. Offers thoughtfully designed templates and personalization tools for outreach. Includes outreach timing suggestions to maximize impact. Removes guesswork and reduces the feeling of isolation in the job search.',
    goal: 'To make the job search less isolating and more human by shifting focus from cold applications to warm connections. NetworkAI empowers job seekers to take control, stand out, and gain a real edge in a competitive market.'
  },
  { 
    id: 'manhwa', 
    title: 'AI Manhwa Scanlator', 
    icon: '🗯️', 
    color: 'bg-slate-900', 
    description: 'Automated translation pipeline for comics.', 
    tech: ['Python', 'PyTorch', 'OpenCV', 'Scikit-learn', 'Google Gemini API', 'Google Vision API', 'EasyOCR', 'Pillow', 'NumPy', 'CustomTkinter', 'PyInstaller'], 
    link: 'https://github.com/Andyreww/Manhwa-AI', 
    video: '/assets/manhwa_AI.mov',
    overview: 'An end-to-end computer vision pipeline that automates the entire process of "scanlating" raw Korean manhwa (webcomics). This tool uses a series of AI models to detect text bubbles, extract the original Korean text, translate it into natural-sounding English, and seamlessly typeset the new text back onto the original artwork, preserving the artistic integrity of the panel.',
    keyFeatures: 'Custom Object Detection Model: Trained a custom Faster R-CNN model from the ground up using PyTorch on a self-annotated dataset of 160+ manhwa panels to accurately detect and isolate speech bubbles of any shape or size. Generative AI Translation Engine: Integrated Google\'s Gemini LLM via its API, leveraging advanced prompt engineering to perform context-aware, emotionally resonant translations that mimic the style of professional scanlators, including handling dialogue and sound effects. Advanced OCR & Image Processing Pipeline: Built a multi-stage pipeline using OpenCV that automatically cleans, upscales, and denoises cropped text bubbles. The pipeline then uses a dual-engine OCR approach (Google Vision API & EasyOCR) to maximize text extraction accuracy from stylized fonts. Automated Inpainting & Typesetting: The system digitally erases the original Korean text using content-aware inpainting (cv2.INPAINT_TELEA) and then dynamically calculates the optimal font size, color, and wrapping to typeset the translated English text back into the bubble for a seamless final product.',
    goal: 'To significantly reduce the manual, time-consuming labor involved in traditional scanlation by creating a fully automated pipeline. The goal was to produce high-quality, natural-sounding English translations in a fraction of the time, making more manhwa accessible to a global audience.'
  },
  { 
    id: 'nooksii', 
    title: 'Nooksii', 
    icon: '/assets/Nooksii.png', 
    iconType: 'image',
    color: 'bg-emerald-900', 
    description: 'Student expense tracker and meal plan visualizer.', 
    tech: ['React', 'TypeScript', 'CSS', 'Node.js'], 
    link: 'https://nooksii.com/', 
    video: '/assets/Nooksii_Showcase.mp4',
    overview: 'A student-built tool to help track spending and visualize meal plan usage. This was inspired by my own struggle managing expenses during finals week.',
    projectRole: 'Creating a website that solves a problem I faced when I was in university and that was expense management. I frankly didn\'t know how much of a balance I had left when it came to finals week. This project aims to not fix this issue but give users a clear visual and help them manage their expenses better.',
    isWorkInProgress: true,
    startDate: 'Jun 2025 - Present'
  }
];

const LINKEDIN_CONTACT_DETAILS = [
  { label: 'Your Profile', value: 'linkedin.com/in/andyrew', link: 'https://www.linkedin.com/in/andyrew', icon: Linkedin },
  { label: 'Website', value: 'andrewanguloportfolio.com', link: 'https://andrewanguloportfolio.com', icon: Globe, note: 'Portfolio' },
  { label: 'Phone', value: '+1 (347) 942-7494', icon: Phone, note: 'Mobile' },
  { label: 'Address', value: 'Queens, NY', icon: MapPin },
  { label: 'Email', value: 'ajangulo8@gmail.com', link: 'mailto:ajangulo8@gmail.com', icon: Mail },
  { label: 'Birthday', value: 'May 30', icon: Calendar }
];

const LinkedInContactInfoCard = () => (
  <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
    <h3 className="text-sm font-bold mb-4">Contact Info</h3>
    <div className="space-y-4">
      {LINKEDIN_CONTACT_DETAILS.map(({ label, value, link, note, icon: Icon }) => (
        <div key={label} className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/80">
            <Icon size={16} />
          </div>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-wide text-white/40">{label}</div>
            {link ? (
              <a 
                href={link} 
                target={link.startsWith('http') ? '_blank' : undefined} 
                rel="noreferrer" 
                className="text-sm text-white font-semibold hover:text-blue-300 transition-colors break-all"
              >
                {value}
              </a>
            ) : (
              <div className="text-sm text-white font-semibold">{value}</div>
            )}
            {note && <div className="text-xs text-white/50">{note}</div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- APP DEFINITIONS ---
const RESUME_APP = { id: 'resume-viewer', title: 'Andrew_Angulo_Resume.pdf', icon: <FileText size={20}/>, color: 'bg-white', type: 'pdf', src: '/assets/Andrew Angulo Resume 2025F.pdf' };
const CONTACT_APP = { id: 'contact-mail', title: 'Compose Message', icon: <Mail size={20}/>, color: 'bg-blue-500', type: 'mail' };
const ABOUT_APP = { id: 'system-info', title: 'System Info', icon: <User size={20}/>, color: 'bg-gray-500', type: 'about' };
const TERMINAL_APP = { id: 'terminal', title: 'andyrew@github:~', icon: <Terminal size={20}/>, color: 'bg-black', type: 'terminal' };
const LINKEDIN_APP = { id: 'linkedin-profile', title: 'Profile / Andrew Angulo', icon: <Linkedin size={20}/>, color: 'bg-[#0077b5]', type: 'linkedin' };
const POPCORN_APP = { id: 'cinema-wallet', title: 'My Tickets', icon: <Popcorn size={20}/>, color: 'bg-red-600', type: 'cinema' };
const MONITOR_APP = { id: 'system-recursion', title: 'System Alert', icon: <Monitor size={20}/>, color: 'bg-yellow-500', type: 'monitor' };
const DESKTOP_DOCK_LAYOUT_ID = 'shared-desktop-dock';
const DESKTOP_DOCK_TRANSITION = {
  type: 'spring',
  stiffness: 170,
  damping: 24,
  mass: 0.6
};

// =========================================
// ========= 1. DESKTOP DYNAMIC NOTCH ======
// =========================================
const DynamicNotch = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); 
    const [isShuffled, setIsShuffled] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0); 
    const [isHoveringVolume, setIsHoveringVolume] = useState(false);
    const [direction, setDirection] = useState(0);
    const [isCrossfading, setIsCrossfading] = useState(false);
    const [hasScheduledCrossfade, setHasScheduledCrossfade] = useState(false);
    const audioRef = useRef(null);
    const fadeIntervalRef = useRef(null);
    const pendingFadeInVolumeRef = useRef(null);
    const preferredVolumeRef = useRef(0.5);
    const shuffleQueueRef = useRef([]);
    const shuffleHistoryRef = useRef([]);
    const isMutedRef = useRef(isMuted);
    const song = PLAYLIST[currentSongIndex];

    useEffect(() => {
        preferredVolumeRef.current = volume;
    }, [volume]);

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    const clearFadeInterval = useCallback(() => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => clearFadeInterval();
    }, [clearFadeInterval]);

    const cancelCrossfadeState = useCallback(() => {
        clearFadeInterval();
        setHasScheduledCrossfade(false);
        setIsCrossfading(false);
        pendingFadeInVolumeRef.current = null;
    }, [clearFadeInterval]);

    const startFadeIn = useCallback((targetVolume) => {
        if (!audioRef.current) return;
        if (isMutedRef.current || !targetVolume) {
            audioRef.current.volume = 0;
            pendingFadeInVolumeRef.current = null;
            setIsCrossfading(false);
            return;
        }
        clearFadeInterval();
        let step = 0;
        const stepDuration = (CROSSFADE_DURATION * 1000) / CROSSFADE_STEPS;
        fadeIntervalRef.current = setInterval(() => {
            step += 1;
            if (!audioRef.current) return;
            const newVolume = Math.min(targetVolume * (step / CROSSFADE_STEPS), targetVolume);
            audioRef.current.volume = newVolume;
            if (step >= CROSSFADE_STEPS) {
                clearFadeInterval();
                pendingFadeInVolumeRef.current = null;
                setIsCrossfading(false);
                audioRef.current.volume = targetVolume;
            }
        }, stepDuration);
    }, [clearFadeInterval]);

    useEffect(() => {
        if (!audioRef.current) return;
        const currentlyMuted = isMutedRef.current;
        const preferredVolume = currentlyMuted ? 0 : (pendingFadeInVolumeRef.current ? 0 : (preferredVolumeRef.current > 0 ? preferredVolumeRef.current : 0.5));
        const shouldFadeIn = Boolean(pendingFadeInVolumeRef.current) && !currentlyMuted;
            audioRef.current.src = song.src;
            audioRef.current.load();
        audioRef.current.muted = currentlyMuted;
        audioRef.current.volume = shouldFadeIn ? 0 : preferredVolume;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
                if (shouldFadeIn && pendingFadeInVolumeRef.current) {
                    startFadeIn(pendingFadeInVolumeRef.current);
                } else {
                    pendingFadeInVolumeRef.current = null;
                    setIsCrossfading(false);
                }
                setHasScheduledCrossfade(false);
            }).catch(() => {
                setIsPlaying(false);
                setHasScheduledCrossfade(false);
                pendingFadeInVolumeRef.current = null;
                setIsCrossfading(false);
            });
        }
    }, [song, startFadeIn]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.muted = isMuted;
        if (!isMuted && pendingFadeInVolumeRef.current === null) {
            const fallback = preferredVolumeRef.current > 0 ? preferredVolumeRef.current : 0.5;
            audioRef.current.volume = fallback;
        }
    }, [isMuted]);

    const getNextIndex = useCallback((current, direction = 1) => {
        if (!isShuffled) {
            const total = PLAYLIST.length;
            return (current + direction + total) % total;
        }

        if (PLAYLIST.length <= 1) return current;

        if (direction === -1) {
            if (shuffleHistoryRef.current.length === 0) return current;
            return shuffleHistoryRef.current.pop();
        }

        if (shuffleQueueRef.current.length === 0) {
            shuffleQueueRef.current = createShuffleQueue(current);
        }

        const nextIndex = shuffleQueueRef.current.shift();
        if (nextIndex === undefined) return current;

        shuffleHistoryRef.current.push(current);
        if (shuffleHistoryRef.current.length > PLAYLIST.length) {
            shuffleHistoryRef.current.shift();
        }

        return nextIndex;
    }, [isShuffled]);

    const goToSong = useCallback((direction = 1, { skipCrossfadeReset = false } = {}) => {
        if (!skipCrossfadeReset) {
            cancelCrossfadeState();
        }
        setDirection(direction);
        setCurrentSongIndex(prev => getNextIndex(prev, direction));
    }, [cancelCrossfadeState, getNextIndex]);

    const nextSong = useCallback((event, options = {}) => {
        if (event?.stopPropagation) event.stopPropagation();
        goToSong(1, options);
    }, [goToSong]);

    const prevSong = useCallback((event, options = {}) => {
        if (event?.stopPropagation) event.stopPropagation();
        goToSong(-1, options);
    }, [goToSong]);

    const startCrossfade = useCallback(() => {
        if (!audioRef.current || isCrossfading || hasScheduledCrossfade || isMuted) return;
        const activeVolume = audioRef.current.volume ?? (preferredVolumeRef.current > 0 ? preferredVolumeRef.current : 0.5);
        if (activeVolume <= 0.01) return;
        const targetVolume = preferredVolumeRef.current > 0 ? preferredVolumeRef.current : activeVolume;
        pendingFadeInVolumeRef.current = targetVolume;
        setHasScheduledCrossfade(true);
        setIsCrossfading(true);
        clearFadeInterval();
        let step = 0;
        const stepDuration = (CROSSFADE_DURATION * 1000) / CROSSFADE_STEPS;
        fadeIntervalRef.current = setInterval(() => {
            step += 1;
            if (!audioRef.current) return;
            const newVolume = Math.max(activeVolume * (1 - step / CROSSFADE_STEPS), 0);
            audioRef.current.volume = newVolume;
            if (step >= CROSSFADE_STEPS) {
                clearFadeInterval();
                goToSong(1, { skipCrossfadeReset: true });
            }
        }, stepDuration);
    }, [audioRef, isCrossfading, hasScheduledCrossfade, isMuted, clearFadeInterval, goToSong]);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 0;
        setCurrentTime(current);
        setDuration(dur);
        if (dur > 0) setProgress((current / dur) * 100);
        const remaining = dur - current;
        if (remaining > 0 && remaining <= CROSSFADE_THRESHOLD && !isMuted && !hasScheduledCrossfade) {
            startCrossfade();
        }
    };

    const handleVolumeChange = (e) => {
        e.stopPropagation();
        const newVol = parseFloat(e.target.value);
        if (isMuted && newVol > 0) {
            setIsMuted(false);
            if(audioRef.current) audioRef.current.muted = false;
        }
        setVolume(newVol);
        if(audioRef.current) audioRef.current.volume = newVol;
        cancelCrossfadeState();
    };

    const handleSeek = (e) => {
        if (!audioRef.current || duration === 0) return;
        const newProgress = parseFloat(e.target.value);
        if (isNaN(newProgress)) return;
        const newTime = (newProgress / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(newProgress);
        cancelCrossfadeState();
    };

    const toggleMute = (e) => {
        e?.stopPropagation?.();
        cancelCrossfadeState();
        if (isMuted) {
            setIsMuted(false);
            const restored = preferredVolumeRef.current > 0 ? preferredVolumeRef.current : 0.5;
            setVolume(restored);
            if(audioRef.current) {
                audioRef.current.muted = false;
                audioRef.current.volume = restored;
            }
        } else {
            setIsMuted(true);
            setVolume(0);
            if(audioRef.current) audioRef.current.muted = true;
        }
    };

    const toggleShuffle = (e) => {
        e?.stopPropagation?.();
        cancelCrossfadeState();
        setIsShuffled((prev) => {
            const next = !prev;
            if (next) {
                shuffleQueueRef.current = createShuffleQueue(currentSongIndex);
                shuffleHistoryRef.current = [];
            } else {
                shuffleQueueRef.current = [];
                shuffleHistoryRef.current = [];
            }
            return next;
        });
    };

    const togglePlay = (e) => {
        if(e) e.stopPropagation();
        cancelCrossfadeState();
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };
    const formatTime = (time) => { if(isNaN(time)) return "0:00"; const minutes = Math.floor(time / 60); const seconds = Math.floor(time % 60); return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; };
    const formatRemainingTime = (current, total) => { if(isNaN(current) || isNaN(total)) return "-0:00"; const remaining = total - current; const minutes = Math.floor(remaining / 60); const seconds = Math.floor(remaining % 60); return `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; };

    useEffect(() => {
        setGlobalAudioControls({
            source: 'desktop-notch',
            songTitle: song.title,
            songArtist: song.artist,
            artwork: song.art,
            accent: song.color,
            isPlaying,
            isMuted,
            initialUnmuted: !isMuted && volume > 0,
            togglePlay: () => togglePlay(),
            toggleMute: () => toggleMute(),
            next: () => nextSong(),
            prev: () => prevSong(),
        });
    }, [song, isPlaying, isMuted, nextSong, prevSong, togglePlay, toggleMute, volume]);

    useEffect(() => {
    return () => setGlobalAudioControls(null);
    }, []);
    const artVariants = { enter: (direction) => ({ rotateY: direction > 0 ? 90 : -90, opacity: 0 }), center: { rotateY: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }, exit: (direction) => ({ rotateY: direction > 0 ? -90 : 90, opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }) };

    return (
        <motion.div layout onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)} initial={{ width: 160, height: 32, borderRadius: 16, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} animate={{ width: isExpanded ? 400 : 160, height: isExpanded ? 200 : 32, borderRadius: isExpanded ? 32 : 16, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} transition={{ type: "spring", stiffness: 350, damping: 30 }} className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-[60] flex flex-col items-center justify-start overflow-hidden shadow-2xl cursor-default border-b border-white/5">
            <audio ref={audioRef} src={song.src} autoPlay muted={isMuted} onTimeUpdate={handleTimeUpdate} onEnded={() => nextSong()} onError={(e) => console.error("Audio error", e)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
            <motion.div layout className="w-full h-full relative">
                {!isExpanded && (
                    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                        <div className="flex items-center"><img src={song.art} alt="Art" className="w-5 h-5 rounded-sm object-cover opacity-80" /></div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#333]"><div className="w-[3px] h-[3px] rounded-full bg-[#0f1225] opacity-80" /></div>
                        <div className="flex gap-[2px] items-center h-3">{[1,2,3,4,5].map(i => ( <motion.div key={i} animate={isPlaying ? { height: [3, 10, 5, 12, 4] } : { height: 3 }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 }} className="w-[2px] rounded-full" style={{ backgroundColor: song.color }} /> ))}</div>
                    </motion.div>
                )}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div className="flex gap-4 w-full">
                                <div className="w-14 h-14 bg-neutral-800 rounded-xl shrink-0 overflow-hidden shadow-lg border border-white/10 perspective-1000">
                                     <AnimatePresence mode='popLayout' custom={direction}><motion.img key={currentSongIndex} src={song.art} alt={song.title} custom={direction} variants={artVariants} initial="enter" animate="center" exit="exit" className="w-full h-full object-cover block" /></AnimatePresence>
                                </div>
                                <div className="flex-1 flex flex-col justify-center min-w-0"><h4 className="text-white font-bold text-[15px] leading-tight truncate">{song.title}</h4><p className="text-white/50 text-[13px] font-medium truncate">{song.artist}</p></div>
                                <div className="flex gap-[3px] items-center h-full pt-2">{[1,2,3,4].map(i => ( <motion.div key={i} animate={isPlaying ? { height: [8, 20, 10, 24, 12] } : { height: 4 }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: i * 0.15, ease: "easeInOut" }} className="w-[3px] rounded-full" style={{ backgroundColor: song.color }} /> ))}</div>
                            </div>
                            <div className="w-full flex items-center gap-3 mt-1"><span className="text-[10px] text-white/40 font-mono font-medium w-[30px] text-left">{formatTime(currentTime)}</span><div className="h-[4px] flex-1 bg-white/10 rounded-full overflow-hidden relative"><motion.div className="absolute top-0 left-0 h-full rounded-full pointer-events-none" style={{ width: `${progress}%`, backgroundColor: song.color }} /><input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} aria-label="Seek through track" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div><span className="text-[10px] text-white/40 font-mono font-medium w-[30px] text-right">{formatRemainingTime(currentTime, duration)}</span></div>
                            <div className="relative flex items-center justify-center mt-2 w-full h-10">
                                <div className="absolute left-0 flex items-center group h-full z-20" onMouseEnter={() => setIsHoveringVolume(true)} onMouseLeave={() => setIsHoveringVolume(false)}>
                                    <button onClick={toggleMute} className="focus:outline-none">{isMuted || volume === 0 ? ( <VolumeX size={18} className="text-white/50 group-hover:text-white transition-colors cursor-pointer" /> ) : ( <Volume2 size={18} className="text-white/50 group-hover:text-white transition-colors cursor-pointer" /> )}</button>
                                    <motion.div animate={{ width: isHoveringVolume ? 80 : 0, opacity: isHoveringVolume ? 1 : 0 }} className="h-full flex items-center ml-2 overflow-hidden"><div className="relative w-20 h-1.5 bg-white/20 rounded-full"><div className="absolute top-0 left-0 h-full bg-white rounded-full pointer-events-none" style={{ width: `${volume * 100}%` }} /><input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div></motion.div>
                                </div>
                                <div className="flex items-center gap-6 z-10"><button onClick={prevSong} className="text-white/70 hover:text-white transition-colors active:scale-95"><SkipBack size={24} className="fill-current" /></button><button onClick={togglePlay} className="text-white hover:scale-105 transition-transform active:scale-95">{isPlaying ? ( <Pause size={36} className="fill-current" /> ) : ( <Play size={36} className="fill-current" /> )}</button><button onClick={nextSong} className="text-white/70 hover:text-white transition-colors active:scale-95"><SkipForward size={24} className="fill-current" /></button></div>
                                <div className="absolute right-0 flex items-center"><button onClick={toggleShuffle} className="focus:outline-none"><Shuffle size={18} className={`transition-colors cursor-pointer ${isShuffled ? "text-white" : "text-white/30 hover:text-white"}`} /></button></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

// =========================================
// ========= 2. MOBILE DYNAMIC ISLAND ======
// =========================================
const MobileDynamicIsland = ({ forceExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isCrossfading, setIsCrossfading] = useState(false);
    const [hasScheduledCrossfade, setHasScheduledCrossfade] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const audioRef = useRef(null);
    const islandRef = useRef(null);
    const fadeIntervalRef = useRef(null);
    const pendingFadeInVolumeRef = useRef(null);
    const preferredVolumeRef = useRef(DEFAULT_MOBILE_VOLUME);
    const shuffleQueueRef = useRef([]);
    const shuffleHistoryRef = useRef([]);
    const isMutedRef = useRef(isMuted);
    const lastUpdateRef = useRef(0);
    const song = PLAYLIST[currentSongIndex];

    const clearFadeInterval = useCallback(() => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => clearFadeInterval();
    }, [clearFadeInterval]);

    const cancelCrossfadeState = useCallback(() => {
        clearFadeInterval();
        setHasScheduledCrossfade(false);
        setIsCrossfading(false);
        pendingFadeInVolumeRef.current = null;
    }, [clearFadeInterval]);

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    const startFadeIn = useCallback((targetVolume) => {
        if (!audioRef.current) return;
        if (isMutedRef.current || !targetVolume) {
            audioRef.current.volume = 0;
            pendingFadeInVolumeRef.current = null;
            setIsCrossfading(false);
            return;
        }
        clearFadeInterval();
        let step = 0;
        const stepDuration = (CROSSFADE_DURATION * 1000) / CROSSFADE_STEPS;
        fadeIntervalRef.current = setInterval(() => {
            step += 1;
            if (!audioRef.current) return;
            const newVolume = Math.min(targetVolume * (step / CROSSFADE_STEPS), targetVolume);
            audioRef.current.volume = newVolume;
            if (step >= CROSSFADE_STEPS) {
                clearFadeInterval();
                pendingFadeInVolumeRef.current = null;
                setIsCrossfading(false);
                audioRef.current.volume = targetVolume;
            }
        }, stepDuration);
    }, [clearFadeInterval]);

    useEffect(() => {
        if (!audioRef.current) return;
        const isCurrentlyMuted = isMutedRef.current;
        const shouldFadeIn = Boolean(pendingFadeInVolumeRef.current) && !isCurrentlyMuted;
        const targetVolume = isCurrentlyMuted ? 0 : preferredVolumeRef.current;
            audioRef.current.src = song.src;
            audioRef.current.load();
        audioRef.current.muted = isCurrentlyMuted;
        audioRef.current.volume = shouldFadeIn ? 0 : targetVolume;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
                if (shouldFadeIn && pendingFadeInVolumeRef.current) {
                    startFadeIn(pendingFadeInVolumeRef.current);
                } else {
                    pendingFadeInVolumeRef.current = null;
                    setIsCrossfading(false);
                }
                setHasScheduledCrossfade(false);
            }).catch(() => {
                setIsPlaying(false);
                setHasScheduledCrossfade(false);
                pendingFadeInVolumeRef.current = null;
                setIsCrossfading(false);
            });
        }
    }, [song, startFadeIn]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.muted = isMuted;
        if (!isMuted && pendingFadeInVolumeRef.current === null) {
            audioRef.current.volume = preferredVolumeRef.current;
        }
    }, [isMuted]);

    // Touch/Click outside to close (only when expanded)
    useEffect(() => {
        if (!isExpanded) return;
        
        const handleClickOutside = (event) => {
            if (islandRef.current && !islandRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };
        
        // Small delay to avoid immediate closing on expand
        const timeout = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside, { passive: true });
        }, 100);
        
        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isExpanded]);

    const getNextIndex = useCallback((currentIndex, direction = 1) => {
        if (!isShuffled) {
            const total = PLAYLIST.length;
            return (currentIndex + direction + total) % total;
        }

        if (PLAYLIST.length <= 1) return currentIndex;

        if (direction === -1) {
            if (shuffleHistoryRef.current.length === 0) return currentIndex;
            return shuffleHistoryRef.current.pop();
        }

        if (shuffleQueueRef.current.length === 0) {
            shuffleQueueRef.current = createShuffleQueue(currentIndex);
        }

        const nextIndex = shuffleQueueRef.current.shift();
        if (nextIndex === undefined) return currentIndex;

        shuffleHistoryRef.current.push(currentIndex);
        if (shuffleHistoryRef.current.length > PLAYLIST.length) {
            shuffleHistoryRef.current.shift();
        }

        return nextIndex;
    }, [isShuffled]);

    const goToSong = useCallback((direction = 1, { skipCrossfadeReset = false } = {}) => {
        if (!skipCrossfadeReset) {
            cancelCrossfadeState();
        }
        setDirection(direction);
        setCurrentSongIndex(prev => getNextIndex(prev, direction));
    }, [cancelCrossfadeState, getNextIndex]);

    const nextSong = useCallback((event, options = {}) => {
        if (event?.stopPropagation) event.stopPropagation();
        goToSong(1, options);
    }, [goToSong]);

    const prevSong = useCallback((event, options = {}) => {
        if (event?.stopPropagation) event.stopPropagation();
        goToSong(-1, options);
    }, [goToSong]);

    const startCrossfade = useCallback(() => {
        if (!audioRef.current || isCrossfading || hasScheduledCrossfade || isMuted) return;
        const activeVolume = audioRef.current.volume ?? preferredVolumeRef.current;
        if (activeVolume <= 0.01) return;
        pendingFadeInVolumeRef.current = preferredVolumeRef.current;
        setHasScheduledCrossfade(true);
        setIsCrossfading(true);
        clearFadeInterval();
        let step = 0;
        const stepDuration = (CROSSFADE_DURATION * 1000) / CROSSFADE_STEPS;
        fadeIntervalRef.current = setInterval(() => {
            step += 1;
            if (!audioRef.current) return;
            const newVolume = Math.max(activeVolume * (1 - step / CROSSFADE_STEPS), 0);
            audioRef.current.volume = newVolume;
            if (step >= CROSSFADE_STEPS) {
                clearFadeInterval();
                goToSong(1, { skipCrossfadeReset: true });
            }
        }, stepDuration);
    }, [audioRef, isCrossfading, hasScheduledCrossfade, isMuted, clearFadeInterval, goToSong]);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        
        const now = Date.now();
        if (now - lastUpdateRef.current < 200) return;
        lastUpdateRef.current = now;

        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 0;
        setCurrentTime(current);
        setDuration(dur);
        if (dur > 0) setProgress((current / dur) * 100);
        const remaining = dur - current;
        if (remaining > 0 && remaining <= CROSSFADE_THRESHOLD && !isMuted && !hasScheduledCrossfade) {
            startCrossfade();
        }
    };

    const formatTime = (time) => {
        if(isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const formatRemainingTime = (current, total) => {
        if(isNaN(current) || isNaN(total)) return "-0:00";
        const remaining = total - current;
        const minutes = Math.floor(remaining / 60);
        const seconds = Math.floor(remaining % 60);
        return `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        cancelCrossfadeState();
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        cancelCrossfadeState();
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (audioRef.current) {
            audioRef.current.muted = newMuted;
            if (!newMuted) {
                audioRef.current.volume = preferredVolumeRef.current;
            }
        }
    };
    
    const handleSeek = (e) => {
        if (!audioRef.current || duration === 0) return;
        const newProgress = parseFloat(e.target.value);
        if (isNaN(newProgress)) return;
        const newTime = (newProgress / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(newProgress);
        cancelCrossfadeState();
    };

    const toggleShuffle = (e) => {
        if (e) e.stopPropagation();
        cancelCrossfadeState();
        setIsShuffled((prev) => {
            const next = !prev;
            if (next) {
                shuffleQueueRef.current = createShuffleQueue(currentSongIndex);
                shuffleHistoryRef.current = [];
            } else {
                shuffleQueueRef.current = [];
                shuffleHistoryRef.current = [];
            }
            return next;
        });
    };

    const artVariants = {
        enter: (direction) => ({ x: direction > 0 ? 20 : -20, opacity: 0, scale: 0.95 }),
        center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: (direction) => ({ x: direction > 0 ? -20 : 20, opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } })
    };

    const handleToggle = (e) => {
        if (forceExpanded) return;
        if (e.target.closest('button')) {
            return;
        }
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div 
            ref={islandRef}
            onClick={handleToggle}
            initial={{ width: 120, height: 30, borderRadius: 20 }} 
            animate={{ 
                width: (forceExpanded || isExpanded) ? 'calc(100% - 32px)' : 120, 
                height: (forceExpanded || isExpanded) ? 180 : 30, 
                borderRadius: (forceExpanded || isExpanded) ? 32 : 20
            }} 
            transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 30
            }}
            className="absolute top-3 left-1/2 -translate-x-1/2 bg-black z-[60] flex flex-col items-center justify-start overflow-hidden shadow-xl cursor-pointer select-none"
            style={{ 
                maxWidth: isExpanded ? 'calc(100% - 32px)' : 120,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
            }}
        >
            <audio 
                ref={audioRef} 
                src={song.src} 
                autoPlay 
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextSong} 
                onError={(e) => console.error("Audio error", e)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            
            {!forceExpanded && !isExpanded && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="w-full h-full flex items-center justify-between px-4 pointer-events-none"
                >
                            <div className="w-5 h-5 rounded-md bg-neutral-800 overflow-hidden shrink-0">
                        <img src={song.art} alt={song.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'}/>
                    </div>
                    <div className="flex gap-[2px] items-center h-3">
                        {[1,2,3,4].map(i => (
                            <motion.div 
                                key={i} 
                                animate={isPlaying ? { height: [3, 10, 5, 12, 4] } : { height: 3 }} 
                                transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 }} 
                                className="w-[2px] rounded-full" 
                                style={{ backgroundColor: song.color }} 
                            />
                        ))}
                    </div>
                </motion.div>
            )}
            
            <AnimatePresence mode="wait">
                {(isExpanded || forceExpanded) && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1, transition: { delay: 0.1 } }} 
                        exit={{ opacity: 0, transition: { duration: 0.1 } }} 
                        className="absolute inset-0 p-4 flex flex-col justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Section - Artwork and Title */}
                        <div className="flex gap-3 items-center w-full">
                            <div className="w-12 h-12 bg-neutral-800 rounded-xl shrink-0 overflow-hidden shadow-lg border border-white/10">
                                <AnimatePresence mode='wait' custom={direction}>
                                    <motion.img 
                                        key={currentSongIndex} 
                                        src={song.art} 
                                        alt={song.title} 
                                        custom={direction} 
                                        variants={artVariants} 
                                        initial="enter" 
                                        animate="center" 
                                        exit="exit" 
                                        className="w-full h-full object-cover block" 
                                        onError={(e) => e.target.style.display='none'}
                                    />
                                </AnimatePresence>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{song.title}</h4>
                                <p className="text-white/60 text-xs truncate">{song.artist}</p>
                            </div>
                            <div className="flex gap-[2px] items-center h-4">
                                {[1,2,3,4].map(i => (
                                    <motion.div 
                                        key={i} 
                                        animate={isPlaying ? { height: [4, 16, 8, 20, 10] } : { height: 4 }} 
                                        transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: i * 0.15, ease: "easeInOut" }} 
                                        className="w-[2px] rounded-full" 
                                        style={{ backgroundColor: song.color }} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full flex items-center gap-2 mt-2 mb-3">
                            <span className="text-[10px] text-white/40 font-mono font-medium w-[28px] text-left shrink-0">
                                {formatTime(currentTime)}
                            </span>
                            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                                <motion.div 
                                    className="absolute top-0 left-0 h-full rounded-full pointer-events-none" 
                                    style={{ width: `${progress}%`, backgroundColor: song.color }}
                                />
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    step="0.1" 
                                    value={progress} 
                                    onChange={handleSeek}
                                    aria-label="Seek through track"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <span className="text-[10px] text-white/40 font-mono font-medium w-[28px] text-right shrink-0">
                                {formatRemainingTime(currentTime, duration)}
                            </span>
                        </div>

                        {/* Controls */}
                        <div className="relative flex items-center justify-center gap-6 w-full">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleMute(e); }}
                                className="absolute left-0 text-white/50 hover:text-white active:scale-95 transition-colors"
                                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                            >
                                {isMuted ? (
                                    <VolumeX size={16} className="fill-current pointer-events-none" />
                                ) : (
                                    <Volume2 size={16} className="fill-current pointer-events-none" />
                                )}
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); prevSong(e); }}
                                className="text-white/70 hover:text-white active:scale-95 transition-colors"
                                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                            >
                                <SkipBack size={20} className="fill-current pointer-events-none" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); togglePlay(e); }}
                                className="text-white hover:scale-105 active:scale-95 transition-transform"
                                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                            >
                                {isPlaying ? (
                                    <Pause size={28} className="fill-current pointer-events-none" />
                                ) : (
                                    <Play size={28} className="fill-current pointer-events-none" />
                                )}
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); nextSong(e); }}
                                className="text-white/70 hover:text-white active:scale-95 transition-colors"
                                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                            >
                                <SkipForward size={20} className="fill-current pointer-events-none" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleShuffle(e); }}
                                className="absolute right-0 text-white/50 hover:text-white active:scale-95 transition-colors"
                                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                            >
                                <Shuffle size={16} className={`pointer-events-none ${isShuffled ? 'text-white' : 'text-white/50'}`} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// =========================================
// ========= 3. WINDOW COMPONENTS ==========
// =========================================

const MobileWindow = ({ app, onClose }) => {
    const dragControls = useDragControls();

    const handlePointerDown = (event) => {
        // Prevent the scrollable content from being hijacked; only start drag from the grab area
        dragControls.start(event);
    };

    // iOS-style drag to dismiss
    const handleDragEnd = (event, info) => {
        // If dragged down more than 150px or fast swipe down, close
        if (info.offset.y > 150 || info.velocity.y > 500) {
            onClose();
        }
    };
    
    // Mail state
    const [mailStep, setMailStep] = useState('compose');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [showLinkedInContact, setShowLinkedInContact] = useState(false);
    
    const handleSendMail = () => {
        setMailStep('sending');
        setTimeout(() => {
            setMailStep('sent');
            setTimeout(() => { 
                window.location.href = `mailto:ajangulo8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; 
            }, 1500);
        }, 1500);
    };

    // Determine project image/thumbnail
    const getProjectImage = (appId) => {
        const imageMap = {
            'vision': '/assets/vision-pro-static.jpeg',
            'music': '/assets/MCR.png',
            'forsaken': '/assets/Forsaken.png',
            'network': '/assets/NetworkAI.png',
            'manhwa': '/assets/manhwa-AI.png',
            'nooksii': '/assets/Nooksii.png'
        };
        return imageMap[appId] || null;
    };

    const projectImage = app.id ? getProjectImage(app.id) : null;

    return (
        <motion.div 
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 35,
                mass: 0.8
            }}
            className="absolute inset-0 bg-[#000] z-50 flex flex-col rounded-t-[40px] overflow-hidden"
        >
            {/* iOS-style handle bar with close button - Draggable area */}
            <div 
                className="relative flex flex-col items-center pt-4 pb-2 bg-transparent cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'pan-y' }}
                onPointerDown={handlePointerDown}
            >
                {/* Drag handle - more visible */}
                <div className="w-12 h-1.5 bg-white/50 rounded-full" />
            </div>

            {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-[#1c1c1e] rounded-t-[32px] relative">
                {/* Close button - positioned at top right of content area */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center active:bg-white/30 hover:bg-white/25 transition-all z-50 shadow-lg border border-white/10"
                    aria-label="Close"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <X size={20} className="text-white" strokeWidth={2.5} />
                </button>
                
                <div 
                    className="relative p-6 pb-32 text-white h-full pt-14 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
                > {/* pt-14 (~56px) to clear dynamic island when expanded */}
                    {/* PDF Viewer */}
                    {app.type === 'pdf' && (
                        <div className="h-[75vh] rounded-xl overflow-hidden bg-white">
                            <iframe src={app.src} className="w-full h-full" title="Resume" />
                        </div>
                    )}

                    {/* Project Cards - Only show for actual projects (not system apps like about, linkedin, mail, etc.) */}
                    {(app.video || app.title) && !['about', 'linkedin', 'mail', 'monitor', 'cinema', 'terminal', 'pdf'].includes(app.type) && app.id && (
                        <div className="space-y-6">
                            {/* Hero Video/Image */}
                            <div className="relative rounded-2xl overflow-hidden bg-neutral-900 aspect-video shadow-xl">
                                {app.video ? (
                                    <video 
                                        src={app.video} 
                                        autoPlay 
                                        muted 
                                        loop 
                                        playsInline 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to image if video fails
                                            e.target.style.display = 'none';
                                            const img = document.createElement('img');
                                            img.src = projectImage || `https://placehold.co/400x300/1c1c1e/fff?text=${encodeURIComponent(app.title || 'Project')}`;
                                            img.className = 'w-full h-full object-cover';
                                            e.target.parentElement.appendChild(img);
                                        }}
                                    />
                                ) : projectImage ? (
                                    <img 
                                        src={projectImage} 
                                        alt={app.title || 'Project'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src=`https://placehold.co/400x300/1c1c1e/fff?text=${encodeURIComponent(app.title || 'Project')}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium bg-neutral-800">
                                        {app.title || 'No Preview'}
                                    </div>
                                )}
                            </div>

                            {/* Project Title */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <h2 className="text-3xl font-bold">{app.title || 'Project'}</h2>
                                    {app.isWorkInProgress && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-600/20 text-amber-400 rounded-full text-[10px] font-medium border border-amber-500/30">
                                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                                            Work in Progress
                                        </div>
                                    )}
                                </div>
                                {app.webBuild && (
                                    <div className="inline-block px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium mb-3">
                                        {app.webBuild}
                                    </div>
                                )}
                                {app.startDate && (
                                    <div className="text-xs text-gray-400 mb-3 font-mono">{app.startDate}</div>
                                )}
                            </div>

                            {/* Overview */}
                            {app.overview && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Overview</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">{app.overview}</p>
                                </div>
                            )}

                            {/* Data & Preprocessing */}
                            {app.data && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Data & Preprocessing</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">{app.data}</p>
                                </div>
                            )}

                            {/* How It Works */}
                            {app.howItWorks && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">How It Works</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{app.howItWorks}</p>
                                </div>
                            )}

                            {/* Methodology */}
                            {app.methodology && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Methodology & Visualization</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">{app.methodology}</p>
                                </div>
                            )}

                            {/* Key Mechanics */}
                            {app.keyMechanics && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Key Mechanics</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{app.keyMechanics}</p>
                                </div>
                            )}

                            {/* Development & Role */}
                            {app.development && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Development & Role</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{app.development}</p>
                                </div>
                            )}

                            {/* Project Role */}
                            {app.projectRole && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Project Role</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{app.projectRole}</p>
                                </div>
                            )}

                            {/* Key Features */}
                            {app.keyFeatures && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Key Features</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{app.keyFeatures}</p>
                                </div>
                            )}

                            {/* Features */}
                            {app.features && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Features & Benefits</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{app.features}</p>
                                </div>
                            )}

                            {/* Conclusion */}
                            {(app.conclusion || app.goal) && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">
                                        {app.conclusion ? 'Conclusion & Impact' : app.goal ? 'Project Goal' : ''}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">{app.conclusion || app.goal}</p>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {app.tech && app.tech.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold text-white mb-3 uppercase tracking-wider">Technologies Used</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {app.tech.map((tech, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/5"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 pt-2">
                                {app.link && app.link !== '#' && (
                                <a 
                                    href={app.link} 
                                    target={app.isGame ? "_self" : "_blank"}
                                    rel="noreferrer" 
                                        className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-center rounded-xl font-semibold text-lg active:scale-95 transition-all shadow-lg shadow-blue-500/30"
                                >
                                    {app.isGame ? '▶ Play Game' : 'View Project →'}
                                </a>
                            )}
                            
                            {/* GitHub Link - Only for actual projects with GitHub repos */}
                            {!app.isGame && app.id && ['vision', 'music', 'manhwa'].includes(app.id) && (
                                <a 
                                    href={app.id === 'vision' ? 'https://github.com/Andyreww/Apple-Vision-Pro-Engagement' : app.id === 'music' ? 'https://github.com/Andyreww/Music-Classifier-Recommender/tree/main' : app.id === 'manhwa' ? 'https://github.com/Andyreww/Manhwa-AI' : '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full py-3 border border-white/20 text-white text-center rounded-xl font-medium active:bg-white/10 transition-colors"
                                >
                                    View on GitHub →
                                </a>
                            )}
                            </div>
                        </div>
                    )}

                    {/* Terminal - Full desktop version with iOS styling */}
                    {app.type === 'terminal' && (
                        <div className="font-mono text-xs leading-relaxed">
                            {/* Neofetch-style output */}
                            <div className="mb-6">
                                <span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-300">neofetch</span>
                            </div>
                            <div className="flex flex-col gap-4 mb-6">
                                <div>
                                    <div><span className="text-green-400 font-bold">andyreww</span>@<span className="text-green-400">denison</span></div>
                                    <div className="text-gray-500">------------------</div>
                                    <div><span className="text-yellow-300">OS</span>: PortfolioOS v2.0</div>
                                    <div><span className="text-yellow-300">Role</span>: CS Graduate</div>
                                    <div><span className="text-yellow-300">Uptime</span>: 4 Years (Degree)</div>
                                    <div><span className="text-yellow-300">Packages</span>: 21 (Repos)</div>
                                    <div><span className="text-yellow-300">Shell</span>: zsh 5.8</div>
                                    <div><span className="text-yellow-300">Contributions</span>: 498 (Last Year)</div>
                                    <div><span className="text-yellow-300">Memory</span>: 99% Coffee / 1% Code</div>
                                </div>
                            </div>
                            
                            {/* Pinned repos */}
                            <div className="mb-6">
                                <span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-300">ls -la ./pinned-repos</span>
                            </div>
                            <div className="space-y-1 text-gray-400 mb-6 pl-4">
                                <div>drwx------ <span className="text-blue-400">Genshin-Impact-Assistant</span> (Python)</div>
                                <div>drwx------ <span className="text-blue-400">Arknights-Scraper</span> (Jupyter)</div>
                                <div>drwx------ <span className="text-blue-400">Apple-Vision-Pro-Analysis</span> (ML)</div>
                                <div>drwx------ <span className="text-blue-400">Music-Classifier</span> (Audio)</div>
                                <div>drwx------ <span className="text-blue-400">Portfolio-Website</span> (React)</div>
                            </div>
                            
                            <div className="mb-6">
                                <span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-300 animate-pulse">_</span>
                            </div>
                            
                            <a 
                                href="https://github.com/andyreww/" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="block w-full py-4 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-semibold border border-white/10 transition-colors active:scale-95"
                            >
                                Open GitHub Profile <ExternalLink size={14} className="inline ml-1" />
                            </a>
                        </div>
                    )}

                    {/* About - Full desktop version with iOS styling */}
                    {app.type === 'about' && (
                        <div className="flex flex-col items-center text-center pt-4">
                            <div className="w-28 h-28 bg-gray-300 rounded-full mb-6 overflow-hidden shadow-xl border-4 border-gray-400">
                                <img src="/assets/pfp.png" alt="Andrew" className="w-full h-full object-cover" onError={(e) => e.target.src='https://placehold.co/100x100?text=User'}/>
                            </div>
                            <h2 className="text-3xl font-bold mb-1 text-white">Andrew Angulo</h2>
                            <p className="text-gray-400 mb-6 text-base">Full Stack Engineer • Version 2.0.25</p>
                            
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 w-full p-5 text-left mb-6">
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-gray-400 text-sm">Location</span>
                                    <span className="text-white font-medium text-sm">Queens, NY</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-gray-400 text-sm">Education</span>
                                    <span className="text-white font-medium text-sm">Denison Univ.</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-gray-400 text-sm">Status</span>
                                    <span className="text-green-400 font-medium text-sm">● Available for Work</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400 text-sm">Focus</span>
                                    <span className="text-white font-medium text-sm">React, Python, Unity</span>
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-gray-500">Serial Number: 867-5309-JENNY</p>
                        </div>
                    )}

                    {/* LinkedIn - Full desktop version with iOS styling */}
                    {app.type === 'linkedin' && (
                        <div className="pt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {/* Banner */}
                            <div className="h-32 relative -mx-6 -mt-6 mb-16 overflow-visible">
                                <img src="/assets/LinkedInBanner.png" alt="LinkedIn Banner" className="w-full h-24 object-cover" />
                                <div className="absolute -bottom-8 left-6 w-24 h-24 rounded-full border-4 border-[#1c1c1e] overflow-hidden bg-black shadow-xl z-10">
                                    <img src="/assets/pfp.png" alt="Andrew" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=User'}/>
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <h2 className="text-2xl font-bold mb-1">Andrew Angulo</h2>
                                <p className="text-gray-300 text-sm mb-3 leading-relaxed">Aspiring Tech Professional | Python & Data Projects | Exploring Product, Engineering, and Innovation</p>
                                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4 flex-wrap">
                                    <MapPin size={12}/>
                                    <span>New York City Metropolitan Area</span>
                                    <span className="mx-1">•</span>
                                    <button 
                                        onClick={() => setShowLinkedInContact(!showLinkedInContact)} 
                                        className="text-blue-400 font-semibold inline-flex items-center gap-1 hover:text-blue-300 transition-colors"
                                    >
                                        Contact info
                                        <ChevronRight size={14} className={`transition-transform ${showLinkedInContact ? 'rotate-90' : ''}`} />
                                    </button>
                                </div>
                                
                                <AnimatePresence>
                                    {showLinkedInContact && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <LinkedInContactInfoCard />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <div className="flex gap-2 mb-6">
                                    <a 
                                        href="https://www.linkedin.com/in/andyrew/" 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-center py-3 rounded-xl font-semibold text-sm active:scale-95 transition-all"
                                    >
                                        Connect
                                    </a>
                                </div>
                                
                                {/* Experience Section */}
                                <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
                                    <h3 className="text-sm font-bold mb-4">Experience</h3>
                                    <div className="space-y-5">
                                        {/* RedTech Event Lead */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">RT</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">RedTech Event Lead</div>
                                                <div className="text-xs text-gray-400 mb-0.5">RedTech · Part-time · 2 yrs 4 mos</div>
                                                <div className="text-xs text-gray-400 mb-1">Denison University · On-site</div>
                                                <div className="text-xs text-gray-500 mb-2">Aug 2024 - May 2025 · 10 mos</div>
                                                <ul className="text-xs text-gray-300 space-y-1 mb-2 list-disc list-inside">
                                                    <li>Led live event setups, coordinating sound and lighting systems under tight deadlines.</li>
                                                    <li>Mentored and trained junior technicians, fostering collaboration and technical growth.</li>
                                                    <li>Troubleshot technical issues in real time, ensuring seamless event delivery.</li>
                                                </ul>
                                                <div className="text-xs text-gray-400">Team Leadership, Problem Solving and +1 skill</div>
                                            </div>
                                        </div>
                                        
                                        {/* RedTech Technician */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">RT</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">RedTech Technician</div>
                                                <div className="text-xs text-gray-400 mb-1">RedTech · Part-time · 2 yrs 4 mos</div>
                                                <div className="text-xs text-gray-500 mb-2">Feb 2023 - Oct 2024 · 1 yr 9 mos</div>
                                                <ul className="text-xs text-gray-300 space-y-1 mb-2 list-disc list-inside">
                                                    <li>Set up and tested A/V equipment including speakers, mics, wiring, and lighting for campus events.</li>
                                                    <li>Ensured reliable performance of technical systems through attention to detail and systematic problem-solving.</li>
                                                </ul>
                                                <div className="text-xs text-gray-400">Attention to Detail, Sound Equipment and +3 skills</div>
                                            </div>
                                        </div>
                                        
                                        {/* Front of House Student Manager */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">Front of House Student Manager</div>
                                                <div className="text-xs text-gray-400 mb-0.5">Denison University · Part-time · 2 yrs 5 mos</div>
                                                <div className="text-xs text-gray-400 mb-1">Granville, Ohio, United States · On-site</div>
                                                <div className="text-xs text-gray-500 mb-2">Jan 2024 - May 2025 · 1 yr 5 mos</div>
                                                <ul className="text-xs text-gray-300 space-y-1 mb-2 list-disc list-inside">
                                                    <li>Supervised a 15-person team, improving efficiency and workflow across daily operations.</li>
                                                    <li>Applied leadership and conflict resolution skills to resolve service issues under pressure.</li>
                                                </ul>
                                                <div className="text-xs text-gray-400">Team Leadership, Time & Attendance and +1 skill</div>
                                            </div>
                                        </div>
                                        
                                        {/* Student Ambassador */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">Student Ambassador</div>
                                                <div className="text-xs text-gray-400 mb-1">Denison University · Part-time · 2 yrs 5 mos</div>
                                                <div className="text-xs text-gray-500 mb-2">Sep 2023 - Mar 2024 · 7 mos</div>
                                                <ul className="text-xs text-gray-300 space-y-1 mb-2 list-disc list-inside">
                                                    <li>Represented the university in outreach events, supporting prospective student engagement.</li>
                                                </ul>
                                                <div className="text-xs text-gray-400">Communication and Customer Relationship Management (CRM)</div>
                                            </div>
                                        </div>
                                        
                                        {/* Front of House Assistant */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">Front of House Assistant</div>
                                                <div className="text-xs text-gray-400 mb-1">Denison University · Part-time · 2 yrs 5 mos</div>
                                                <div className="text-xs text-gray-500 mb-2">Jan 2023 - Jan 2024 · 1 yr 1 mo</div>
                                                <ul className="text-xs text-gray-300 space-y-1 mb-2 list-disc list-inside">
                                                    <li>Assisted in daily operations, customer support, and workflow management.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        {/* AMC Crew Member */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">AM</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">Crew Member</div>
                                                <div className="text-xs text-gray-400 mb-0.5">AMC Theatres · Part-time</div>
                                                <div className="text-xs text-gray-400 mb-1">Ohio, United States · On-site</div>
                                                <div className="text-xs text-gray-500 mb-2">Sep 2021 - Mar 2022 · 7 mos</div>
                                                <ul className="text-xs text-gray-300 space-y-1 mb-2 list-disc list-inside">
                                                    <li>Delivered customer service in a fast-paced environment while handling concessions, ticketing, and guest assistance.</li>
                                                    <li>Strengthened communication and teamwork skills through daily collaboration.</li>
                                                </ul>
                                                <div className="text-xs text-gray-400">Attention to Detail, Customer Service and +3 skills</div>
                                            </div>
                                        </div>
                                        
                                        {/* Web Developer - America On Tech */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">AT</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">Web Developer</div>
                                                <div className="text-xs text-gray-400 mb-1">America On Tech · Apprenticeship</div>
                                                <div className="text-xs text-gray-500 mb-2">Sep 2020 - May 2021 · 9 mos</div>
                                                <ul className="text-xs text-gray-300 space-y-1 mb-2 list-disc list-inside">
                                                    <li>Completed 160+ hours of coding workshops led by engineers from major tech firms.</li>
                                                    <li>Built front-end projects using HTML, CSS, JavaScript, and Bootstrap.</li>
                                                </ul>
                                                <div className="text-xs text-gray-400">JavaScript, HTML and +7 skills</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Education Section */}
                                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                    <h3 className="text-sm font-bold mb-4">Education</h3>
                                    <div className="space-y-4">
                                        {/* Denison University */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">Denison University</div>
                                                <div className="text-xs text-gray-400 mb-1">Bachelor's degree, Computer Science</div>
                                                <div className="text-xs text-gray-500 mb-1">Aug 2021 – May 2025</div>
                                                <div className="text-xs text-gray-400">Grade: Alumni</div>
                                                <div className="text-xs text-gray-400 mt-1">Activities and societies: Badminton Club, Theatre</div>
                                            </div>
                                        </div>
                                        
                                        {/* Forest Hills High School */}
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">FH</div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold mb-0.5">Forest Hills High School</div>
                                                <div className="text-xs text-gray-400 mb-1">High School Diploma, Computer Science</div>
                                                <div className="text-xs text-gray-500">2017 – 2021</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mail - Full desktop version with iOS styling */}
                    {app.type === 'mail' && (
                        <div className="pt-4">
                            {mailStep === 'compose' ? (
                                <>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                            <span className="text-gray-400 text-sm w-12">To:</span>
                                            <span className="text-white text-sm bg-blue-600/20 px-3 py-1 rounded-full text-blue-400 font-medium">Andrew Angulo</span>
                                        </div>
                                        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                            <span className="text-gray-400 text-sm w-12">Subject:</span>
                                            <input 
                                                type="text" 
                                                className="bg-transparent border-none outline-none text-white text-sm flex-1 placeholder-gray-500" 
                                                placeholder="Project Inquiry..." 
                                                value={subject} 
                                                onChange={(e) => setSubject(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <textarea 
                                        className="w-full bg-transparent border-none outline-none text-white text-base resize-none placeholder-gray-500 mb-6 min-h-[200px]" 
                                        placeholder="Hey Andrew, I'd love to connect..."
                                        value={body} 
                                        onChange={(e) => setBody(e.target.value)}
                                    ></textarea>
                                    <button 
                                        onClick={handleSendMail} 
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-colors active:scale-95"
                                    >
                                        Send <Send size={18} />
                                    </button>
                                </>
                            ) : mailStep === 'sending' ? (
                                <div className="flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"/>
                                    <h3 className="text-white font-bold text-xl">Redirecting...</h3>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                        <Send size={40} className="text-green-500" />
                                    </div>
                                    <h3 className="text-white font-bold text-2xl mb-2">Simulation Complete</h3>
                                    <p className="text-gray-400 text-sm max-w-[280px] mb-8">Opening your default mail client to finish the job...</p>
                                    <button 
                                        onClick={onClose} 
                                        className="text-gray-400 hover:text-white text-sm active:scale-95 transition-colors"
                                    >
                                        Close Window
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cinema/Ticket - Full desktop version with iOS styling */}
                    {app.type === 'cinema' && (
                        <div className="pt-0 -mx-6 -mt-6">
                            {/* Red ticket header */}
                            <div className="h-40 bg-[#dc2626] relative overflow-hidden flex items-end p-6">
                                {/* Noise texture overlay */}
                                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23noiseFilter)%27%2F%3E%3C%2Fsvg%3E')] mix-blend-multiply" />
                                
                                {/* Ticket icon in corner */}
                                <Ticket className="absolute top-6 right-6 text-white/20 rotate-12" size={48} />
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-2 text-white/80">Admit One</div>
                                    <h2 className="text-3xl font-black leading-tight text-white">SUPER MARIO<br/>GALAXY</h2>
                                </div>
                            </div>
                            
                            {/* Bottom section with dashed border */}
                            <div className="p-6 bg-[#1a1a1a] border-t-2 border-dashed border-white/20 relative">
                                {/* Ticket holes */}
                                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#1c1c1e] rounded-full" />
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#1c1c1e] rounded-full" />
                                
                                {/* Date and Time */}
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase mb-1">Date</div>
                                        <div className="text-base font-medium text-white">April 3, 2026</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-white/40 uppercase mb-1">Time</div>
                                        <div className="text-base font-medium text-white">12:00 AM</div>
                                    </div>
                                </div>
                                
                                {/* Barcode area */}
                                <div className="bg-white p-3 rounded-xl mb-6">
                                    <div className="w-full h-12 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABCAYAAAD5PA/NAAAAFklEQVR42mN88P//fwYoYARxMDJQAAA0rwL5J09jKAAAAABJRU5ErkJggg==')] bg-repeat-x bg-contain opacity-80" />
                                </div>
                                
                                {/* Watch Trailer button */}
                                <a 
                                    href="https://www.youtube.com/watch?v=GuCejewteF8" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="block w-full bg-white text-black text-center py-4 rounded-xl font-bold text-base hover:bg-gray-200 transition-colors active:scale-95"
                                >
                                    Watch Trailer
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Monitor - Full desktop version with iOS styling */}
                    {app.type === 'monitor' && (
                        <div className="text-center pt-8">
                            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Monitor size={40} className="text-yellow-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Recursion Detected</h3>
                            <p className="text-gray-300 leading-relaxed mb-8 text-base max-w-sm mx-auto">
                                You are attempting to open the System while already inside the System. Proceeding may cause a paradox in the portfolio-time continuum.
                            </p>
                            <div className="flex gap-3 max-w-xs mx-auto">
                                <button 
                                    onClick={onClose} 
                                    className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-xl text-sm font-medium transition-colors active:scale-95"
                                >
                                    Abort
                                </button>
                                <button 
                                    onClick={onClose} 
                                    className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black py-4 rounded-xl text-sm font-bold transition-colors active:scale-95"
                                >
                                    Touch Grass
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- WINDOW WRAPPER WITH DRAG & RESIZE ---
const WindowWrapper = ({ 
  children, 
  initialWidth, 
  initialHeight, 
  initialTop, 
  initialLeft, 
  onClose, 
  zIndex, 
  onFocus, 
  containerRef, 
  titleBarContent,
  minWidth = 300,
  minHeight = 200,
  maxWidth,
  maxHeight
}) => {
  const dragControls = useDragControls();
  const windowRef = useRef(null);
  
  // Position state using motion values for smooth dragging
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Size state
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  // Store initial mouse position + geometry at the start of resize
  const [resizeStart, setResizeStart] = useState({
    mouseX: 0,
    mouseY: 0,
    containerLeft: 0,
    containerTop: 0,
    containerWidth: 0,
    containerHeight: 0,
    windowLeftAbs: 0,
    windowTopAbs: 0,
    windowRightAbs: 0,
    windowBottomAbs: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  // Initialize position - positions are relative to container, not viewport
  const hasInitializedPosition = useRef(false);
  useEffect(() => {
    if (hasInitializedPosition.current) return;
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth || containerRef.current.clientWidth;
    const containerHeight = containerRef.current.offsetHeight || containerRef.current.clientHeight;

    let initialX = initialLeft ?? containerWidth * 0.2;
    let initialY = initialTop ?? containerHeight * 0.2;

    initialX = Math.max(0, Math.min(initialX, containerWidth - initialWidth));
    initialY = Math.max(0, Math.min(initialY, containerHeight - initialHeight));

    x.set(initialX);
    y.set(initialY);
    hasInitializedPosition.current = true;
  }, [containerRef, initialLeft, initialTop, initialWidth, initialHeight, x, y]);

  // We use containerRef directly as drag constraints to keep the window inside the virtual desktop
  const [constraints, setConstraints] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  
  // Update constraints when container or window size changes
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth || containerRef.current.clientWidth;
    const containerHeight = containerRef.current.offsetHeight || containerRef.current.clientHeight;
    const inset = 24;

    setConstraints({
      left: inset,
      top: inset,
      right: containerWidth - width - inset,
      bottom: containerHeight - height - inset
    });
  }, [containerRef, width, height]);

  // Ref to access latest size in callbacks without triggering re-renders of effects
  const sizeRef = useRef({ width, height });
  useEffect(() => {
    sizeRef.current = { width, height };
  }, [width, height]);

  // Handle resize start
  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    const currentX = x.get();
    const currentY = y.get();

    const containerRect = containerRef.current?.getBoundingClientRect();
    const windowRect = windowRef.current?.getBoundingClientRect();

    const containerLeft = containerRect?.left ?? 0;
    const containerTop = containerRect?.top ?? 0;
    const containerWidth = containerRect?.width ?? containerRef.current?.offsetWidth ?? 0;
    const containerHeight = containerRect?.height ?? containerRef.current?.offsetHeight ?? 0;

    const windowLeftAbs = windowRect?.left ?? containerLeft + currentX;
    const windowTopAbs = windowRect?.top ?? containerTop + currentY;
    const windowRightAbs = windowLeftAbs + width;
    const windowBottomAbs = windowTopAbs + height;

    // Debug logging: initial geometry at resize start
    console.log('[WindowWrapper] resizeStart', {
      direction,
      mouse: { x: e.clientX, y: e.clientY },
      currentX,
      currentY,
      width,
      height,
    });

    // Store initial mouse position and geometry
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      containerLeft,
      containerTop,
      containerWidth,
      containerHeight,
      windowLeftAbs,
      windowTopAbs,
      windowRightAbs,
      windowBottomAbs,
      width,
      height,
      left: currentX,
      top: currentY,
    });
    onFocus();
    
    // Prevent text selection during resize (keeps interaction clean)
    document.body.style.userSelect = 'none';
  };

  // Handle resize
  useEffect(() => {
    if (!isResizing || !containerRef.current) return;

    const handleMouseMove = (e) => {
      // Pure delta-based resizing for smooth feel, no container clamps during drag
      const deltaX = e.clientX - resizeStart.mouseX;
      const deltaY = e.clientY - resizeStart.mouseY;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.left;
      let newY = resizeStart.top;

      // Horizontal resizing
      if (resizeDirection?.includes('e')) {
        // Dragging right edge
        newWidth = resizeStart.width + deltaX;
      }
      if (resizeDirection?.includes('w')) {
        // Dragging left edge: move X and adjust width
        newWidth = resizeStart.width - deltaX;
        newX = resizeStart.left + (resizeStart.width - newWidth);
      }

      // Vertical resizing
      if (resizeDirection?.includes('s')) {
        // Dragging bottom edge
        newHeight = resizeStart.height + deltaY;
      }
      if (resizeDirection?.includes('n')) {
        // Dragging top edge: move Y and adjust height
        newHeight = resizeStart.height - deltaY;
        newY = resizeStart.top + (resizeStart.height - newHeight);
      }

      // Apply min/max constraints
      newWidth = Math.max(minWidth, maxWidth ? Math.min(newWidth, maxWidth) : newWidth);
      newHeight = Math.max(minHeight, maxHeight ? Math.min(newHeight, maxHeight) : newHeight);

      setWidth(newWidth);
      setHeight(newHeight);
      x.set(newX);
      y.set(newY);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      // Re-enable selection
      document.body.style.userSelect = '';

      // After resizing, clamp the window fully inside the container
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const inset = 24;

        // Use latest width/height from ref to avoid stale closure issues
        const { width: currentWidth, height: currentHeight } = sizeRef.current;

        // Clamp width/height so they never exceed container inner area (account for inset both sides)
        let clampedWidth = Math.min(currentWidth, Math.max(0, containerWidth - inset * 2));
        let clampedHeight = Math.min(currentHeight, Math.max(0, containerHeight - inset * 2));

        const currentX = x.get();
        const currentY = y.get();

        const maxX = Math.max(inset, containerWidth - clampedWidth - inset);
        const maxY = Math.max(inset, containerHeight - clampedHeight - inset);
        const clampedX = Math.max(inset, Math.min(currentX, maxX));
        const clampedY = Math.max(inset, Math.min(currentY, maxY));

        setWidth(clampedWidth);
        setHeight(clampedHeight);
        x.set(clampedX);
        y.set(clampedY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, resizeStart, minWidth, minHeight, maxWidth, maxHeight, x, y, containerRef]);

  return (
    <motion.div
      ref={windowRef}
      // Disable dragging while resizing so the window doesn't move under the cursor
      drag={!isResizing}
      dragControls={dragControls}
      dragListener={false} // Only drag via title bar controls
      dragMomentum={false}
      dragElastic={0} // Hard stop at edges
      dragConstraints={constraints} // Use calculated constraints
      onDragStart={(event, info) => {
        console.log('[WindowWrapper] dragStart', {
          pointer: { x: info.point.x, y: info.point.y },
          x: x.get(),
          y: y.get(),
        });
      }}
      onDragEnd={(event, info) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        console.log('[WindowWrapper] dragEnd', {
          pointer: { x: info.point.x, y: info.point.y },
          final: { x: x.get(), y: y.get() },
          container: { width: rect.width, height: rect.height },
          windowSize: { width, height },
        });
      }}
      style={{
        x,
        y,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        position: 'absolute',
        left: 0,
        top: 0
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col shadow-2xl"
    >
      {/* Title Bar - Only draggable area */}
      <div
        onMouseDown={(e) => {
          dragControls.start(e);
          onFocus();
        }}
        className="h-8 bg-[#2c2c2e] border-b border-black flex items-center px-4 justify-between cursor-grab active:cursor-grabbing select-none"
      >
        {titleBarContent}
      </div>

      {/* Window Content */}
      <div 
        className="flex-1 overflow-hidden"
        style={{ height: `${height - 32}px` }}
      >
        {children}
      </div>

      {/* Resize Handles - only right side + vertical edges */}
      <>
        {/* Corners: top-right and bottom-right only */}
        <div
          onMouseDown={(e) => handleResizeStart(e, 'ne')}
          className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50"
          style={{
            background:
              'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.3) 100%)',
          }}
        />
        {/* Top and bottom edges (vertical resize only) */}
        <div
          onMouseDown={(e) => handleResizeStart(e, 'n')}
          className="absolute top-0 left-3 right-3 h-1 cursor-ns-resize z-50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 's')}
          className="absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize z-50"
        />
        {/* Right edge (horizontal resize) */}
        <div
          onMouseDown={(e) => handleResizeStart(e, 'e')}
          className="absolute right-0 top-3 bottom-3 w-1 cursor-ew-resize z-50"
        />
      </>
    </motion.div>
  );
};

// --- DESKTOP WINDOW ---
const DesktopWindow = ({ project, onClose, zIndex, onFocus, containerRef, index }) => {
  const [mailStep, setMailStep] = useState('compose'); 
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showLinkedInContact, setShowLinkedInContact] = useState(false);

  const handleSendMail = () => {
      setMailStep('sending');
      setTimeout(() => {
          setMailStep('sent');
          setTimeout(() => { window.location.href = `mailto:ajangulo8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }, 1500);
      }, 1500);
  };

  const getTitleBar = (customTitle) => (
    <>
      <div className="flex gap-2 group">
        <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 text-red-900 flex items-center justify-center hover:bg-red-400">
          <X size={8} className="opacity-0 group-hover:opacity-100" />
        </button>
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <span className="text-xs font-medium text-gray-400 flex items-center gap-2">{customTitle || project.title || project.type}</span>
      <div className="w-10" />
    </>
  );

  if (project.type === 'monitor') {
    return (
      <WindowWrapper
        initialWidth={400}
        initialHeight={300}
        initialTop={containerRef.current ? containerRef.current.clientHeight * 0.25 : 0}
        initialLeft={containerRef.current ? containerRef.current.clientWidth * 0.3 : 0}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        containerRef={containerRef}
        titleBarContent={
          <>
            <div className="flex gap-2 group">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 text-red-900 flex items-center justify-center hover:bg-red-400">
                <X size={8} className="opacity-0 group-hover:opacity-100" />
              </button>
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-[12px] font-medium text-yellow-500 flex items-center gap-2">
              <AlertTriangle size={12}/> System Alert
            </span>
            <div className="w-10" />
          </>
        }
        minWidth={350}
        minHeight={250}
      >
        <div className="bg-[#1c1c1e] border border-yellow-600/50 rounded-xl overflow-hidden flex flex-col text-white font-sans h-full">
          <div className="p-6 text-center flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Monitor size={32} className="text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Recursion Detected</h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">You are attempting to open the System while already inside the System. Proceeding may cause a paradox in the portfolio-time continuum.</p>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-medium transition-colors">Abort</button>
              <button onClick={onClose} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black py-2 rounded-lg text-sm font-bold transition-colors">Touch Grass</button>
            </div>
          </div>
        </div>
      </WindowWrapper>
    );
  }
  if (project.type === 'cinema') {
    return (
      <WindowWrapper
        initialWidth={320}
        initialHeight={450}
        initialTop={containerRef.current ? containerRef.current.clientHeight * 0.15 : 0}
        initialLeft={containerRef.current ? containerRef.current.clientWidth * 0.4 : 0}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        containerRef={containerRef}
        titleBarContent={getTitleBar()}
        minWidth={280}
        minHeight={400}
      >
        <div className="bg-[#222] border border-white/10 rounded-2xl overflow-hidden flex flex-col font-sans text-white h-full">
          <div className="h-32 bg-[#dc2626] relative overflow-hidden flex items-end p-4 shrink-0">
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23noiseFilter)%27%2F%3E%3C%2Fsvg%3E')] mix-blend-multiply" />
            <div className="relative z-10">
              <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Admit One</div>
              <h2 className="text-2xl font-black leading-none">SUPER MARIO<br/>GALAXY</h2>
            </div>
            <Ticket className="absolute top-4 right-4 text-white/20 rotate-12" size={48} />
          </div>
          <div className="p-5 bg-[#1a1a1a] border-t-2 border-dashed border-white/20 relative flex-1 overflow-hidden">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-[10px] text-white/40 uppercase">Date</div>
                <div className="text-sm font-medium">April 3, 2026</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-white/40 uppercase">Time</div>
                <div className="text-sm font-medium">12:00 AM</div>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg mb-4">
              <div className="w-full h-12 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABCAYAAAD5PA/NAAAAFklEQVR42mN88P//fwYoYARxMDJQAAA0rwL5J09jKAAAAABJRU5ErkJggg==')] bg-repeat-x bg-contain opacity-80" />
            </div>
            <a href="https://www.youtube.com/watch?v=GuCejewteF8" target="_blank" rel="noreferrer" className="block w-full bg-white text-black text-center py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
              Watch Trailer
            </a>
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-black rounded-full" />
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full" />
          </div>
        </div>
      </WindowWrapper>
    );
  }
  if (project.type === 'linkedin') { 
    return (
      <WindowWrapper
        initialWidth={500}
        initialHeight={Math.min(700, containerRef.current ? containerRef.current.clientHeight * 0.85 : 700)}
        initialTop={containerRef.current ? containerRef.current.clientHeight * 0.1 : 0}
        initialLeft={containerRef.current ? containerRef.current.clientWidth * 0.2 : 0}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        containerRef={containerRef}
        titleBarContent={getTitleBar('Profile / Andrew Angulo')}
        minWidth={450}
        minHeight={400}
        maxHeight={700}
      >
        <div className="bg-[#1b1f23] border border-black rounded-xl overflow-hidden flex flex-col font-sans text-white h-full">
        <div className="h-32 relative shrink-0 overflow-visible">
          <img src="/assets/LinkedInBanner.png" alt="LinkedIn Banner" className="w-full h-24 object-cover" />
          <div className="absolute -bottom-8 left-6 w-24 h-24 rounded-full border-4 border-[#1b1f23] overflow-hidden bg-black z-10">
            <img src="/assets/pfp.png" alt="Andrew" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=User'}/>
          </div>
        </div>
        
        <div className="pt-16 px-6 pb-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <h2 className="text-xl font-bold">Andrew Angulo</h2>
          <p className="text-sm text-white/80 mt-1">Aspiring Tech Professional | Python & Data Projects | Exploring Product, Engineering, and Innovation</p>
          <div className="flex items-center gap-1 text-xs text-white/50 mt-2 flex-wrap">
            <MapPin size={12}/> 
            <span>New York City Metropolitan Area</span>
            <span className="mx-1">•</span>
            <button 
              onClick={() => setShowLinkedInContact(!showLinkedInContact)} 
              className="text-blue-400 font-semibold inline-flex items-center gap-1 hover:text-blue-300 transition-colors"
            >
              Contact info
              <ChevronRight size={14} className={`transition-transform ${showLinkedInContact ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          <AnimatePresence>
            {showLinkedInContact && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <LinkedInContactInfoCard />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-4">
            <a href="https://www.linkedin.com/in/andyrew/" target="_blank" rel="noreferrer" className="w-full block bg-blue-600 hover:bg-blue-500 text-white text-center py-1.5 rounded-full text-sm font-medium transition-colors">Connect</a>
          </div>
          
          {/* Experience Section */}
          <div className="mt-6 p-4 bg-[#24292e] rounded-lg border border-white/5">
            <h3 className="text-sm font-bold mb-4">Experience</h3>
            <div className="space-y-5">
              {/* RedTech Event Lead */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">RT</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">RedTech Event Lead</div>
                  <div className="text-xs text-white/60 mb-0.5">RedTech · Part-time · 2 yrs 4 mos</div>
                  <div className="text-xs text-white/60 mb-1">Denison University · On-site</div>
                  <div className="text-xs text-white/40 mb-2">Aug 2024 - May 2025 · 10 mos</div>
                  <ul className="text-xs text-white/70 space-y-1 mb-2 list-disc list-inside">
                    <li>Led live event setups, coordinating sound and lighting systems under tight deadlines.</li>
                    <li>Mentored and trained junior technicians, fostering collaboration and technical growth.</li>
                    <li>Troubleshot technical issues in real time, ensuring seamless event delivery.</li>
                  </ul>
                  <div className="text-xs text-white/50">Team Leadership, Problem Solving and +1 skill</div>
                </div>
              </div>
              
              {/* RedTech Technician */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">RT</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">RedTech Technician</div>
                  <div className="text-xs text-white/60 mb-1">RedTech · Part-time · 2 yrs 4 mos</div>
                  <div className="text-xs text-white/40 mb-2">Feb 2023 - Oct 2024 · 1 yr 9 mos</div>
                  <ul className="text-xs text-white/70 space-y-1 mb-2 list-disc list-inside">
                    <li>Set up and tested A/V equipment including speakers, mics, wiring, and lighting for campus events.</li>
                    <li>Ensured reliable performance of technical systems through attention to detail and systematic problem-solving.</li>
                  </ul>
                  <div className="text-xs text-white/50">Attention to Detail, Sound Equipment and +3 skills</div>
                </div>
              </div>
              
              {/* Front of House Student Manager */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">Front of House Student Manager</div>
                  <div className="text-xs text-white/60 mb-0.5">Denison University · Part-time · 2 yrs 5 mos</div>
                  <div className="text-xs text-white/60 mb-1">Granville, Ohio, United States · On-site</div>
                  <div className="text-xs text-white/40 mb-2">Jan 2024 - May 2025 · 1 yr 5 mos</div>
                  <ul className="text-xs text-white/70 space-y-1 mb-2 list-disc list-inside">
                    <li>Supervised a 15-person team, improving efficiency and workflow across daily operations.</li>
                    <li>Applied leadership and conflict resolution skills to resolve service issues under pressure.</li>
                  </ul>
                  <div className="text-xs text-white/50">Team Leadership, Time & Attendance and +1 skill</div>
                </div>
              </div>
              
              {/* Student Ambassador */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">Student Ambassador</div>
                  <div className="text-xs text-white/60 mb-1">Denison University · Part-time · 2 yrs 5 mos</div>
                  <div className="text-xs text-white/40 mb-2">Sep 2023 - Mar 2024 · 7 mos</div>
                  <ul className="text-xs text-white/70 space-y-1 mb-2 list-disc list-inside">
                    <li>Represented the university in outreach events, supporting prospective student engagement.</li>
                  </ul>
                  <div className="text-xs text-white/50">Communication and Customer Relationship Management (CRM)</div>
                </div>
              </div>
              
              {/* Front of House Assistant */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">Front of House Assistant</div>
                  <div className="text-xs text-white/60 mb-1">Denison University · Part-time · 2 yrs 5 mos</div>
                  <div className="text-xs text-white/40 mb-2">Jan 2023 - Jan 2024 · 1 yr 1 mo</div>
                  <ul className="text-xs text-white/70 space-y-1 mb-2 list-disc list-inside">
                    <li>Assisted in daily operations, customer support, and workflow management.</li>
                  </ul>
                </div>
              </div>
              
              {/* AMC Crew Member */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">AM</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">Crew Member</div>
                  <div className="text-xs text-white/60 mb-0.5">AMC Theatres · Part-time</div>
                  <div className="text-xs text-white/60 mb-1">Ohio, United States · On-site</div>
                  <div className="text-xs text-white/40 mb-2">Sep 2021 - Mar 2022 · 7 mos</div>
                  <ul className="text-xs text-white/70 space-y-1 mb-2 list-disc list-inside">
                    <li>Delivered customer service in a fast-paced environment while handling concessions, ticketing, and guest assistance.</li>
                    <li>Strengthened communication and teamwork skills through daily collaboration.</li>
                  </ul>
                  <div className="text-xs text-white/50">Attention to Detail, Customer Service and +3 skills</div>
                </div>
              </div>
              
              {/* Web Developer - America On Tech */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">AT</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">Web Developer</div>
                  <div className="text-xs text-white/60 mb-1">America On Tech · Apprenticeship</div>
                  <div className="text-xs text-white/40 mb-2">Sep 2020 - May 2021 · 9 mos</div>
                  <ul className="text-xs text-white/70 space-y-1 mb-2 list-disc list-inside">
                    <li>Completed 160+ hours of coding workshops led by engineers from major tech firms.</li>
                    <li>Built front-end projects using HTML, CSS, JavaScript, and Bootstrap.</li>
                  </ul>
                  <div className="text-xs text-white/50">JavaScript, HTML and +7 skills</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Education Section */}
          <div className="mt-4 p-4 bg-[#24292e] rounded-lg border border-white/5">
            <h3 className="text-sm font-bold mb-4">Education</h3>
            <div className="space-y-4">
              {/* Denison University */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">DU</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">Denison University</div>
                  <div className="text-xs text-white/60 mb-1">Bachelor's degree, Computer Science</div>
                  <div className="text-xs text-white/40 mb-1">Aug 2021 – May 2025</div>
                  <div className="text-xs text-white/50">Grade: Alumni</div>
                  <div className="text-xs text-white/50 mt-1">Activities and societies: Badminton Club, Theatre</div>
                </div>
              </div>
              
              {/* Forest Hills High School */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">FH</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5">Forest Hills High School</div>
                  <div className="text-xs text-white/60 mb-1">High School Diploma, Computer Science</div>
                  <div className="text-xs text-white/40">2017 – 2021</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </WindowWrapper>
    );
  }
  if (project.type === 'terminal') {
    return (
      <WindowWrapper
        initialWidth={600}
        initialHeight={400}
        initialTop={containerRef.current ? containerRef.current.clientHeight * 0.2 : 0}
        initialLeft={containerRef.current ? containerRef.current.clientWidth * 0.2 : 0}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        containerRef={containerRef}
        titleBarContent={
          <>
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"/>
            </div>
            <div className="flex-1 text-center text-gray-500 text-xs">andyreww — -zsh — 80x24</div>
            <div className="w-10" />
          </>
        }
        minWidth={500}
        minHeight={300}
      >
        <div className="bg-[#0c0c0c] border border-[#333] rounded-lg overflow-hidden flex flex-col font-mono text-sm h-full">
          <div className="p-4 text-gray-300 flex-1 overflow-hidden font-mono text-xs leading-relaxed relative">
            <div className="mb-4"><span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-300">neofetch</span></div>
            <div className="flex gap-6">
              <div className="text-purple-500 font-bold select-none hidden md:block">{`      /\\\n     /  \\\n    /    \\\n   /      \\\n  /________\\\n  |   __   |\n  |  |  |  |\n  |__|__|__|`}</div>
              <div>
                <div><span className="text-green-400 font-bold">andyreww</span>@<span className="text-green-400">denison</span></div>
                <div>------------------</div>
                <div><span className="text-yellow-300">OS</span>: PortfolioOS v2.0</div>
                <div><span className="text-yellow-300">Role</span>: CS Graduate</div>
                <div><span className="text-yellow-300">Uptime</span>: 4 Years (Degree)</div>
                <div><span className="text-yellow-300">Packages</span>: 21 (Repos)</div>
                <div><span className="text-yellow-300">Shell</span>: zsh 5.8</div>
                <div><span className="text-yellow-300">Contributions</span>: 498 (Last Year)</div>
                <div><span className="text-yellow-300">Memory</span>: 99% Coffee / 1% Code</div>
              </div>
            </div>
            <div className="mt-4"><span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-300">ls -la ./pinned-repos</span></div>
            <div className="grid grid-cols-1 gap-1 text-gray-400 mt-1 pl-4">
              <div>drwx------ <span className="text-blue-400">Genshin-Impact-Assistant</span> (Python)</div>
              <div>drwx------ <span className="text-blue-400">Arknights-Scraper</span> (Jupyter)</div>
              <div>drwx------ <span className="text-blue-400">Apple-Vision-Pro-Analysis</span> (ML)</div>
              <div>drwx------ <span className="text-blue-400">Music-Classifier</span> (Audio)</div>
              <div>drwx------ <span className="text-blue-400">Portfolio-Website</span> (React)</div>
            </div>
            <div className="mt-4"><span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="animate-pulse">_</span></div>
            <a href="https://github.com/andyreww/" target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs border border-white/10 transition-colors">Open GitHub Profile <ExternalLink size={10} className="inline ml-1"/></a>
          </div>
        </div>
      </WindowWrapper>
    );
  }
  if (project.type === 'about') {
    return (
      <WindowWrapper
        initialWidth={400}
        initialHeight={450}
        initialTop={containerRef.current ? containerRef.current.clientHeight * 0.2 : 0}
        initialLeft={containerRef.current ? containerRef.current.clientWidth * 0.3 : 0}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        containerRef={containerRef}
        titleBarContent={getTitleBar('About This User')}
        minWidth={350}
        minHeight={400}
      >
        <div className="bg-[#ececec] text-black border border-gray-400 rounded-xl overflow-hidden flex flex-col font-sans h-full">
          <div className="p-8 flex flex-col items-center text-center flex-1 overflow-hidden">
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden shadow-inner">
              <img src="/assets/pfp.png" alt="Andrew" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=User'}/>
            </div>
            <h2 className="text-2xl font-bold mb-1">Andrew Angulo</h2>
            <p className="text-sm text-gray-500 mb-4">Full Stack Engineer • Version 2.0.25</p>
            <div className="bg-white rounded-lg border border-gray-200 w-full p-3 text-left text-sm space-y-2 shadow-sm">
              <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium">Queens, NY</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Education</span><span className="font-medium">Denison Univ.</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-green-600">● Available for Work</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Focus</span><span className="font-medium">React, Python, Unity</span></div>
            </div>
            <div className="mt-6 text-[10px] text-gray-400">Serial Number: 867-5309-JENNY</div>
          </div>
        </div>
      </WindowWrapper>
    );
  }
  if (project.type === 'mail') {
    return (
      <WindowWrapper
        initialWidth={500}
        initialHeight={400}
        initialTop={containerRef.current ? containerRef.current.clientHeight * 0.2 : 0}
        initialLeft={containerRef.current ? containerRef.current.clientWidth * 0.25 : 0}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        containerRef={containerRef}
        titleBarContent={getTitleBar(<><Mail size={12}/> New Message</>)}
        minWidth={450}
        minHeight={350}
      >
        <div className="bg-[#1e1e1e] backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
          <div className="flex-1 p-6 flex flex-col">
            {mailStep === 'compose' ? (
              <>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                    <span className="text-gray-500 text-sm w-12">To:</span>
                    <span className="text-white text-sm bg-blue-600/20 px-2 py-0.5 rounded text-blue-400">Andrew Angulo</span>
                  </div>
                  <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                    <span className="text-gray-500 text-sm w-12">Subject:</span>
                    <input type="text" className="bg-transparent border-none outline-none text-white text-sm flex-1 placeholder-gray-600" placeholder="Project Inquiry..." value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>
                </div>
                <textarea className="flex-1 bg-transparent border-none outline-none text-white text-sm resize-none placeholder-gray-600 mb-4" placeholder="Hey Andrew, I'd love to connect..." value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                <div className="flex justify-end">
                  <button onClick={handleSendMail} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">Send <Send size={14} /></button>
                </div>
              </>
            ) : mailStep === 'sending' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"/>
                <h3 className="text-white font-bold text-lg">Redirecting...</h3>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Send size={32} className="text-green-500" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Simulation Complete</h3>
                <p className="text-gray-400 text-sm max-w-[250px]">Opening your default mail client to finish the job...</p>
                <button onClick={onClose} className="mt-6 text-gray-500 hover:text-white text-sm">Close Window</button>
              </div>
            )}
          </div>
        </div>
      </WindowWrapper>
    );
  }
  if (project.type === 'pdf') {
    return (
      <WindowWrapper
        initialWidth={containerRef.current ? containerRef.current.clientWidth * 0.7 : 800}
        initialHeight={containerRef.current ? containerRef.current.clientHeight * 0.8 : 600}
        initialTop={containerRef.current ? containerRef.current.clientHeight * 0.1 : 0}
        initialLeft={containerRef.current ? containerRef.current.clientWidth * 0.15 : 0}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        containerRef={containerRef}
        titleBarContent={getTitleBar(<><FileText size={12}/> {project.title}</>)}
        minWidth={600}
        minHeight={400}
      >
        <div className="bg-[#333] backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
          <div className="flex-1 bg-[#525659] relative">
            <iframe src={project.src} className="w-full h-full" title="Resume" />
          </div>
        </div>
      </WindowWrapper>
    );
  }

  const randomTop = 10 + (index * 5); 
  const randomLeft = 20 + (index * 5);
  
  const titleBar = (
    <>
      <div className="flex gap-2 group">
        <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 text-red-900 flex items-center justify-center hover:bg-red-400">
          <X size={8} className="opacity-0 group-hover:opacity-100" />
        </button>
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <span className="text-xs font-medium text-gray-400 flex items-center gap-2">{project.title}</span>
      <div className="w-10" />
    </>
  );

  return (
    <WindowWrapper
      initialWidth={550}
      initialHeight={600}
      initialTop={containerRef.current ? containerRef.current.clientHeight * (randomTop / 100) : 0}
      initialLeft={containerRef.current ? containerRef.current.clientWidth * (randomLeft / 100) : 0}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      containerRef={containerRef}
      titleBarContent={titleBar}
      minWidth={450}
      minHeight={350}
    >
      <div className="bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-6 space-y-6">
            {/* Hero Video/Image */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative group">
            {project.video ? (
              <video src={project.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">No Preview</div>
            )}
          </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                {project.isWorkInProgress && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-600/20 text-amber-400 rounded-full text-[10px] font-medium border border-amber-500/30">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                    Work in Progress
                  </div>
                )}
              </div>
              {project.webBuild && (
                <div className="inline-block px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium mb-3">
                  {project.webBuild}
                </div>
              )}
              {project.startDate && (
                <div className="text-xs text-gray-400 mb-3 font-mono">{project.startDate}</div>
              )}
            </div>

            {/* Overview */}
            {project.overview && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Overview</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{project.overview}</p>
              </div>
            )}

            {/* Data & Preprocessing */}
            {project.data && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Data & Preprocessing</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{project.data}</p>
              </div>
            )}

            {/* How It Works */}
            {project.howItWorks && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">How It Works</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{project.howItWorks}</p>
              </div>
            )}

            {/* Methodology */}
            {project.methodology && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Methodology & Visualization</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{project.methodology}</p>
              </div>
            )}

            {/* Key Mechanics */}
            {project.keyMechanics && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Key Mechanics</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{project.keyMechanics}</p>
              </div>
            )}

            {/* Development & Role */}
            {project.development && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Development & Role</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{project.development}</p>
              </div>
            )}

            {/* Project Role */}
            {project.projectRole && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Project Role</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{project.projectRole}</p>
              </div>
            )}

            {/* Key Features */}
            {project.keyFeatures && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Key Features</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{project.keyFeatures}</p>
              </div>
            )}

            {/* Features */}
            {project.features && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Features & Benefits</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{project.features}</p>
              </div>
            )}

            {/* Conclusion */}
            {(project.conclusion || project.goal) && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                  {project.conclusion ? 'Conclusion & Impact' : project.goal ? 'Project Goal' : ''}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{project.conclusion || project.goal}</p>
              </div>
            )}

            {/* Technologies Used */}
            {project.tech && project.tech.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/5 text-gray-300">
                      {t}
                    </span>
                ))}
              </div>
            </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {project.link && project.link !== '#' && (
                <a 
                  href={project.link} 
                  target={project.isGame ? "_self" : "_blank"}
                  rel="noreferrer" 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  {project.isGame ? '▶ Play Game' : 'View Project'} <ExternalLink size={14} />
                </a>
              )}
              {!project.isGame && project.id && ['vision', 'music', 'manhwa'].includes(project.id) && (
                <a
                  href={project.id === 'vision' ? 'https://github.com/Andyreww/Apple-Vision-Pro-Engagement' : project.id === 'music' ? 'https://github.com/Andyreww/Music-Classifier-Recommender/tree/main' : project.id === 'manhwa' ? 'https://github.com/Andyreww/Manhwa-AI' : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 border border-white/20 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </WindowWrapper>
  );
};

// --- MAIN COMPONENT ---
export default function ProjectsDesktop({ setDockHidden, isDockHidden }) {
  const [openProjects, setOpenProjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeMobileApp, setActiveMobileApp] = useState(null); 
  const containerRef = useRef(null);
  const isMobile = useIsMobile(768);
  const isBelowDesktop = useIsMobile(1024);
  const isTablet = !isMobile && isBelowDesktop;

  const isInView = useInView(containerRef, { amount: 0.1, margin: "-30% 0px -30% 0px" });
  
  // Smooth scroll-based dock animation for mobile
  const sectionRef = useRef(null);
  const phoneFrameRef = useRef(null);
  const [phoneFrameReady, setPhoneFrameReady] = useState(false);
  const assignMobileFrameRef = useCallback((node) => {
    containerRef.current = node;
    phoneFrameRef.current = node;
    setPhoneFrameReady(Boolean(node));
  }, []);
  // Use useScroll with layoutEffect: false to prevent hydration warnings
  // This ensures the hook doesn't run during SSR or before the ref is attached
  // Offset: 0 = when section start reaches viewport end (bottom), 1 = when section end reaches viewport start (top)
  // This means scrollYProgress increases as we scroll up through the section

  const { scrollYProgress } = useScroll({
    target: phoneFrameReady ? phoneFrameRef : undefined,
    offset: ["start end", "end start"],
    layoutEffect: false // Prevents warning: ref not yet hydrated
  });

  // Smooth interpolation: dock slides into phone frame as section enters viewport
  // When scrollProgress is low (phone not yet visible): dock stays below frame
  // Dock becomes fully visible once the phone is roughly halfway through the viewport
  // When scrollProgress is high (scrolled past): dock slides back down
  const dockY = useTransform(scrollYProgress, 
    [0, 0.25, 0.45, 0.7, 1], 
    [100, 80, 0, 0, 100]
  );
  const dockOpacity = useTransform(scrollYProgress, 
    [0, 0.3, 0.45, 0.7, 1], 
    [0, 0, 1, 1, 0]
  );
  const dockScale = useTransform(scrollYProgress, 
    [0, 0.3, 0.45, 0.7, 1], 
    [0.85, 0.9, 1, 1, 0.9]
  );

  // Track when phone frame dock is visible to hide main dock
  const [isPhoneDockVisible, setIsPhoneDockVisible] = useState(false);
  const latestProgressRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    latestProgressRef.current = latest;
  });
  
  useEffect(() => {
    if (!isMobile) {
      setDockHidden(isInView);
      setIsPhoneDockVisible(false);
      return;
    }

    const updatePhoneDockState = () => {
      if (!sectionRef.current || !phoneFrameRef.current) return;

      const windowHeight = window.innerHeight || 0;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const phoneRect = phoneFrameRef.current.getBoundingClientRect();

      const sectionVisible = sectionRect.top < windowHeight && sectionRect.bottom > 0;
      const phoneHalfwayInView = phoneRect.top <= windowHeight * 0.45;
      const phoneStillOnScreen = phoneRect.bottom >= windowHeight * 0.35;
      const progressReady = latestProgressRef.current >= 0.35;

      const shouldShowPhoneDock =
        sectionVisible && phoneHalfwayInView && phoneStillOnScreen && progressReady;

      setIsPhoneDockVisible((prev) => {
        if (prev === shouldShowPhoneDock) {
          return prev;
        }
        setDockHidden(shouldShowPhoneDock);
        return shouldShowPhoneDock;
      });
    };

    latestProgressRef.current = scrollYProgress.get();
    updatePhoneDockState();

    let rafId = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePhoneDockState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updatePhoneDockState);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePhoneDockState);
      if (rafId) cancelAnimationFrame(rafId);
      setIsPhoneDockVisible(false);
      setDockHidden(false);
    };
  }, [isMobile, isInView, scrollYProgress, setDockHidden]);

  const openProject = (project) => {
      if(isMobile) { setActiveMobileApp(project); return; }
      if (!openProjects.find(p => p.id === project.id)) {
        setOpenProjects([...openProjects, project]);
      }
      setActiveId(project.id);
  };

  const openApp = (app) => {
      if(isMobile) { setActiveMobileApp(app); return; }
      setOpenProjects(prev => { 
        if (prev.find(p => p.id === app.id)) return prev; 
        return [...prev, app]; 
      });
      setActiveId(app.id);
  };

  const closeProject = (id) => { setOpenProjects(openProjects.filter(p => p.id !== id)); };

  // --- MOBILE RENDER ---
  if (isMobile) {
      return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-12 w-full bg-[#f4f4f0] flex flex-col items-center relative overflow-hidden"
      style={{ position: 'relative' }}
    >
             <div className="w-full px-6 mb-8 mt-12 relative z-10">
                <div className="text-xs font-mono text-black/40 mb-1">SYSTEM // MOBILE_OS_V1</div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Showcased Projects</h2>
             </div>

             {/* Ambient Background Elements */}
             <div className="absolute inset-0 pointer-events-none z-0">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 1px)', backgroundSize: '24px 24px' }} />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center select-none overflow-hidden">
                 <h1 className="text-[55vw] font-black text-transparent stroke-text uppercase tracking-tighter whitespace-nowrap text-black/10" style={{ WebkitTextStroke: '1.5px rgba(0,0,0,0.25)' }}>
                   Projects
                 </h1>
               </div>
               <div className="absolute top-4 left-4 text-black/35"><Plus size={18} /></div>
               <div className="absolute top-4 right-4 text-black/35"><Plus size={18} /></div>
               <div className="absolute bottom-6 left-4 text-black/35"><Plus size={18} /></div>
               <div className="absolute bottom-6 right-4 text-black/35"><Plus size={18} /></div>
             </div>

             {/* PHONE FRAME - Explicit overflow-hidden to contain dock */}
            <div
              ref={assignMobileFrameRef}
              className="relative w-[90%] max-w-[400px] h-[750px] bg-black rounded-[50px] border-[8px] border-[#333] overflow-hidden shadow-2xl transform transition-transform z-10"
              style={{ contain: 'layout style paint', position: 'relative' }}
            >
                 
                 {/* FIXED: Matching Wallpaper Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-br from-[#27272a] via-[#18181b] to-[#09090b] z-0" />
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23noiseFilter)%27%2F%3E%3C%2Fsvg%3E')] opacity-10 mix-blend-overlay" />
                 
                 {/* Status Bar */}
                 <div className="absolute top-4 w-full px-7 flex justify-between text-white text-xs font-medium z-20">
                     <span>9:41</span>
                     <div className="flex gap-1.5 items-center"><Signal size={12}/><Wifi size={12}/><Battery size={12}/></div>
                 </div>

                 {/* Dynamic Island */}
                 <MobileDynamicIsland forceExpanded={isTablet} />

                 {/* Grid */}
                 <div className="absolute top-24 w-full px-6 grid grid-cols-4 gap-y-8 gap-x-2">
                     {projects.map(p => (
                         <div key={p.id} className="flex flex-col items-center gap-1.5" onClick={() => openProject(p)}>
                             <div className={`w-14 h-14 ${p.color} rounded-[14px] flex items-center justify-center text-2xl shadow-lg text-white active:scale-90 transition-transform overflow-hidden`}>
                               {p.iconType === 'image' ? (
                                 <img src={p.icon} alt={p.title} className="w-full h-full object-cover" />
                               ) : (
                                 p.icon
                               )}
                             </div>
                             <span className="text-[10px] text-white font-medium truncate w-full text-center text-shadow-sm leading-tight">{p.title}</span>
                         </div>
                     ))}
                 </div>

                 {/* INTERNAL DOCK (Seamless Landing) - Smooth scroll-based glide */}
                 {/* Only render when it should be visible to prevent duplicates */}
                 {isPhoneDockVisible && (
                     <motion.div 
                         style={{ 
                             y: dockY, 
                             opacity: dockOpacity, 
                             scale: dockScale
                         }}
                         className="absolute bottom-2 left-0 right-0 w-full flex justify-center z-40"
                     >
                         <Dock 
                            layoutId="shared-dock"
                            className="relative w-auto"
                           isMobile={true}
                            onAboutClick={() => openApp(ABOUT_APP)}
                            onResumeClick={() => openApp(RESUME_APP)}
                            onContactClick={() => openApp(CONTACT_APP)}
                            onGithubClick={() => openApp(TERMINAL_APP)}
                            onLinkedinClick={() => openApp(LINKEDIN_APP)}
                            onPopcornClick={() => openApp(POPCORN_APP)}
                            onMonitorClick={() => openApp(MONITOR_APP)}
                         />
                     </motion.div>
                 )}

                 {/* Active App Overlay with iOS-style backdrop */}
                 <AnimatePresence>
                     {activeMobileApp && (
                         <>
                             {/* iOS-style backdrop dimming */}
                             <motion.div
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 exit={{ opacity: 0 }}
                                 transition={{ duration: 0.2 }}
                                 onClick={() => setActiveMobileApp(null)}
                                 className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 rounded-[40px]"
                             />
                             <MobileWindow app={activeMobileApp} onClose={() => setActiveMobileApp(null)} />
                         </>
                     )}
                 </AnimatePresence>

             </div>
        </section>
      );
  }

  // --- DESKTOP RENDER ---
  return (
    <section
      id="projects"
      className="hidden md:flex pt-0 pb-24 w-full bg-[#f4f4f0] flex-col items-center relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      <div className="w-full border-b border-black/10 mb-24 z-20 bg-[#f4f4f0]"><div className="max-w-[1600px] mx-auto px-4 md:px-12 py-2"><div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-black/40 uppercase tracking-widest"><FolderOpen size={12} /><span>System</span><ChevronRight size={12} /><span>Users</span><ChevronRight size={12} /><span>Andrew</span><ChevronRight size={12} /><span className="text-black font-bold">Source_Code</span></div></div></div>
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none top-12" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"><h1 className="text-[25vw] font-black text-transparent stroke-text uppercase tracking-tighter opacity-10 whitespace-nowrap" style={{ WebkitTextStroke: '2px black' }}>Projects</h1></div>
      <div className="absolute top-32 left-8 text-black/40 hidden md:block"><Plus size={24} /></div><div className="absolute top-32 right-8 text-black/40 hidden md:block"><Plus size={24} /></div><div className="absolute bottom-24 left-8 text-black/40 hidden md:block"><Plus size={24} /></div><div className="absolute bottom-24 right-8 text-black/40 hidden md:block"><Plus size={24} /></div>

      <div className="w-full max-w-6xl mb-6 px-4 flex items-end justify-between relative z-10">
        <div><div className="flex items-center gap-2 mb-1 text-black/60 font-mono text-xs uppercase tracking-wider"><Terminal size={14} /><span>Interactive Terminal</span></div><h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">Showcased Projects</h2></div>
        <div className="hidden md:block text-right"><div className="text-xs font-mono text-black/50">STATUS: ACTIVE</div><div className="text-xs font-mono text-black/50">V.2.0.25</div></div>
      </div>

      <div ref={containerRef} className="relative w-[95%] max-w-6xl h-[700px] bg-black rounded-3xl border-[16px] border-zinc-700 overflow-visible shadow-2xl cursor-default z-30">
        {/* Background layer with overflow-hidden to contain gradients */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2e] via-[#1c1c1e] to-[#000000] z-0" />
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23noiseFilter)%27%2F%3E%3C%2Fsvg%3E')] pointer-events-none mix-blend-overlay" />
        </div>
        <DynamicNotch />
        <AnimatePresence>
          {openProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-6 right-8 text-right font-mono z-0 pointer-events-none">
              <div className="text-[10px] text-white/80 mb-1">SYSTEM_STATUS: ONLINE</div>
              <div className="flex items-center justify-end gap-2"><span className="text-xs text-white font-bold tracking-wider shadow-sm">{">"} CLICK ICON TO OPEN</span><motion.div animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-2 h-4 bg-white" /></div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative z-10 p-8 grid grid-cols-5 gap-x-10 gap-y-12 justify-items-center pt-16 w-full">
          {projects.map((project) => (
            <motion.button 
              key={project.id} 
              onClick={() => openProject(project)} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="group flex flex-col items-center gap-2 p-3 rounded-xl transition-colors w-24 hover:bg-white/10 cursor-pointer"
              style={{ backgroundColor: "transparent" }}
            >
              <div className={`w-12 h-12 ${project.color} rounded-xl flex items-center justify-center text-2xl shadow-lg ring-1 ring-white/20 group-hover:ring-white/50 transition-all overflow-hidden`}>
                {project.iconType === 'image' ? (
                  <img src={project.icon} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  project.icon
                )}
              </div>
              <span className="text-[10px] font-medium text-white text-shadow-sm text-center leading-tight">{project.title}</span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {openProjects.map((project, index) => (
            <DesktopWindow key={project.id} project={project} index={index} containerRef={containerRef} zIndex={activeId === project.id ? 50 : 10 + index} onFocus={() => setActiveId(project.id)} onClose={() => closeProject(project.id)} />
          ))}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {isInView && (
            <motion.div
              key="desktop-dock"
              initial={{ y: 140, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={DESKTOP_DOCK_TRANSITION}
              className="pointer-events-none absolute bottom-4 inset-x-8 flex justify-center z-[120]"
            >
              <Dock
                layoutId={DESKTOP_DOCK_LAYOUT_ID}
                className="pointer-events-none flex justify-center perspective-1000 w-fit max-w-[min(720px,_calc(100%_-_6rem))]"
                onResumeClick={() => openApp(RESUME_APP)}
                onContactClick={() => openApp(CONTACT_APP)}
                onAboutClick={() => openApp(ABOUT_APP)}
                onGithubClick={() => openApp(TERMINAL_APP)}
                onLinkedinClick={() => openApp(LINKEDIN_APP)}
                onPopcornClick={() => openApp(POPCORN_APP)}
                onMonitorClick={() => openApp(MONITOR_APP)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}