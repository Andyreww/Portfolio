// Contents of script.js (v6.2 - JS Animation, Dragging, Auto-Resume, Full Logic)

// --- Initialization Guard ---
let typedJsInitialized = false;

// --- Typed.js Initialization Function ---
function initializeTypedJs() {
    if (typedJsInitialized) { console.log("Typed.js already initialized."); return; }
    typedJsInitialized = true;
    console.log("Attempting to initialize Typed.js...");
    var options = { strings: [ "I’m a computer science student", "I’m a movie lover", "I’m a passionate gamer", "I’m a problem-solver", "I’m a code enthusiast", "I’m a tech lover", "I’m a music fan", "I’m a lifelong learner", "I’m a creator", "I’m a tech geek", "I’m always coding", "I’m a digital artist", "I’m a future developer", "I’m a design thinker", "I’m a tech explorer" ], typeSpeed: 90, backSpeed: 70, backDelay: 1200, startDelay: 500, loop: true, showCursor: true };
    try {
        const targetSpan = document.getElementById('typed-output');
        if (!targetSpan) { console.error("Target span #typed-output NOT FOUND!"); return; }
        var typed = new Typed("#typed-output", options);
        console.log("Typed.js instance CREATED successfully:", typed);
    } catch (error) { console.error("Error initializing Typed.js:", error); }
}


