// Contents of script.js (v6.28 - Updated Popover to Click & Auto-Hide)

// --- Initialization Guard ---
let typedJsInitialized = false;

// --- Typed.js Initialization Function ---
function initializeTypedJs() {
    // ... (keep existing function code) ...
    if (typedJsInitialized) { console.log("Typed.js already initialized. Skipping."); return; }
    typedJsInitialized = true;
    console.log("Attempting to initialize Typed.js...");
    var options = { strings: [ "I’m a computer science student", "I’m a movie lover", "I’m a passionate gamer", "I’m a problem-solver", "I’m a code enthusiast", "I’m a tech lover", "I’m a music fan", "I’m a lifelong learner", "I’m a creator", "I’m a tech geek", "I’m always coding", "I’m a digital artist", "I’m a future developer", "I’m a design thinker", "I’m a tech explorer" ], typeSpeed: 90, backSpeed: 70, backDelay: 1200, startDelay: 500, loop: true, showCursor: true };
    try {
        const targetSpan = document.getElementById('typed-output');
        if (!targetSpan) { console.error("Target span #typed-output NOT FOUND!"); typedJsInitialized = false; return; }
        console.log("Target span #typed-output found:", targetSpan);
        var typed = new Typed("#typed-output", options);
        console.log("Typed.js instance CREATED successfully.");
    } catch (error) {
        console.error("Error initializing Typed.js:", error);
        typedJsInitialized = false; // Reset on error
    }
}

