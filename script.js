// Contents of script.js (Final Version with Intro, AOS Init, Mobile Sync Fix)

// --- Initialization Guard ---
let typedJsInitialized = false;

// --- Typed.js Initialization Function ---
function initializeTypedJs() {
  // Prevent multiple Typed initializations
  if (typedJsInitialized) { console.log("Typed.js already initialized. Skipping."); return; }
  typedJsInitialized = true;
  console.log("Attempting to initialize Typed.js...");
  var options = { strings: [ "I’m a computer science student", "I’m a movie lover", "I’m a passionate gamer", "I’m a problem-solver", "I’m a code enthusiast", "I’m a tech lover", "I’m a music fan", "I’m a lifelong learner", "I’m a creator", "I’m a tech geek", "I’m always coding", "I’m a digital artist", "I’m a future developer", "I’m a design thinker", "I’m a tech explorer" ], typeSpeed: 90, backSpeed: 70, backDelay: 1200, startDelay: 500, loop: true, showCursor: true };
  try {
    const targetSpan = document.getElementById('typed-output');
    if (!targetSpan) { console.error("Target span #typed-output NOT FOUND!"); return; }
    console.log("Target span #typed-output found:", targetSpan);
    var typed = new Typed("#typed-output", options);
    console.log("Typed.js instance CREATED successfully:", typed);
  } catch (error) { console.error("Error initializing Typed.js:", error); }
}


