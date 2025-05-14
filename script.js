// Contents of script.js (v7.00 - MP3 Player Implementation)

// --- Initialization Guard ---
let typedJsInitialized = false;

// --- Typed.js Initialization Function ---
function initializeTypedJs() {
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
            if (!skillsTrack || skillsTrack.children.length === 0) return false; // Guard against no children
            // Ensure layout is stable before calculating width
            requestAnimationFrame(() => {
                if (skillsTrack.children.length > 1) { trackWidth = skillsTrack.scrollWidth / 2; } else { trackWidth = skillsTrack.scrollWidth; }
                console.log(`Marquee trackWidth calculated: ${trackWidth}`);
            });
             return trackWidth > 0; // Return based on previous calculation for sync code
        }
        function autoScroll(timestamp) { if (!isAutoScrolling || trackWidth <= 0) { animationFrameId = null; return; } if (lastTimestamp === 0) lastTimestamp = timestamp; const deltaTime = (timestamp - lastTimestamp) / 1000; lastTimestamp = timestamp; if (deltaTime > 0.5 || deltaTime <= 0) { console.warn("Marquee dT issue, adjusting or skipping frame."); animationFrameId = requestAnimationFrame(autoScroll); return; } currentX -= speed * deltaTime; if (currentX <= -trackWidth) { currentX += trackWidth; } skillsTrack.style.transform = `translateX(${currentX}px)`; animationFrameId = requestAnimationFrame(autoScroll); }
        function startAutoScroll() { if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; } if (isAutoScrolling || !calculateTrackWidth()) return; console.log("Marquee: Starting AutoScroll"); isAutoScrolling = true; lastTimestamp = 0; if (animationFrameId) cancelAnimationFrame(animationFrameId); animationFrameId = requestAnimationFrame(autoScroll); }
        function stopAutoScroll() { if (resumeScrollTimeoutId) { clearTimeout(resumeScrollTimeoutId); resumeScrollTimeoutId = null; } if (!isAutoScrolling) return; console.log("Marquee: Stopping AutoScroll"); isAutoScrolling = false; if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; } currentX = getTranslateX(skillsTrack); }
        const getTranslateX = (element) => { try { if(!element) return 0; const style = window.getComputedStyle(element); const matrix = style.transform || style.webkitTransform || style.mozTransform; if (matrix === 'none'|| !matrix) return 0; const matrixValues = matrix.match(/matrix.*\((.+)\)/); if (matrixValues && matrixValues[1]) { const values = matrixValues[1].split(',').map(s => parseFloat(s.trim())); const idx = matrix.includes('3d') ? 12 : 4; return values[idx] || 0; } return 0; } catch(e){ console.error("getTranslateX error", e); return 0; } };
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
             AOS.init({
                 duration: 700,
                 once: true,
                 offset: 80,
                });
         } else {
             console.warn("AOS library not found.");
         }
     } catch(e) {
         console.error("Error initializing AOS:", e);
     }
}