// --- Marquee Initialization Function ---
function initializeMarquee() {
    // ... (keep existing function code) ...
    console.log("Attempting to initialize Marquee...");
    const skillsMarqueeContainer = document.querySelector('.skills-marquee-container');
    const skillsTrack = document.querySelector('.skills-track');
    const bodyElement = document.body;

    if (skillsMarqueeContainer && skillsTrack && bodyElement) {
        console.log("Marquee elements found.");
        // --- START MARQUEE LOGIC ---
        let currentX = 0, trackWidth = 0, speed = 50, isAutoScrolling = false, animationFrameId = null, lastTimestamp = 0;
        let pointerDown = false, dragEngaged = false, startX = 0, dragStartTranslateX = 0, blockClickEvent = false, dragThreshold = 5;
        let resumeScrollTimeoutId = null, resumeDelay = 3000;
        function calculateTrackWidth() {
            if (skillsTrack.children.length > 1) { trackWidth = skillsTrack.scrollWidth / 2; } else { trackWidth = skillsTrack.scrollWidth; }
             console.log(`Marquee trackWidth calculated: ${trackWidth}`); return trackWidth > 0; }
        function autoScroll(timestamp) { if (!isAutoScrolling || trackWidth <= 0) { animationFrameId = null; return; } if (lastTimestamp === 0) lastTimestamp = timestamp; const deltaTime = (timestamp - lastTimestamp) / 1000; lastTimestamp = timestamp; if (deltaTime > 0.5) { console.warn("Large Marquee dT, skipping frame potentially."); animationFrameId = requestAnimationFrame(autoScroll); return; } currentX -= speed * deltaTime; if (currentX <= -trackWidth) { currentX += trackWidth; } skillsTrack.style.transform = `translateX(${currentX}px)`; animationFrameId = requestAnimationFrame(autoScroll); }
        function startAutoScroll() { if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; } if (isAutoScrolling || !calculateTrackWidth()) return; console.log("Marquee: Starting AutoScroll"); isAutoScrolling = true; lastTimestamp = 0; if (animationFrameId) cancelAnimationFrame(animationFrameId); animationFrameId = requestAnimationFrame(autoScroll); }
        function stopAutoScroll() { if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; } if (!isAutoScrolling) return; console.log("Marquee: Stopping AutoScroll"); isAutoScrolling = false; if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; } currentX = getTranslateX(skillsTrack); }
        const getTranslateX = (element) => { try { const style = window.getComputedStyle(element); const matrix = style.transform || style.webkitTransform || style.mozTransform; if (matrix === 'none'|| !matrix) return 0; const matrixValues = matrix.match(/matrix.*\((.+)\)/); if (matrixValues && matrixValues[1]) { const values = matrixValues[1].split(',').map(s => parseFloat(s.trim())); const idx = matrix.includes('3d') ? 12 : 4; return values[idx] || 0; } return 0; } catch(e){ console.error("getTranslateX error", e); return 0; } };
        const onPointerDown = (e) => { if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; } if (trackWidth <= 0 && !calculateTrackWidth()) return; pointerDown = true; dragEngaged = false; blockClickEvent = false; startX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0); stopAutoScroll(); skillsTrack.style.transition = 'none'; skillsMarqueeContainer.style.cursor = 'grabbing'; };
        const onPointerMove = (e) => { if (!pointerDown) return; const currentPointerX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0); const walk = currentPointerX - startX; if (!dragEngaged && Math.abs(walk) > dragThreshold) { dragEngaged = true; blockClickEvent = true; dragStartTranslateX = currentX; startX = currentPointerX; bodyElement.classList.add('grabbing'); skillsTrack.classList.add('dragging');} if (dragEngaged) { e.preventDefault(); const dragWalk = currentPointerX - startX; let newTranslateX = dragStartTranslateX + dragWalk; const maxTranslate = 0; const minTranslate = -trackWidth; newTranslateX = Math.max(minTranslate, Math.min(maxTranslate, newTranslateX)); skillsTrack.style.transform = `translateX(${newTranslateX}px)`; currentX = newTranslateX; } };
        const onPointerUp = (e) => { if (!pointerDown) return; pointerDown = false; skillsMarqueeContainer.style.cursor = 'grab'; if (dragEngaged) { bodyElement.classList.remove('grabbing'); skillsTrack.classList.remove('dragging'); skillsTrack.style.transition = ''; if (resumeScrollTimeoutId) clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = setTimeout(() => { startAutoScroll(); resumeScrollTimeoutId = null; }, resumeDelay); blockClickEvent = true; setTimeout(() => { blockClickEvent = false; }, 50); } else { startAutoScroll(); } dragEngaged = false; };
        skillsMarqueeContainer.addEventListener('mousedown', onPointerDown); document.addEventListener('mousemove', onPointerMove); document.addEventListener('mouseup', onPointerUp); document.addEventListener('mouseleave', onPointerUp); skillsMarqueeContainer.addEventListener('touchstart', onPointerDown, { passive: true }); document.addEventListener('touchmove', onPointerMove, { passive: false }); document.addEventListener('touchend', onPointerUp); document.addEventListener('touchcancel', onPointerUp); skillsTrack.addEventListener('click', (e) => { if (blockClickEvent) { e.preventDefault(); e.stopPropagation();} blockClickEvent = false; }, true);
        let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { stopAutoScroll(); if (calculateTrackWidth()) { currentX = Math.max(-trackWidth, Math.min(0, getTranslateX(skillsTrack))); skillsTrack.style.transform = `translateX(${currentX}px)`; startAutoScroll();} }, 250); });
        if(calculateTrackWidth()) { startAutoScroll(); console.log("JS Marquee Initialized & Started."); } else { console.warn("Marquee: Initial width calculation failed, retrying..."); setTimeout(()=>{ if(calculateTrackWidth()){ startAutoScroll();} else { console.error("Marquee: Still cannot calculate track width after retry."); } }, 500); }
        // --- END MARQUEE LOGIC ---
    } else {
        console.warn("Marquee elements not found.");
         if (!skillsMarqueeContainer) console.warn("Missing .skills-marquee-container");
         if (!skillsTrack) console.warn("Missing .skills-track");
         if (!bodyElement) console.warn("Missing bodyElement reference for Marquee");
    }
} // --- End of initializeMarquee function ---

// --- Initialize AOS ---
function initAos() {
     try {
         if (typeof AOS !== 'undefined') {
             console.log("Initializing AOS...");
             AOS.init({ duration: 800, once: true, offset: 50 });
         } else {
             console.warn("AOS library not found.");
         }
     } catch(e) {
         console.error("Error initializing AOS:", e);
     }
}

