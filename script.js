// Contents of script.js (Final Version with Intro, AOS Init, No Wave Anim)

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
  const targetElement = document.querySelector('.hero h1');
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
       console.error("Missing elements for intro sequence. Skipping animation.");
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

    // --- 2. Calculation Phase ---
    console.log("Calculating intro animation parameters...");
    const targetRect = targetElement.getBoundingClientRect(); const overlayRect = overlay.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2; const targetCenterY = targetRect.top + targetRect.height / 2; const overlayCenterX = overlayRect.left + overlayRect.width / 2; const overlayCenterY = overlayRect.top + overlayRect.height / 2;
    const targetX = targetCenterX - overlayCenterX; const targetY = targetCenterY - overlayCenterY; let targetScale = 1; try { const overlayStyle = window.getComputedStyle(overlay); const targetStyle = window.getComputedStyle(targetElement); const overlayFontSize = parseFloat(overlayStyle.fontSize); const targetFontSize = parseFloat(targetStyle.fontSize); if (isNaN(overlayFontSize) || isNaN(targetFontSize) || overlayFontSize <= 0 || targetFontSize <= 0) { console.warn(`Font size calculation issue. Using default scale 1.`); } else { targetScale = targetFontSize / overlayFontSize; } } catch (error) { console.error("Error calculating font size scale:", error); }
    console.log("Final Calculated transform:", { targetX, targetY, targetScale });
    overlay.style.setProperty('--target-x', `${targetX}px`); overlay.style.setProperty('--target-y', `${targetY}px`); overlay.style.setProperty('--target-scale', targetScale);

    // --- 3. Animation Trigger Phase (Coordinated Timings) ---
    const animationStartTime = 1000; // CSS animation-delay
    const animationDuration = 1500; // CSS animation-duration
    const animationEndTime = animationStartTime + animationDuration; // ~2500ms when transform finishes

    const contentFadeInDuration = 500; // Matches CSS transition (0.5s)
    const overlayFadeOutDuration = 300; // Matches CSS transition (0.3s)

    const contentFadeInDelay = animationEndTime - contentFadeInDuration; // ~2000ms
    const overlayFadeOutDelay = animationEndTime; // ~2500ms
    const typedJsInitDelay = overlayFadeOutDelay + overlayFadeOutDuration + 100; // ~2900ms
    // Calculate when to re-enable scrolling (AFTER overlay fade-out finishes)
    const scrollEnableDelay = overlayFadeOutDelay + overlayFadeOutDuration; // ~2800ms

    console.log("Triggering animations...");
    overlay.classList.add('animate'); // Trigger transform (starts after 1s CSS delay)

    // Schedule content FADE-IN
    setTimeout(() => {
      console.log(`Fading in main content at ${Date.now()}ms`);
      navbar.classList.add('visible');
      heroSection.classList.add('visible');
    }, contentFadeInDelay);

    // Schedule overlay FADE-OUT and Scroll Re-enable
    setTimeout(() => {
      console.log(`Fading out overlay at ${Date.now()}ms`);
      overlay.classList.add('fade-out');

      // Schedule scroll re-enable AFTER fade-out transition finishes
      setTimeout(() => {
          console.log("Re-enabling scroll.");
          bodyElement.classList.remove('no-scroll');
          // Also hide overlay completely for safety
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

  } // End else (Intro Will Play)


  // --- Initialize AOS (Animate on Scroll) ---
  // Needs to run regardless of whether intro played
  if (typeof AOS !== 'undefined') {
    console.log("Initializing AOS...");
    AOS.init({
        duration: 800, // Animation duration in ms
        once: true, // Animate elements only once while scrolling down
        offset: 50 // Trigger animations slightly earlier
    });
  } else {
      console.warn("AOS library not found. Scroll animations will not work.");
  }


}); // End DOMContentLoaded

// Removed Wave Scroll/IntersectionObserver/GSAP Logic