// --- Main Setup on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Loaded. Setting up Intro and AOS.");

  // --- Element References ---
  const overlay = document.getElementById('intro-overlay');
  const navbar = document.querySelector('nav.navbar');
  const heroSection = document.querySelector('section.hero');
  const targetElement = document.querySelector('.hero h1'); // Ensure this selector is correct and element exists
  const bodyElement = document.body;

  // --- Check if Intro Should Play (Using Session Storage) ---
  const hasIntroPlayed = sessionStorage.getItem('introPlayed') === 'true';

  if (hasIntroPlayed) {
    // --- SKIP INTRO ---
    console.log("Intro already played this session. Skipping animation.");
    if (overlay) overlay.style.display = 'none'; // Hide overlay immediately
    // Make content visible immediately
    if (navbar) navbar.classList.add('visible');
    if (heroSection) heroSection.classList.add('visible');
    initializeTypedJs(); // Initialize Typed.js right away

  } else {
    // --- PLAY INTRO (First time this session) ---
    console.log("Starting intro sequence for the first time this session.");

    // Check required elements for the intro animation itself
    if (!overlay || !navbar || !heroSection || !targetElement) {
       console.error("Missing critical elements for intro sequence. Skipping animation.");
       if(overlay) overlay.style.display = 'none';
       if(navbar) navbar.style.opacity = 1; // Use direct style if skipping intro classes
       if(heroSection) heroSection.style.opacity = 1;
       initializeTypedJs(); // Initialize Typed.js directly
       // If critical elements are missing, don't try to run the rest of intro logic
       return;
    }

    // --- 1. Disable Scrolling ---
    console.log("Disabling scroll.");
    bodyElement.classList.add('no-scroll');

    // --- 2. Calculation Phase (with slight delay for layout stabilization) ---
    // Add a small delay (e.g., 50ms) before calculating and starting animation
    setTimeout(() => {
        console.log("Calculating intro animation parameters...");
        const targetRect = targetElement.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();

        // Double-check elements after delay, before using rects
        if (!targetRect || !overlayRect || !overlay || !targetElement) {
            console.error("Could not get bounding rect or elements missing after delay. Skipping animation effects.");
            // Clean up in case of failure
            bodyElement.classList.remove('no-scroll');
            if(overlay) overlay.style.display = 'none';
            if(navbar) navbar.classList.add('visible'); // Make visible anyway
            if(heroSection) heroSection.classList.add('visible');
            initializeTypedJs();
            return;
        }

        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
        const overlayCenterX = overlayRect.left + overlayRect.width / 2;
        const overlayCenterY = overlayRect.top + overlayRect.height / 2;

        const targetX = targetCenterX - overlayCenterX;
        const targetY = targetCenterY - overlayCenterY;
        let targetScale = 1;
        try {
          const overlayStyle = window.getComputedStyle(overlay);
          const targetStyle = window.getComputedStyle(targetElement);
          const overlayFontSize = parseFloat(overlayStyle.fontSize);
          const targetFontSize = parseFloat(targetStyle.fontSize);
          // Added checks for NaN and zero font sizes
          if (!isNaN(overlayFontSize) && !isNaN(targetFontSize) && overlayFontSize > 0 && targetFontSize > 0) {
            targetScale = targetFontSize / overlayFontSize;
          } else {
            console.warn(`Font size calculation issue (Overlay: ${overlayFontSize}, Target: ${targetFontSize}). Using default scale 1.`);
            targetScale = 1; // Ensure it defaults reasonably
          }
        } catch (error) {
          console.error("Error calculating font size scale:", error);
          targetScale = 1; // Default on error
        }
        console.log("Final Calculated transform:", { targetX, targetY, targetScale });
        overlay.style.setProperty('--target-x', `${targetX}px`);
        overlay.style.setProperty('--target-y', `${targetY}px`);
        overlay.style.setProperty('--target-scale', targetScale);

        // --- 3. Animation Trigger Phase (Now starts AFTER the short delay) ---
        const animationStartTime = 1000; // CSS animation-delay (1s)
        const animationDuration = 1500; // CSS animation-duration (1.5s)
        const animationEndTime = animationStartTime + animationDuration; // Time when transform finishes (~2500ms from start trigger)

        const contentFadeInDuration = 500; // Matches CSS transition (0.5s)
        const overlayFadeOutDuration = 300; // Matches CSS transition (0.3s)

        // Calculate delays relative to the *start* of the process within this timeout
        const contentFadeInDelay = animationEndTime - contentFadeInDuration; // Start fading content *before* transform ends (~2000ms)
        const overlayFadeOutDelay = animationEndTime; // Start fading overlay *when* transform ends (~2500ms)
        const typedJsInitDelay = overlayFadeOutDelay + overlayFadeOutDuration + 100; // Start typed *after* overlay is gone (~2900ms)
        const scrollEnableDelay = overlayFadeOutDelay + overlayFadeOutDuration; // Enable scroll *after* overlay is gone (~2800ms)

        console.log("Triggering animations...");
        overlay.classList.add('animate'); // Trigger transform (starts after 1s CSS delay inherent in the class style)

        // Schedule content FADE-IN
        setTimeout(() => {
          console.log(`Fading in main content at ${Date.now()}ms`);
          if (navbar) navbar.classList.add('visible');
          if (heroSection) heroSection.classList.add('visible');
        }, contentFadeInDelay);

        // Schedule overlay FADE-OUT and Scroll Re-enable
        setTimeout(() => {
          console.log(`Fading out overlay at ${Date.now()}ms`);
          if (overlay) overlay.classList.add('fade-out');

          // Schedule scroll re-enable AFTER fade-out transition finishes
          setTimeout(() => {
              console.log("Re-enabling scroll.");
              bodyElement.classList.remove('no-scroll');
              // Also hide overlay completely for safety after fade
              if(overlay) overlay.style.visibility = 'hidden';
          }, overlayFadeOutDuration); // Delay matches fade duration

        }, overlayFadeOutDelay);

        // Initialize Typed.js
        setTimeout(() => {
          console.log(`Initializing Typed.js at ${Date.now()}ms`);
          initializeTypedJs();
        }, typedJsInitDelay);

        // --- 4. Set Flag: Mark intro as played for this session ---
        console.log("Setting introPlayed flag in sessionStorage.");
        sessionStorage.setItem('introPlayed', 'true');

    }, 50); // <-- The 50ms delay before calculations and triggering the animation sequence

  } // End else (Intro Will Play)


  // --- Initialize AOS (Animate on Scroll) ---
  // Needs to run regardless of whether intro played or not
  if (typeof AOS !== 'undefined') {
    console.log("Initializing AOS...");
    AOS.init({
        duration: 800, // Animation duration in ms
        once: true, // Animate elements only once while scrolling down
        offset: 50 // Trigger animations slightly earlier/later
    });
  } else {
      console.warn("AOS library not found. Scroll animations will not work.");
  }

}); // End DOMContentLoaded

// Removed Wave Scroll/IntersectionObserver/GSAP Logic (as per original provided script)