// --- Graduation Countdown Timer ---
function initializeCountdown() {
    const countdownElement = document.getElementById('graduation-countdown');
    if (!countdownElement) { console.warn("Countdown container not found."); return; }
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    const titleEl = countdownElement.querySelector('.countdown-title');

    if(!daysEl || !hoursEl || !minutesEl || !secondsEl || !titleEl) { console.error("One or more countdown time elements not found!"); return; }

    const graduationDate = new Date("May 17, 2025 00:00:00"); // Ensure this date is correct
    const graduationTime = graduationDate.getTime();
    console.log(`Target graduation date set to: ${graduationDate}`);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = graduationTime - now;

        if (distance < 0) {
            clearInterval(interval);
            console.log("Graduation date reached!");
            if(titleEl) titleEl.textContent = "Graduated!";
            daysEl.textContent = '00'; hoursEl.textContent = '00'; minutesEl.textContent = '00'; secondsEl.textContent = '00';
            const dateEl = countdownElement.querySelector('.countdown-date');
            if(dateEl) dateEl.style.display = 'none'; // Hide the date text
            return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    updateCountdown(); // Initial call
    const interval = setInterval(updateCountdown, 1000); // Update every second
    console.log("Countdown timer initialized.");
}
// --- End Graduation Countdown Timer ---


// === Back to Top Button Logic START ===
function initializeBackToTopButton() {
    const backToTopButton = document.getElementById("backToTopBtn");
    const scrollThreshold = 300; // Pixels to scroll before button appears

    if (!backToTopButton) {
        console.warn("Back to top button not found.");
        return;
    }

    const toggleBackToTopButton = () => {
        if (window.scrollY > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }
    };

    const scrollToTop = (event) => {
        event.preventDefault(); // Prevent default anchor jump
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        console.log("Scrolling to top.");
    };

    window.addEventListener("scroll", toggleBackToTopButton);
    backToTopButton.addEventListener("click", scrollToTop);

    // Initial check in case page loads scrolled down
    toggleBackToTopButton();

    console.log("Back to Top button initialized.");
}
// === Back to Top Button Logic END ===


// === Currently Listening Feature START (MP3 Player Version) ===
function initializeAudioPlayer() {
    console.log("Initializing MP3 Audio Player...");

    // --- Configuration ---
    const songs = [

      // IMPORTANT: Replace baseName with the EXACT filename (without extension)
      // Ensure corresponding .mp3 and image files exist in the specified paths.
        { baseName: "Sun_Go", title: "Sun Go", artist: "Greg Shilling" },
        { baseName: "PP", title: "Pluto Projector", artist: "Rex Orange County" },
        { baseName: "OIAM", title: "One In A Million", artist: "Rex Orange County" },
        { baseName: "Sweet_Dreams", title: "Sweet Dreams", artist: "j-hope (feat. Miguel)" },
        { baseName: "TIPTOE", title: "Tip Toe", artist: "HYBS" },
        { baseName: "GL", title: "Gimme Love", artist: "Joji" },
        { baseName: "CHIHIRO", title: "CHIHIRO", artist: "Billie Eilish" },
        { baseName: "BOAF", title: "Birds Of A Feather", artist: "Billie Eilish" },
        { baseName: "Forever", title: "Forever", artist: "Lewis Capaldi" },
        { baseName: "TL", title: "The Line", artist: "Twenty One Pilots" }
      
    ];
    const audioPath = "assets/audio/";     // Path to your MP3 files
    const imagePath = "assets/artwork/";    // Path to your artwork files
    const imageExtension = ".jpeg";         // Assumed extension for images (change if needed, e.g., ".png")
    // --- End Configuration ---

    // --- Element References ---
    const audioPlayer = document.getElementById('audio-player');
    const artworkImg = document.getElementById('song-artwork');
    const titleSpan = document.getElementById('song-title');
    const artistSpan = document.getElementById('song-artist');
    const progressFill = document.getElementById('song-progress-fill');
    const playPauseBtn = document.getElementById('play-pause-button');
    const playPauseIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
    const prevBtn = document.getElementById('prev-button');
    const nextBtn = document.getElementById('next-button');
    const muteBtn = document.getElementById('mute-toggle-button');
    const muteIcon = muteBtn ? muteBtn.querySelector('i') : null;

    let currentSongIndex = 0;
    let isPlaying = false;

    // --- Check if all required elements exist ---
    if (!audioPlayer || !artworkImg || !titleSpan || !artistSpan || !progressFill || !playPauseBtn || !playPauseIcon || !prevBtn || !nextBtn || !muteBtn || !muteIcon) {
        console.error("MP3 Player Error: One or more HTML elements not found. Check IDs.");
        // Optionally display an error message in the player card
        if(titleSpan) titleSpan.textContent = "Player Error";
        if(artistSpan) artistSpan.textContent = "Missing Elements";
        return; // Stop initialization
    }

    // --- Load Song Function ---
    function loadSong(songIndex) {
        if (songIndex < 0 || songIndex >= songs.length) {
            console.error(`Invalid song index: ${songIndex}`);
            return;
        }
        const song = songs[songIndex];
        console.log(`Loading song: ${song.title}`);

        // Update Text and Artwork
        titleSpan.textContent = song.title;
        artistSpan.textContent = song.artist;
        artworkImg.src = `${imagePath}${song.baseName}${imageExtension}`;
        artworkImg.alt = `${song.title} - ${song.artist}`;

        // Update Audio Source
        audioPlayer.src = `${audioPath}${song.baseName}.mp3`;

        // Reset Progress Bar
        progressFill.style.width = '0%';

        // Reset Play/Pause button (will update based on 'play'/'pause' events)
        setPlayPauseIcon(false); // Show 'Play' icon

        // Reset Mute button based on actual audio state
        setMuteIcon(audioPlayer.muted);

        // Important: Call load() after changing src to ensure metadata loads etc.
        audioPlayer.load();
    }

    // --- Play/Pause Functions ---
    function playSong() {
        audioPlayer.play()
          .then(() => {
            isPlaying = true;
            setPlayPauseIcon(true); // Show Pause
            console.log("Playback started");
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            // Autoplay might be blocked by browser initially
            isPlaying = false;
            setPlayPauseIcon(false); // Show Play
          });
    }

    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        setPlayPauseIcon(false); // Show Play
        console.log("Playback paused");
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function setPlayPauseIcon(playing) {
        playPauseIcon.classList.toggle('bi-play-fill', !playing);
        playPauseIcon.classList.toggle('bi-pause-fill', playing);
        playPauseBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }

    // --- Next/Prev Functions ---
    function playNextSong() {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0; // Loop back to start
        }
        loadSong(currentSongIndex);
        playSong(); // Automatically play the next song
    }

    function playPrevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1; // Loop back to end
        }
        loadSong(currentSongIndex);
        playSong(); // Automatically play the previous song
    }

    // --- Mute/Unmute Functions ---
    function toggleMute() {
        audioPlayer.muted = !audioPlayer.muted;
        console.log(audioPlayer.muted ? "Audio Muted" : "Audio Unmuted");
        // Icon update handled by 'volumechange' event
    }

    function setMuteIcon(muted) {
        muteIcon.classList.toggle('bi-volume-mute-fill', muted);
        muteIcon.classList.toggle('bi-volume-up-fill', !muted);
        muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    }

    // --- Progress Bar Update ---
    function updateProgress() {
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;

        if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
        } else {
             progressFill.style.width = '0%';
        }
    }

    // --- Event Listeners ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);
    muteBtn.addEventListener('click', toggleMute);

    // Audio Element Events
    audioPlayer.addEventListener('play', () => { // Update state when playback starts
        isPlaying = true;
        setPlayPauseIcon(true);
    });
    audioPlayer.addEventListener('pause', () => { // Update state when playback pauses
        isPlaying = false;
        setPlayPauseIcon(false);
    });
    audioPlayer.addEventListener('ended', playNextSong); // Auto-play next song
    audioPlayer.addEventListener('timeupdate', updateProgress); // Update progress bar
    audioPlayer.addEventListener('volumechange', () => { // Update mute icon when volume/mute state changes
        setMuteIcon(audioPlayer.muted);
    });
     audioPlayer.addEventListener('loadedmetadata', () => { // Update progress bar once duration is known
        console.log("Metadata loaded, duration:", audioPlayer.duration);
        updateProgress();
    });
     audioPlayer.addEventListener('error', (e) => {
         console.error("Audio playback error:", e);
         titleSpan.textContent = "Audio Error";
         artistSpan.textContent = "Cannot load track";
     });


    // --- Initial Load & Autoplay (Muted) ---
    loadSong(currentSongIndex); // Load the first song's info
    // Muted autoplay is generally allowed by browsers
    playSong();
    // No need to explicitly set audioPlayer.muted = true here,
    // as the 'muted' attribute is on the <audio> tag in HTML.
    // But we ensure the icon is correct initially:
    setMuteIcon(audioPlayer.muted);

    console.log("MP3 Audio Player Initialized.");
}
// === Currently Listening Feature END ===