// --- Main Setup on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Setting up Intro, AOS, Popovers, and Marquee.");

    // --- Element References ---
    const overlay = document.getElementById('intro-overlay');
    const navbar = document.querySelector('nav.navbar');
    const heroSection = document.querySelector('section.hero');
    const targetElement = document.querySelector('.hero h1');
    const bodyElement = document.body;

    // --- Intro & AOS Logic ---
    const hasIntroPlayed = sessionStorage.getItem('introPlayed') === 'true';
    if (hasIntroPlayed) {
        // Skip Intro
        if (overlay) overlay.style.display = 'none';
        if (navbar) navbar.classList.add('visible');
        if (heroSection) heroSection.classList.add('visible');
        initializeTypedJs();
    } else {
        // Play Intro
         if (!overlay || !navbar || !heroSection || !targetElement) {
            console.error("Essential elements for intro missing!");
             if (overlay) overlay.style.display = 'none';
             if (navbar) navbar.classList.add('visible');
             if (heroSection) heroSection.classList.add('visible');
             initializeTypedJs();
             bodyElement.classList.remove('no-scroll');
             return;
         }
         bodyElement.classList.add('no-scroll');
         console.log("Waiting for fonts...");
         document.fonts.ready.then(() => {
             console.log("Fonts ready.");
             setTimeout(() => {
                console.log("Calculating intro animation...");
                try {
                    void overlay.offsetHeight; void targetElement.offsetHeight;
                    let targetRect = targetElement.getBoundingClientRect();
                    let overlayRect = overlay.getBoundingClientRect();
                    if (!targetRect || !overlayRect || targetRect.width === 0 || overlayRect.width === 0) {
                        throw new Error("Invalid intro rects.");
                    }
                    const targetX = (targetRect.left + targetRect.width / 2) - (overlayRect.left + overlayRect.width / 2);
                    const targetY = (targetRect.top + targetRect.height / 2) - (overlayRect.top + overlayRect.height / 2);
                    const overlayFontSize = parseFloat(window.getComputedStyle(overlay).fontSize);
                    const targetFontSize = parseFloat(window.getComputedStyle(targetElement).fontSize);
                    let targetScale = (overlayFontSize > 0 && targetFontSize > 0) ? (targetFontSize / overlayFontSize) : 1;
                    targetScale = Math.max(0.1, targetScale);
                    console.log("Intro transform params:", { targetX, targetY, targetScale });
                    overlay.style.setProperty('--target-x', `${targetX}px`);
                    overlay.style.setProperty('--target-y', `${targetY}px`);
                    overlay.style.setProperty('--target-scale', targetScale);

                    const animationStartTime = 1000; const animationDuration = 1500; const animationEndTime = animationStartTime + animationDuration;
                    const contentFadeInDuration = 500; const overlayFadeOutDuration = 300;
                    const contentFadeInDelay = animationEndTime - contentFadeInDuration;
                    const overlayFadeOutDelay = animationEndTime; const scrollEnableDelay = overlayFadeOutDelay; const typedJsInitDelay = animationEndTime + 100;

                    console.log("Triggering intro animations...");
                    setTimeout(() => {
                        overlay.classList.add('animate');
                        console.log("Intro animation class added.");
                        setTimeout(() => { if (navbar) navbar.classList.add('visible'); if (heroSection) heroSection.classList.add('visible'); console.log("Content faded in."); }, contentFadeInDelay - animationStartTime);
                        setTimeout(() => { if (overlay) overlay.classList.add('fade-out'); console.log("Overlay faded out."); }, overlayFadeOutDelay - animationStartTime);
                        setTimeout(() => { bodyElement.classList.remove('no-scroll'); console.log("Scroll enabled."); }, scrollEnableDelay - animationStartTime);
                        setTimeout(() => { initializeTypedJs(); }, typedJsInitDelay - animationStartTime);
                        sessionStorage.setItem('introPlayed', 'true');
                    }, animationStartTime);
                } catch(e) {
                    console.error("Error during intro animation setup:", e);
                    if (overlay) overlay.style.display = 'none';
                    if (navbar) navbar.classList.add('visible');
                    if (heroSection) heroSection.classList.add('visible');
                    initializeTypedJs();
                    bodyElement.classList.remove('no-scroll');
                }
            }, 50);
        }).catch(e => {
            console.error("Fonts failed to load/check:", e);
            if (overlay) overlay.style.display = 'none';
            if (navbar) navbar.classList.add('visible');
            if (heroSection) heroSection.classList.add('visible');
            initializeTypedJs();
            bodyElement.classList.remove('no-scroll');
        });
    }
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        console.log("Initializing AOS...");
        AOS.init({ duration: 800, once: true, offset: 50 });
    } else { console.warn("AOS library not found."); }
    // --- End Intro & AOS Logic ---


    // === Popover Logic ===
    let pfpPopoverTimeoutId = null;

    function getPopoverPlacement() {
        return window.matchMedia("(min-width: 992px)").matches ? 'bottom' : 'left';
    }

    function setupPfpPopover() {
        const pfpImage = document.getElementById('navbarPfpImage');
        if (!pfpImage) {
            console.warn("PFP image element not found for popover setup.");
            return;
        }
        const desiredPlacement = getPopoverPlacement();
        let instance = bootstrap.Popover.getInstance(pfpImage);
        if (instance && instance._config.placement !== desiredPlacement) {
            instance.dispose();
            instance = null;
            console.log("Disposed existing popover as placement needed update.");
        }
        if (!instance) {
            try {
                instance = new bootstrap.Popover(pfpImage, {
                    customClass: 'cartoon-popover',
                    trigger: 'manual',
                    placement: desiredPlacement,
                    html: true,
                    sanitize: false
                });
                console.log(`PFP Popover Instance Created/Updated with placement: ${desiredPlacement}`);
            } catch (e) {
                console.error("Error creating PFP popover instance:", e);
            }
        } else {
             console.log(`PFP Popover already initialized with correct placement: ${desiredPlacement}`);
        }
    }

    try {
        // Initialize non-PFP popovers
        const otherPopoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]:not(#navbarPfpImage)');
        otherPopoverTriggerList.forEach(popoverTriggerEl => {
            new bootstrap.Popover(popoverTriggerEl);
        });

        // Initial PFP popover setup
        setupPfpPopover();

        // PFP click listener
        const pfpImage = document.getElementById('navbarPfpImage');
        if (pfpImage) {
             pfpImage.addEventListener('click', () => {
                console.log("PFP image clicked.");
                let currentInstance = bootstrap.Popover.getInstance(pfpImage);
                 if (!currentInstance) {
                    console.error("Cannot get popover instance on click! Attempting re-init...");
                    setupPfpPopover();
                    currentInstance = bootstrap.Popover.getInstance(pfpImage);
                    if (!currentInstance) {
                       console.error("Re-initialization failed, cannot show popover.");
                       return;
                    }
                 }

                try {
                    if (pfpPopoverTimeoutId) { clearTimeout(pfpPopoverTimeoutId); pfpPopoverTimeoutId = null; }

                    const popoverElement = currentInstance.tip;
                    let popoverIsVisible = popoverElement && popoverElement.classList.contains('show');

                     if (popoverIsVisible) {
                         console.log("Popover was shown, hiding now.");
                         currentInstance.hide();
                     } else {
                        console.log("Attempting to show popover.");
                        currentInstance.show();
                        pfpPopoverTimeoutId = setTimeout(() => {
                            console.log("Hiding popover after 3 seconds.");
                            const instanceInTimeout = bootstrap.Popover.getInstance(pfpImage);
                            if (instanceInTimeout && instanceInTimeout.tip && instanceInTimeout.tip.classList.contains('show')) {
                                instanceInTimeout.hide();
                            }
                            pfpPopoverTimeoutId = null;
                        }, 3000);
                     }
                } catch (e) {
                    console.error("Error showing/hiding popover:", e);
                    if(pfpPopoverTimeoutId) { clearTimeout(pfpPopoverTimeoutId); pfpPopoverTimeoutId = null; }
                }
            });
            console.log("Click listener added to PFP image.");
        } else {
             console.warn("PFP image element not found for listener setup.");
        }

        // Resize listener for placement update
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log("Window resized, running PFP popover setup check.");
                setupPfpPopover();
            }, 250);
        });

    } catch (e) {
        console.error("Error during popover setup or listener attachment:", e);
    }
    // === End Popover Logic ===


    // === JS Draggable & AutoScroll Skills Marquee Logic (v6.2 - Auto Resume) ===
    const skillsMarqueeContainer = document.querySelector('.skills-marquee-container');
    const skillsTrack = document.querySelector('.skills-track');

    if (skillsMarqueeContainer && skillsTrack) {
        console.log("Initializing JS Skills Marquee (v6.2)...");

        let currentX = 0;
        let trackWidth = 0;
        const speed = 50; // Pixels per second
        let isAutoScrolling = false;
        let animationFrameId = null;
        let lastTimestamp = 0;

        let pointerDown = false;
        let dragEngaged = false;
        let startX = 0;
        let dragStartTranslateX = 0;
        let blockClickEvent = false;
        const dragThreshold = 5;

        // --- NEW: Timer for auto-resuming scroll ---
        let resumeScrollTimeoutId = null;
        const resumeDelay = 3000; // Resume after 3000ms (3 seconds) of inactivity

        // Function to calculate track width
        function calculateTrackWidth() {
             trackWidth = skillsTrack.scrollWidth / 2;
             console.log(`Calculated trackWidth (half scrollWidth): ${trackWidth}`);
             return trackWidth > 0;
        }

        // Auto Scroll Function
        function autoScroll(timestamp) {
            if (!isAutoScrolling || trackWidth <= 0) { animationFrameId = null; return; }
            if (lastTimestamp === 0) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            if (deltaTime > 0.5) {
                 console.warn("Large deltaTime, skipping scroll frame:", deltaTime);
                 animationFrameId = requestAnimationFrame(autoScroll);
                 return;
            }

            currentX -= speed * deltaTime;
            if (currentX <= -trackWidth) { currentX += trackWidth; }
            skillsTrack.style.transform = `translateX(${currentX}px)`;
            animationFrameId = requestAnimationFrame(autoScroll);
        }

        function startAutoScroll() {
            // Clear any pending resume timer *before* starting
            if (resumeScrollTimeoutId) {
                clearTimeout(resumeScrollTimeoutId);
                resumeScrollTimeoutId = null;
            }
            if (isAutoScrolling || !calculateTrackWidth()) return;
            console.log("Starting JS AutoScroll");
            isAutoScrolling = true;
            lastTimestamp = 0;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(autoScroll);
        }

        function stopAutoScroll() {
            // Clear the resume timer whenever scrolling is explicitly stopped
            if (resumeScrollTimeoutId) {
                clearTimeout(resumeScrollTimeoutId);
                resumeScrollTimeoutId = null;
                console.log("v6.2 Cleared resume timer during stopAutoScroll call.");
            }
            if (!isAutoScrolling) return;
            console.log("Stopping JS AutoScroll");
            isAutoScrolling = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            currentX = getTranslateX(skillsTrack); // Update state from style
        }

        // Helper to get current X
        const getTranslateX = (element) => {
           try {
               const style = window.getComputedStyle(element);
               const matrix = style.transform || style.webkitTransform || style.mozTransform;
               if (matrix === 'none'|| !matrix) return 0;
               const matrixValues = matrix.match(/matrix.*\((.+)\)/);
               if (matrixValues && matrixValues[1]) {
                   const values = matrixValues[1].split(',').map(s => parseFloat(s.trim()));
                   const idx = matrix.includes('3d') ? 12 : 4;
                   return values[idx] || 0;
               } return 0;
           } catch(e){ console.error("getTranslateX error", e); return 0; }
        };

        // --- Pointer Event Handlers ---
        const onPointerDown = (e) => {
            // --- Clear resume timer on new interaction ---
            if (resumeScrollTimeoutId) {
                clearTimeout(resumeScrollTimeoutId);
                resumeScrollTimeoutId = null;
                console.log("v6.2 Cleared resume timer on PointerDown.");
            }
            // ---

            if (trackWidth <= 0 && !calculateTrackWidth()) { console.warn("Track width unknown."); return; }
            pointerDown = true;
            dragEngaged = false;
            blockClickEvent = false;
            startX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
            stopAutoScroll(); // Stop auto-scroll on any interaction
            skillsTrack.style.transition = 'none';
            console.log(`v6.2 Pointer Down: startX=${startX.toFixed(2)}, AutoScroll Stopped.`);
        };

        const onPointerMove = (e) => {
            if (!pointerDown) return;
            const currentPointerX = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
            const walk = currentPointerX - startX;

            if (!dragEngaged && Math.abs(walk) > dragThreshold) {
                dragEngaged = true;
                blockClickEvent = true;
                dragStartTranslateX = currentX;
                startX = currentPointerX;
                bodyElement.classList.add('grabbing');
                skillsTrack.classList.add('dragging');
                console.log(`v6.2 Drag Engaged: dragStartTranslateX=${dragStartTranslateX.toFixed(2)}`);
            }

            if (dragEngaged) {
                e.preventDefault();
                const dragWalk = currentPointerX - startX;
                let newTranslateX = dragStartTranslateX + dragWalk;
                const maxTranslate = 0;
                const minTranslate = -trackWidth;
                newTranslateX = Math.max(minTranslate, Math.min(maxTranslate, newTranslateX));
                skillsTrack.style.transform = `translateX(${newTranslateX}px)`;
                currentX = newTranslateX;
            }
        };

        const onPointerUp = (e) => {
            if (!pointerDown) return;
            pointerDown = false;

            if (dragEngaged) {
                 console.log(`v6.2 Drag End: Final TranslateX=${currentX.toFixed(2)}`);
                 bodyElement.classList.remove('grabbing');
                 skillsTrack.classList.remove('dragging');
                 skillsTrack.style.transition = '';

                 // --- Start resume timer only if drag occurred ---
                 if (resumeScrollTimeoutId) clearTimeout(resumeScrollTimeoutId); // Clear previous just in case
                 console.log(`v6.2 Setting timer to resume scroll in ${resumeDelay}ms`);
                 resumeScrollTimeoutId = setTimeout(() => {
                     console.log("v6.2 Resume timer fired.");
                     startAutoScroll(); // Attempt to restart scroll
                     resumeScrollTimeoutId = null;
                 }, resumeDelay);
                 // ---

                 blockClickEvent = true;
                 setTimeout(() => { blockClickEvent = false; }, 50);
            } else {
                console.log("v6.2 Pointer Up: No drag (click/tap), keeping scroll stopped.");
                 blockClickEvent = false;
                 // Note: Auto-resume timer is NOT set for simple clicks currently
            }
            dragEngaged = false;
        };

        // --- Event Listeners ---
        skillsMarqueeContainer.addEventListener('mousedown', onPointerDown);
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);
        document.addEventListener('mouseleave', onPointerUp);
        skillsMarqueeContainer.addEventListener('touchstart', onPointerDown, { passive: true });
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('touchend', onPointerUp);
        document.addEventListener('touchcancel', onPointerUp);
        skillsTrack.addEventListener('click', (e) => {
            if (blockClickEvent) { e.preventDefault(); e.stopPropagation(); }
            blockClickEvent = false;
        }, true);

        // --- Resize Handling ---
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log("Resizing...");
                stopAutoScroll(); // Also clears resume timer
                if (calculateTrackWidth()) {
                     currentX = Math.max(-trackWidth, Math.min(0, getTranslateX(skillsTrack))); // Read actual current pos
                     skillsTrack.style.transform = `translateX(${currentX}px)`;
                     console.log(`Resize: New trackWidth=${trackWidth}, Read currentX=${currentX}`);
                     // Keep stopped after resize
                } else { console.warn("Could not calculate valid track width after resize."); }
            }, 250);
        });

        // --- Initial Start ---
        setTimeout(() => {
             if(calculateTrackWidth()) {
                 startAutoScroll();
                 console.log("JS Skills Marquee (v6.2) Initialized and Started.");
             } else {
                 console.error("JS Skills Marquee: Could not calculate track width on initial load.");
             }
        }, 100);

    } else { console.warn("Skills marquee container or track not found."); }
    // ==================================================


    // === Video Control Logic ===
    const visionProModal = document.getElementById('visionProModal');
    const visionProVideo = document.getElementById('visionProVideo');
    const playPauseBtn = document.getElementById('videoPlayPauseBtn');
    const playPauseIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;

    function updatePlayPauseIcon() {
        if (!visionProVideo || !playPauseIcon) return;
        if (visionProVideo.paused || visionProVideo.ended) {
            playPauseIcon.classList.remove('bi-pause-fill');
            playPauseIcon.classList.add('bi-play-fill');
            playPauseBtn.setAttribute('aria-label', 'Play Video');
        } else {
            playPauseIcon.classList.remove('bi-play-fill');
            playPauseIcon.classList.add('bi-pause-fill');
            playPauseBtn.setAttribute('aria-label', 'Pause Video');
        }
    }

    if (visionProModal && visionProVideo && playPauseBtn && playPauseIcon) {
        playPauseBtn.addEventListener('click', () => {
            if (visionProVideo.paused || visionProVideo.ended) {
                visionProVideo.play();
            } else {
                visionProVideo.pause();
            }
        });
        visionProModal.addEventListener('shown.bs.modal', () => {
            visionProVideo.play().catch(error => { console.warn("Video autoplay prevented:", error); updatePlayPauseIcon(); });
        });
        visionProModal.addEventListener('hidden.bs.modal', () => {
            visionProVideo.pause();
            visionProVideo.currentTime = 0; // Reset video to start
        });
        visionProVideo.addEventListener('play', updatePlayPauseIcon);
        visionProVideo.addEventListener('pause', updatePlayPauseIcon);
        visionProVideo.addEventListener('ended', updatePlayPauseIcon);
        updatePlayPauseIcon(); // Initial state
        console.log("Video controls initialized.");
    } else {
        console.warn("Elements for Vision Pro video controls not found.");
    }
    // === End Video Logic ===

}); // End DOMContentLoaded