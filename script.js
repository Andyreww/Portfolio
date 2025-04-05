// Contents of script.js (v6.25 - Attempting "Even Older" JS Logic on Current Structure)

// --- Initialization Guard ---
let typedJsInitialized = false;

// --- Typed.js Initialization Function ---
function initializeTypedJs() {
    if (typedJsInitialized) { console.log("Typed.js already initialized. Skipping."); return; }
    typedJsInitialized = true;
    console.log("Attempting to initialize Typed.js...");
    // Options for the typing animation
    var options = { strings: [ "I’m a computer science student", "I’m a movie lover", "I’m a passionate gamer", "I’m a problem-solver", "I’m a code enthusiast", "I’m a tech lover", "I’m a music fan", "I’m a lifelong learner", "I’m a creator", "I’m a tech geek", "I’m always coding", "I’m a digital artist", "I’m a future developer", "I’m a design thinker", "I’m a tech explorer" ], typeSpeed: 90, backSpeed: 70, backDelay: 1200, startDelay: 500, loop: true, showCursor: true };
    try {
        const targetSpan = document.getElementById('typed-output');
        if (!targetSpan) {
            console.error("Target span #typed-output NOT FOUND!");
            typedJsInitialized = false; // Reset flag if target missing
            return;
        }
        console.log("Target span #typed-output found:", targetSpan);
        var typed = new Typed("#typed-output", options);
        console.log("Typed.js instance CREATED successfully.");
    } catch (error) {
        console.error("Error initializing Typed.js:", error);
        typedJsInitialized = false; // Reset flag on error
    }
}