// --- Main Setup on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Setting up Intro, AOS, Popovers, Videos, Countdown, BackToTop, Audio Player.");

    // --- Element References ---
    const overlay = document.getElementById('intro-overlay');
    const navbar = document.querySelector('nav.navbar');
    const heroSection = document.querySelector('section.hero');
    const targetElement = document.querySelector('.hero h1');
    const bodyElement = document.body;

    // --- Check if Intro Should Play ---
    const hasIntroPlayed = sessionStorage.getItem('introPlayed') === 'true';

    // Function to initialize non-API features (including the audio player)
    function initializeOtherFeatures() {
        initializeMarquee();
        initializeCountdown();
        initializeBackToTopButton();
        initializeAudioPlayer(); // Initialize the MP3 player
        initAos();
    }

    if (hasIntroPlayed) {
        // --- SKIP INTRO ---
        console.log("Intro already played. Skipping animation.");
        if (overlay) overlay.style.display = 'none';
        if (navbar) navbar.classList.add('visible');
        if (heroSection) heroSection.classList.add('visible');
        initializeTypedJs();
        // Initialize other features shortly after DOM ready
        setTimeout(initializeOtherFeatures, 100);

    } else {
        // --- PLAY INTRO ---
        console.log("Starting intro sequence.");
        if (!overlay || !navbar || !heroSection || !targetElement || !bodyElement) {
            console.error("Missing critical elements for intro. Skipping animation and initializing normally.");
            if(overlay) overlay.style.display = 'none';
            if(navbar) navbar.classList.add('visible');
            if(heroSection) heroSection.classList.add('visible');
            if(bodyElement) bodyElement.classList.remove('no-scroll');
            initializeTypedJs();
            setTimeout(initializeOtherFeatures, 100);
            sessionStorage.setItem('introPlayed', 'true');
            return;
        }
        // ... (Keep Intro calculation and scheduling logic as it was) ...
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
        } catch (error) { /* ... intro error handling remains ... */
            console.error("Error during intro parameter calculation:", error);
            if (overlay) overlay.style.display = 'none'; if (navbar) navbar.classList.add('visible'); if (heroSection) heroSection.classList.add('visible'); if (bodyElement) bodyElement.classList.remove('no-scroll'); initializeTypedJs();
            setTimeout(initializeOtherFeatures, 100); // Call features init
            sessionStorage.setItem('introPlayed', 'true'); return;
        }
        const rootStyle = getComputedStyle(document.documentElement);
        const getDuration = (varName, defaultValue) => { /* ... getDuration remains ... */
            const value = rootStyle.getPropertyValue(varName)?.trim(); if (value && value.endsWith('ms')) return parseInt(value, 10); if (value && value.endsWith('s')) return parseFloat(value) * 1000; console.warn(`CSS variable ${varName} not found or invalid, using default ${defaultValue}ms`); return defaultValue;
         };
        const animationStartTime = getDuration('--intro-animation-delay', 1000); const animationDuration = getDuration('--intro-animation-duration', 1500); const overlayFadeOutDuration = getDuration('--overlay-fade-duration', 300); const contentFadeInDuration = getDuration('--content-fade-duration', 500);
        const animationEndTime = animationStartTime + animationDuration; const contentFadeInDelay = animationEndTime - contentFadeInDuration; const overlayFadeOutDelay = animationEndTime; const finalHideDelay = overlayFadeOutDelay + overlayFadeOutDuration; const scrollEnableDelay = finalHideDelay; const typedJsInitDelay = contentFadeInDelay + contentFadeInDuration + 100;
        const otherFeaturesInitDelay = finalHideDelay + 50; // Init other features after intro animation

        console.log("Triggering .animate class (relies on CSS animation-delay)..."); overlay.classList.add('animate');
        setTimeout(() => { console.log(`Fading in main content (Scheduled for ~${contentFadeInDelay}ms)`); if (navbar) navbar.classList.add('visible'); if (heroSection) heroSection.classList.add('visible'); }, contentFadeInDelay);
        setTimeout(() => { console.log(`Fading out overlay (Scheduled for ~${overlayFadeOutDelay}ms)`); if (overlay) overlay.classList.add('fade-out'); }, overlayFadeOutDelay);
        setTimeout(() => { console.log(`Re-enabling scroll and hiding overlay (Scheduled for ~${finalHideDelay}ms)`); if (bodyElement) bodyElement.classList.remove('no-scroll'); if (overlay) overlay.style.visibility = 'hidden'; }, finalHideDelay);
        setTimeout(() => { console.log(`Initializing Typed.js (Scheduled for ~${typedJsInitDelay}ms)`); initializeTypedJs(); }, typedJsInitDelay);

        // Schedule other features (Marquee, Countdown, BackToTop, Audio Player, AOS)
        setTimeout(() => {
            console.log(`Initializing Marquee, Countdown, BackToTop, Audio Player, AOS (Scheduled for ~${otherFeaturesInitDelay}ms)`);
            initializeOtherFeatures(); // Call the grouped function
        }, otherFeaturesInitDelay);

        console.log("Setting introPlayed flag in sessionStorage."); sessionStorage.setItem('introPlayed', 'true');
    } // End else (Intro Will Play)


    // === Popover Logic (Click & Auto-Hide) ===
    // ... (Keep this logic as it was) ...
    const pfpImage = document.getElementById('navbarPfpImage');
    let popoverHideTimeout = null;
    if (pfpImage) {
        try {
            if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
                const popover = new bootstrap.Popover(pfpImage, { placement: 'bottom', customClass: 'cartoon-popover', trigger: 'manual' });
                pfpImage.addEventListener('click', () => { if (popoverHideTimeout) { clearTimeout(popoverHideTimeout); } popover.show(); popoverHideTimeout = setTimeout(() => { popover.hide(); popoverHideTimeout = null; }, 3000); });
                console.log("Popover logic initialized (Click trigger, Auto-Hide).");
            } else { console.warn("Bootstrap Popover component not found."); }
        } catch (e) { console.error("Error during popover setup:", e); }
    } else { console.warn("Navbar profile picture element (#navbarPfpImage) not found for popover."); }


    // === Generic Video Control Function for Modals ===
    // ... (Keep this function as it was - it controls project videos, not the audio player) ...
    function setupVideoControls(videoId, buttonId, modalId) {
        const playPauseBtn = document.getElementById(buttonId);
        const videoElement = document.getElementById(videoId);
        const modalElement = document.getElementById(modalId);
        if (!modalElement) { console.warn(`Modal #${modalId} not found for video controls.`); return; }
        if (!videoElement) { console.warn(`Video element #${videoId} not found inside modal #${modalId}.`); return; }
        if (!playPauseBtn) { console.warn(`Play/Pause button #${buttonId} not found for video #${videoId}.`); return; }
        try {
            const iconElement = playPauseBtn.querySelector('i');
            const updateButtonIcon = () => { if (!iconElement) return; const isPaused = videoElement.paused || videoElement.ended; iconElement.classList.toggle('bi-pause-fill', !isPaused); iconElement.classList.toggle('bi-play-fill', isPaused); playPauseBtn.setAttribute('aria-label', isPaused ? 'Play Video' : 'Pause Video'); };
            playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); if (videoElement.paused || videoElement.ended) { videoElement.play().catch(err => console.error(`Error trying to play ${videoId}:`, err)); } else { videoElement.pause(); } });
            videoElement.addEventListener('play', updateButtonIcon); videoElement.addEventListener('pause', updateButtonIcon); videoElement.addEventListener('ended', updateButtonIcon);
            updateButtonIcon();
            modalElement.addEventListener('shown.bs.modal', () => { videoElement.muted = true; videoElement.currentTime = 0; const playPromise = videoElement.play(); if (playPromise !== undefined) { playPromise.then(updateButtonIcon).catch(error => { console.warn(`${videoId} autoplay on modal show failed:`, error); updateButtonIcon(); }); } else { updateButtonIcon(); } });
            modalElement.addEventListener('hidden.bs.modal', () => { if (!videoElement.paused) { videoElement.pause(); } });
            console.log(`Video controls initialized for #${videoId} within #${modalId}.`);
        } catch (err) { console.error(`Error setting up video controls for ${videoId}:`, err); }
    }

    // --- Setup Video Controls for Each Project Modal ---
    setupVideoControls('visionProVideo', 'videoPlayPauseBtn', 'visionProModal');
    setupVideoControls('musicVideo', 'musicVideoPlayPauseBtn', 'musicClassifierModal');
    setupVideoControls('forsakenVideo', 'forsakenVideoPlayPauseBtn', 'projectThreeModal');
    setupVideoControls('networkAIVideo', 'networkAIVideoPlayPauseBtn', 'networkAIModal');
    // --- End Video Setup ---

}); // --- End DOMContentLoaded ---