// --- Main Setup on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Setting up Intro, AOS, Popovers, Videos.");

    // --- Element References ---
    const overlay = document.getElementById('intro-overlay');
    const navbar = document.querySelector('nav.navbar');
    const heroSection = document.querySelector('section.hero');
    const targetElement = document.querySelector('.hero h1'); // Target H1 (Old Logic)
    const bodyElement = document.body;

    // --- Check if Intro Should Play ---
    const hasIntroPlayed = sessionStorage.getItem('introPlayed') === 'true';

    if (hasIntroPlayed) {
        // --- SKIP INTRO ---
        console.log("Intro already played. Skipping animation.");
        if (overlay) overlay.style.display = 'none';
        if (navbar) navbar.classList.add('visible');
        if (heroSection) heroSection.classList.add('visible');
        initializeTypedJs();
        setTimeout(() => {
             initializeMarquee();
             initAos();
        }, 100);

    } else {
        // --- PLAY INTRO (Using "Even Older" Logic Base) ---
        // ... (keep the existing intro playing logic exactly as is) ...
        console.log("Starting intro sequence (Even Older Logic Base).");
        if (!overlay || !navbar || !heroSection || !targetElement || !bodyElement) {
            console.error("Missing critical elements for intro. Skipping.");
            if(overlay) overlay.style.display = 'none';
            if(navbar) navbar.classList.add('visible');
            if(heroSection) heroSection.classList.add('visible');
            if(bodyElement) bodyElement.classList.remove('no-scroll');
            initializeTypedJs();
            setTimeout(() => { initializeMarquee(); initAos(); }, 100); return;
        }
        console.log("Disabling scroll."); bodyElement.classList.add('no-scroll');
        console.log("Calculating intro parameters immediately...");
        let targetX, targetY, targetScale = 1;
        try {
             try { void overlay.offsetHeight; void targetElement.offsetHeight; } catch (e) { /* ignore */ }
            const targetRect = targetElement.getBoundingClientRect(); const overlayRect = overlay.getBoundingClientRect();
            if (!targetRect || !overlayRect || overlayRect.width === 0) { throw new Error("Failed to get valid bounding client rects or overlay width is zero."); }
            const targetCenterX = targetRect.left + targetRect.width / 2; const targetCenterY = targetRect.top + targetRect.height / 2; const overlayCenterX = overlayRect.left + overlayRect.width / 2; const overlayCenterY = overlayRect.top + overlayRect.height / 2;
            targetX = targetCenterX - overlayCenterX; targetY = targetCenterY - overlayCenterY;
            const overlayStyle = window.getComputedStyle(overlay); const targetStyle = window.getComputedStyle(targetElement); const overlayFontSize = parseFloat(overlayStyle.fontSize); const targetFontSize = parseFloat(targetStyle.fontSize);
            console.log(`Font Sizes - Overlay: ${overlayFontSize}px, Target H1: ${targetFontSize}px`);
            if (!isNaN(overlayFontSize) && !isNaN(targetFontSize) && overlayFontSize > 0 && targetFontSize > 0) { targetScale = targetFontSize / overlayFontSize; } else { console.warn(`Font size calculation issue. Using default scale 1.`); }
            targetScale = Math.max(0.01, targetScale); console.log("Final Calculated transform:", { targetX: targetX.toFixed(2), targetY: targetY.toFixed(2), targetScale: targetScale.toFixed(3) });
            overlay.style.setProperty('--target-x', `${targetX}px`); overlay.style.setProperty('--target-y', `${targetY}px`); overlay.style.setProperty('--target-scale', targetScale);
        } catch (error) {
            console.error("Error during immediate calculation:", error); if (overlay) overlay.style.display = 'none'; if (navbar) navbar.classList.add('visible'); if (heroSection) heroSection.classList.add('visible'); if (bodyElement) bodyElement.classList.remove('no-scroll'); initializeTypedJs(); setTimeout(() => { initializeMarquee(); initAos(); }, 100); sessionStorage.setItem('introPlayed', 'true'); return;
        }
        const rootStyle = getComputedStyle(document.documentElement);
        const getDuration = (varName, defaultValue) => { const value = rootStyle.getPropertyValue(varName)?.trim(); if (value && value.endsWith('ms')) return parseInt(value, 10); if (value && value.endsWith('s')) return parseFloat(value) * 1000; console.warn(`CSS variable ${varName} not found or invalid, using default ${defaultValue}ms`); return defaultValue; };
        const animationStartTime = getDuration('--intro-animation-delay', 1000); const animationDuration = getDuration('--intro-animation-duration', 1500); const overlayFadeOutDuration = getDuration('--overlay-fade-duration', 300); const contentFadeInDuration = getDuration('--content-fade-duration', 500);
        const animationEndTime = animationStartTime + animationDuration; const contentFadeInDelay = animationEndTime - contentFadeInDuration; const overlayFadeOutDelay = animationEndTime; const finalHideDelay = overlayFadeOutDelay + overlayFadeOutDuration; const scrollEnableDelay = finalHideDelay; const typedJsInitDelay = contentFadeInDelay + contentFadeInDuration + 100; /* Safer timing */ const marqueeInitDelay = finalHideDelay + 100; const aosInitDelay = marqueeInitDelay + 100;
        console.log("Triggering .animate class (relies on CSS animation-delay)..."); overlay.classList.add('animate');
        setTimeout(() => { console.log(`Fading in main content (Scheduled for ~${contentFadeInDelay}ms)`); if (navbar) navbar.classList.add('visible'); if (heroSection) heroSection.classList.add('visible'); }, contentFadeInDelay);
        setTimeout(() => { console.log(`Fading out overlay (Scheduled for ~${overlayFadeOutDelay}ms)`); if (overlay) overlay.classList.add('fade-out'); }, overlayFadeOutDelay);
        setTimeout(() => { console.log(`Re-enabling scroll and hiding overlay (Scheduled for ~${finalHideDelay}ms)`); if (bodyElement) bodyElement.classList.remove('no-scroll'); if (overlay) overlay.style.visibility = 'hidden'; }, finalHideDelay);
        setTimeout(() => { console.log(`Initializing Typed.js (Scheduled for ~${typedJsInitDelay}ms)`); initializeTypedJs(); }, typedJsInitDelay);
        setTimeout(() => { console.log(`Initializing Marquee (Scheduled for ~${marqueeInitDelay}ms)`); initializeMarquee(); }, marqueeInitDelay);
        setTimeout(() => { console.log(`Initializing AOS (Scheduled for ~${aosInitDelay}ms)`); initAos(); }, aosInitDelay);
        console.log("Setting introPlayed flag in sessionStorage."); sessionStorage.setItem('introPlayed', 'true');
    } // End else (Intro Will Play)


    // === Popover Logic (Updated for Click & Auto-Hide) ===
    const pfpImage = document.getElementById('navbarPfpImage');
    let popoverHideTimeout = null; // Variable to store the timeout ID

    if (pfpImage) {
        try {
            // Initialize popover with manual trigger is crucial
            const popover = new bootstrap.Popover(pfpImage, {
                placement: 'bottom',
                customClass: 'cartoon-popover',
                trigger: 'manual' // Make sure trigger is manual
            });

            // Add CLICK listener to the profile picture
            pfpImage.addEventListener('click', () => {
                console.log("PFP clicked.");

                // If a hide timeout is already scheduled, clear it
                if (popoverHideTimeout) {
                    clearTimeout(popoverHideTimeout);
                    console.log("Cleared existing popover hide timeout.");
                }

                // Show the popover
                console.log("Showing popover.");
                popover.show();

                // Set a new timeout to automatically hide the popover after 3 seconds (3000ms)
                console.log("Scheduling popover hide in 3 seconds.");
                popoverHideTimeout = setTimeout(() => {
                    console.log("Auto-hiding popover now.");
                    popover.hide();
                    popoverHideTimeout = null; // Reset the timeout ID variable
                }, 3000); // 3000 milliseconds = 3 seconds. Adjust if needed.
            });

            // REMOVED hover listeners ('mouseenter', 'mouseleave') for pfpImage
            // REMOVED 'shown.bs.popover' listener logic (not needed for click/auto-hide)

            console.log("Popover logic initialized (Click trigger, Auto-Hide).");

        } catch (e) {
            console.error("Error during popover setup:", e);
        }
    } else {
        console.warn("Navbar profile picture element (#navbarPfpImage) not found for popover.");
    }
    // === End Popover Logic ===


    // === Video Control Logic for Vision Pro ===
    const visionVideoPlayPauseBtn = document.getElementById('videoPlayPauseBtn');
    const visionVideoElement = document.getElementById('visionProVideo');
    const visionProModalElement = document.getElementById('visionProModal');

    if (visionVideoPlayPauseBtn && visionVideoElement && visionProModalElement) {
        try {
            const iconElement = visionVideoPlayPauseBtn.querySelector('i');
            const updateButtonIcon = () => {
                const isPaused = visionVideoElement.paused || visionVideoElement.ended;
                iconElement.classList.toggle('bi-pause-fill', !isPaused);
                iconElement.classList.toggle('bi-play-fill', isPaused);
                visionVideoPlayPauseBtn.setAttribute('aria-label', isPaused ? 'Play Video' : 'Pause Video');
                // console.log(`Vision Pro Video state update: ${isPaused ? 'Paused/Ended' : 'Playing'}`); // Less verbose logging
            };
            visionVideoPlayPauseBtn.addEventListener('click', () => {
                console.log("Vision Pro Play/Pause button clicked.");
                if (visionVideoElement.paused || visionVideoElement.ended) {
                    visionVideoElement.play().catch(e => console.error("Error trying to play Vision Pro video:", e));
                } else {
                    visionVideoElement.pause();
                }
            });
            visionVideoElement.addEventListener('play', updateButtonIcon);
            visionVideoElement.addEventListener('pause', updateButtonIcon);
            visionVideoElement.addEventListener('ended', updateButtonIcon);
            updateButtonIcon(); // Initial check
            visionProModalElement.addEventListener('shown.bs.modal', () => {
                console.log("Vision Pro Modal shown. Attempting to play video.");
                visionVideoElement.muted = true; // Ensure muted
                const playPromise = visionVideoElement.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => { console.log("Vision Pro Video play() promise resolved."); updateButtonIcon(); })
                               .catch(error => { console.warn("Vision Pro Video play() promise rejected. Autoplay likely prevented.", error); updateButtonIcon(); });
                } else { updateButtonIcon(); }
            });
            visionProModalElement.addEventListener('hidden.bs.modal', () => {
                 console.log("Vision Pro Modal hidden. Pausing video.");
                if (!visionVideoElement.paused) { visionVideoElement.pause(); }
            });
            console.log("Video controls initialized for #visionProVideo.");
        } catch (e) { console.error("Error setting up Vision Pro video controls:", e); }
    } else {
         if (!visionVideoPlayPauseBtn) console.warn("Video play/pause button (#videoPlayPauseBtn) not found.");
         if (!visionVideoElement) console.warn("Video element (#visionProVideo) not found.");
         if (!visionProModalElement) console.warn("Modal element (#visionProModal) not found for video control.");
    }
    // === End Vision Pro Video Control Logic ===


    // === Video Control Logic for Music Classifier ===
    const musicVideoPlayPauseBtn = document.getElementById('musicVideoPlayPauseBtn'); // New ID
    const musicVideoElement = document.getElementById('musicVideo'); // New ID
    const musicClassifierModalElement = document.getElementById('musicClassifierModal'); // New ID

    if (musicVideoPlayPauseBtn && musicVideoElement && musicClassifierModalElement) { // Check new IDs
        try {
            const iconElement = musicVideoPlayPauseBtn.querySelector('i'); // Find icon within this button
            const updateButtonIcon = () => { // Function specific to this video
                const isPaused = musicVideoElement.paused || musicVideoElement.ended;
                iconElement.classList.toggle('bi-pause-fill', !isPaused);
                iconElement.classList.toggle('bi-play-fill', isPaused);
                musicVideoPlayPauseBtn.setAttribute('aria-label', isPaused ? 'Play Video' : 'Pause Video');
                // console.log(`Music Classifier Video state update: ${isPaused ? 'Paused/Ended' : 'Playing'}`); // Less verbose logging
            };
            musicVideoPlayPauseBtn.addEventListener('click', () => { // Event listener for this button
                console.log("Music Classifier Play/Pause button clicked.");
                if (musicVideoElement.paused || musicVideoElement.ended) {
                    musicVideoElement.play().catch(e => console.error("Error trying to play Music Classifier video:", e));
                } else {
                    musicVideoElement.pause();
                }
            });
            // Event listeners for this video element
            musicVideoElement.addEventListener('play', updateButtonIcon);
            musicVideoElement.addEventListener('pause', updateButtonIcon);
            musicVideoElement.addEventListener('ended', updateButtonIcon);
            updateButtonIcon(); // Initial check for this video

            // Play attempt on modal show for this modal
            musicClassifierModalElement.addEventListener('shown.bs.modal', () => {
                console.log("Music Classifier Modal shown. Attempting to play video.");
                musicVideoElement.muted = true; // Ensure muted
                const playPromise = musicVideoElement.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => { console.log("Music Classifier Video play() promise resolved."); updateButtonIcon(); })
                               .catch(error => { console.warn("Music Classifier Video play() promise rejected. Autoplay likely prevented.", error); updateButtonIcon(); });
                } else { updateButtonIcon(); } // Fallback for older browsers
            });
            // Pause video when this modal is closed
            musicClassifierModalElement.addEventListener('hidden.bs.modal', () => {
                 console.log("Music Classifier Modal hidden. Pausing video.");
                if (!musicVideoElement.paused) { musicVideoElement.pause(); }
                // Optional: Reset video to start?
                // musicVideoElement.currentTime = 0;
            });
            console.log("Video controls initialized for #musicVideo."); // Log success for this video
        } catch (e) {
            console.error("Error setting up Music Classifier video controls:", e);
        }
    } else {
         // Log specific warnings if elements for this video are missing
         if (!musicVideoPlayPauseBtn) console.warn("Video play/pause button (#musicVideoPlayPauseBtn) not found.");
         if (!musicVideoElement) console.warn("Video element (#musicVideo) not found.");
         if (!musicClassifierModalElement) console.warn("Modal element (#musicClassifierModal) not found for video control.");
    }
    // === End Music Classifier Video Control Logic ===


}); // --- End DOMContentLoaded ---