// --- Marquee Initialization Function (Using modern JS version) ---
function initializeMarquee() {
    console.log("Attempting to initialize Marquee...");
    const skillsMarqueeContainer = document.querySelector('.skills-marquee-container');
    const skillsTrack = document.querySelector('.skills-track');
    const bodyElement = document.body; // Ensure bodyElement is accessible

    if (skillsMarqueeContainer && skillsTrack && bodyElement) {
        console.log("Marquee elements found.");
        // --- START MARQUEE LOGIC ---
        let currentX = 0, trackWidth = 0, speed = 50, isAutoScrolling = false, animationFrameId = null, lastTimestamp = 0;
        let pointerDown = false, dragEngaged = false, startX = 0, dragStartTranslateX = 0, blockClickEvent = false, dragThreshold = 5;
        let resumeScrollTimeoutId = null, resumeDelay = 3000;
        // Function to calculate or recalculate track width
        function calculateTrackWidth() {
            // Ensure items are duplicated in HTML for seamless effect
            if (skillsTrack.children.length > 1) {
                 trackWidth = skillsTrack.scrollWidth / 2;
                 console.log(`Marquee trackWidth calculated: ${trackWidth}`);
                 return trackWidth > 0;
            } else {
                 console.warn("Marquee track may not have duplicated items for seamless scroll.");
                 trackWidth = skillsTrack.scrollWidth; // Fallback if not duplicated
                 return trackWidth > 0;
            }
        }
        // Recursive function for autoscrolling animation
        function autoScroll(timestamp) {
            if (!isAutoScrolling || trackWidth <= 0) { animationFrameId = null; return; }
            if (lastTimestamp === 0) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;
            if (deltaTime > 0.5) { console.warn("Large Marquee dT, skipping frame potentially."); animationFrameId = requestAnimationFrame(autoScroll); return; }
            currentX -= speed * deltaTime;
            if (currentX <= -trackWidth) { currentX += trackWidth; } // Loop back
            skillsTrack.style.transform = `translateX(${currentX}px)`;
            animationFrameId = requestAnimationFrame(autoScroll);
        }
        // Start the autoscroll
        function startAutoScroll() {
            if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; }
            if (isAutoScrolling || !calculateTrackWidth()) return;
            console.log("Marquee: Starting AutoScroll");
            isAutoScrolling = true;
            lastTimestamp = 0; // Reset timestamp for smooth start
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(autoScroll);
        }
        // Stop the autoscroll
        function stopAutoScroll() {
            if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; console.log("Marquee: Cleared resume timer during stop."); }
            if (!isAutoScrolling) return;
            console.log("Marquee: Stopping AutoScroll");
            isAutoScrolling = false;
            if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
            currentX = getTranslateX(skillsTrack); // Capture current position
        }
        // Helper to get current transform value
        const getTranslateX = (element) => { try { const style = window.getComputedStyle(element); const matrix = style.transform || style.webkitTransform || style.mozTransform; if (matrix === 'none'|| !matrix) return 0; const matrixValues = matrix.match(/matrix.*\((.+)\)/); if (matrixValues && matrixValues[1]) { const values = matrixValues[1].split(',').map(s => parseFloat(s.trim())); const idx = matrix.includes('3d') ? 12 : 4; return values[idx] || 0; } return 0; } catch(e){ console.error("getTranslateX error", e); return 0; } };
        // Pointer/Touch Down Event
        const onPointerDown = (e) => { if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; } if (trackWidth <= 0 && !calculateTrackWidth()) return; pointerDown = true; dragEngaged = false; blockClickEvent = false; startX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0); stopAutoScroll(); skillsTrack.style.transition = 'none'; skillsMarqueeContainer.style.cursor = 'grabbing'; };
        // Pointer/Touch Move Event
        const onPointerMove = (e) => { if (!pointerDown) return; const currentPointerX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0); const walk = currentPointerX - startX; if (!dragEngaged && Math.abs(walk) > dragThreshold) { dragEngaged = true; blockClickEvent = true; dragStartTranslateX = currentX; startX = currentPointerX; bodyElement.classList.add('grabbing'); skillsTrack.classList.add('dragging'); console.log(`Marquee: Drag Engaged`); } if (dragEngaged) { e.preventDefault(); const dragWalk = currentPointerX - startX; let newTranslateX = dragStartTranslateX + dragWalk; const maxTranslate = 0; const minTranslate = -trackWidth; newTranslateX = Math.max(minTranslate, Math.min(maxTranslate, newTranslateX)); skillsTrack.style.transform = `translateX(${newTranslateX}px)`; currentX = newTranslateX; } };
        // Pointer/Touch Up/Leave Event
        const onPointerUp = (e) => { if (!pointerDown) return; pointerDown = false; skillsMarqueeContainer.style.cursor = 'grab'; if (dragEngaged) { console.log(`Marquee: Drag End`); bodyElement.classList.remove('grabbing'); skillsTrack.classList.remove('dragging'); skillsTrack.style.transition = ''; if (resumeScrollTimeoutId) clearTimeout(resumeScrollTimeoutId); console.log(`Marquee: Setting resume timer (${resumeDelay}ms)`); resumeScrollTimeoutId = setTimeout(() => { console.log("Marquee: Resume timer fired."); startAutoScroll(); resumeScrollTimeoutId = null; }, resumeDelay); blockClickEvent = true; setTimeout(() => { blockClickEvent = false; }, 50); } else { console.log("Marquee: Pointer Up (No drag detected)"); blockClickEvent = false; startAutoScroll(); /* Restart if no drag */ } dragEngaged = false; };
        // Add Listeners
        skillsMarqueeContainer.addEventListener('mousedown', onPointerDown); document.addEventListener('mousemove', onPointerMove); document.addEventListener('mouseup', onPointerUp); document.addEventListener('mouseleave', onPointerUp); skillsMarqueeContainer.addEventListener('touchstart', onPointerDown, { passive: true }); document.addEventListener('touchmove', onPointerMove, { passive: false }); document.addEventListener('touchend', onPointerUp); document.addEventListener('touchcancel', onPointerUp); skillsTrack.addEventListener('click', (e) => { if (blockClickEvent) { e.preventDefault(); e.stopPropagation(); console.log("Marquee: Click blocked due to recent drag."); } blockClickEvent = false; }, true);
        // Handle Resize
        let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { console.log("Marquee: Resizing..."); stopAutoScroll(); if (calculateTrackWidth()) { currentX = Math.max(-trackWidth, Math.min(0, getTranslateX(skillsTrack))); skillsTrack.style.transform = `translateX(${currentX}px)`; startAutoScroll(); console.log(`Marquee Resize: New trackWidth=${trackWidth}, currentX adjusted to ${currentX}`);} else { console.warn("Marquee Resize: Could not calculate track width after resize."); } }, 250); });
        // Initial Start
        if(calculateTrackWidth()) { startAutoScroll(); console.log("JS Marquee Initialized & Started."); } else { console.warn("Marquee: Initial width calculation failed, retrying..."); setTimeout(()=>{ if(calculateTrackWidth()){ startAutoScroll(); console.log("JS Marquee Started after retry."); } else { console.error("Marquee: Still cannot calculate track width after retry."); } }, 500); }
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
    console.log("DOM Loaded. Setting up Intro and AOS.");

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
        // Initialize Marquee and AOS immediately after content is visible
        setTimeout(() => {
             initializeMarquee();
             initAos(); // Initialize AOS after skipping
        }, 100); // Short delay

    } else {
        // --- PLAY INTRO (Using "Even Older" Logic Base) ---
        console.log("Starting intro sequence (Even Older Logic Base).");

        if (!overlay || !navbar || !heroSection || !targetElement || !bodyElement) {
            console.error("Missing critical elements for intro. Skipping.");
            if (overlay) overlay.style.display = 'none';
            if (navbar) navbar.classList.add('visible');
            if (heroSection) heroSection.classList.add('visible');
            if (bodyElement) bodyElement.classList.remove('no-scroll');
            initializeTypedJs();
            setTimeout(() => {
                 initializeMarquee();
                 initAos();
            }, 100);
            return;
        }

        // --- 1. Disable Scrolling ---
        console.log("Disabling scroll.");
        bodyElement.classList.add('no-scroll');

        // --- 2. Calculation Phase (Immediate, No fonts.ready/rAF) ---
        console.log("Calculating intro parameters immediately...");
        let targetX, targetY, targetScale = 1;
        try {
             try { void overlay.offsetHeight; void targetElement.offsetHeight; } catch (e) { /* ignore */ }

            const targetRect = targetElement.getBoundingClientRect();
            const overlayRect = overlay.getBoundingClientRect();

            if (!targetRect || !overlayRect || overlayRect.width === 0) { // Check overlay width too
                throw new Error("Failed to get valid bounding client rects or overlay width is zero.");
            }

            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;
            const overlayCenterX = overlayRect.left + overlayRect.width / 2;
            const overlayCenterY = overlayRect.top + overlayRect.height / 2;
            targetX = targetCenterX - overlayCenterX;
            targetY = targetCenterY - overlayCenterY; // No mobile adjustment

            // Font-Size Scaling
            const overlayStyle = window.getComputedStyle(overlay);
            const targetStyle = window.getComputedStyle(targetElement);
            const overlayFontSize = parseFloat(overlayStyle.fontSize);
            const targetFontSize = parseFloat(targetStyle.fontSize);

            console.log(`Font Sizes - Overlay: ${overlayFontSize}px, Target H1: ${targetFontSize}px`);

            if (!isNaN(overlayFontSize) && !isNaN(targetFontSize) && overlayFontSize > 0 && targetFontSize > 0) {
                 targetScale = targetFontSize / overlayFontSize;
            } else {
                console.warn(`Font size calculation issue. Using default scale 1.`);
            }
             targetScale = Math.max(0.01, targetScale); // Ensure positive

            console.log("Final Calculated transform:", { targetX: targetX.toFixed(2), targetY: targetY.toFixed(2), targetScale: targetScale.toFixed(3) });

            overlay.style.setProperty('--target-x', `${targetX}px`);
            overlay.style.setProperty('--target-y', `${targetY}px`);
            overlay.style.setProperty('--target-scale', targetScale);

        } catch (error) {
            console.error("Error during immediate calculation:", error);
            // Fallback: Skip intro cleanly
            if (overlay) overlay.style.display = 'none';
            if (navbar) navbar.classList.add('visible');
            if (heroSection) heroSection.classList.add('visible');
            if (bodyElement) bodyElement.classList.remove('no-scroll');
            initializeTypedJs();
            setTimeout(() => {
                 initializeMarquee();
                 initAos();
             }, 100);
            sessionStorage.setItem('introPlayed', 'true');
            return;
        }

        // --- 3. Animation Trigger Phase (OLD TIMING - Relies on CSS delay) ---
        const rootStyle = getComputedStyle(document.documentElement);
        const getDuration = (varName, defaultValue) => {
            const value = rootStyle.getPropertyValue(varName)?.trim();
            if (value && value.endsWith('ms')) return parseInt(value, 10);
            if (value && value.endsWith('s')) return parseFloat(value) * 1000;
            console.warn(`CSS variable ${varName} not found or invalid, using default ${defaultValue}ms`);
            return defaultValue;
        };
        // Read timing from CSS variables (ensure they match CSS from v6.22)
        const animationStartTime = getDuration('--intro-animation-delay', 1000); // 1s
        const animationDuration = getDuration('--intro-animation-duration', 1500); // 1.5s
        const overlayFadeOutDuration = getDuration('--overlay-fade-duration', 300); // 0.3s
        const contentFadeInDuration = getDuration('--content-fade-duration', 500); // 0.5s

        const animationEndTime = animationStartTime + animationDuration; // ~2500ms (relative to when style applied)

        // Calculate delays relative to DOMContentLoaded (when this script runs)
        const contentFadeInDelay = animationEndTime - contentFadeInDuration; // ~2000ms
        const overlayFadeOutDelay = animationEndTime; // ~2500ms
        const finalHideDelay = overlayFadeOutDelay + overlayFadeOutDuration; // ~2800ms
        const scrollEnableDelay = finalHideDelay;
        // Schedule TypedJS init slightly after content starts appearing
        const typedJsInitDelay = contentFadeInDelay + contentFadeInDuration + 100; // ~2600ms (safer)
        // Schedule Marquee init after overlay is hidden
        const marqueeInitDelay = finalHideDelay + 100; // ~2900ms
        // Schedule AOS init last
        const aosInitDelay = marqueeInitDelay + 100; // ~3000ms

        console.log("Triggering .animate class (relies on CSS animation-delay)...");
        overlay.classList.add('animate'); // Add class, CSS delay controls start

        // Schedule content FADE-IN
        setTimeout(() => {
            console.log(`Fading in main content (Scheduled for ~${contentFadeInDelay}ms)`);
            if (navbar) navbar.classList.add('visible');
            if (heroSection) heroSection.classList.add('visible');
        }, contentFadeInDelay);

        // Schedule overlay FADE-OUT
        setTimeout(() => {
            console.log(`Fading out overlay (Scheduled for ~${overlayFadeOutDelay}ms)`);
            if (overlay) overlay.classList.add('fade-out');
        }, overlayFadeOutDelay);

        // Schedule scroll re-enable AND final hide using visibility:hidden
         setTimeout(() => {
            console.log(`Re-enabling scroll and hiding overlay (Scheduled for ~${finalHideDelay}ms)`);
            if (bodyElement) bodyElement.classList.remove('no-scroll');
            // Use visibility: hidden like the old code
            if (overlay) overlay.style.visibility = 'hidden';
        }, finalHideDelay);

        // Initialize Typed.js
        setTimeout(() => {
            console.log(`Initializing Typed.js (Scheduled for ~${typedJsInitDelay}ms)`);
            initializeTypedJs();
        }, typedJsInitDelay);

        // Initialize Marquee
         setTimeout(() => {
             console.log(`Initializing Marquee (Scheduled for ~${marqueeInitDelay}ms)`);
            initializeMarquee();
         }, marqueeInitDelay);

         // Initialize AOS
         setTimeout(() => {
              console.log(`Initializing AOS (Scheduled for ~${aosInitDelay}ms)`);
             initAos();
         }, aosInitDelay);

        // --- 4. Set Flag ---
        console.log("Setting introPlayed flag in sessionStorage.");
        sessionStorage.setItem('introPlayed', 'true');

    } // End else (Intro Will Play)

}); // End DOMContentLoaded