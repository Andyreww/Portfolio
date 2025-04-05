// Contents of script.js (Transform Animation with Font Loading Check)

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
  const targetElement = document.querySelector('.hero h1'); // The H1 inside hero-text
  const bodyElement = document.body;

  // --- Check if Intro Should Play (Using Session Storage) ---
  const hasIntroPlayed = sessionStorage.getItem('introPlayed') === 'true';

  if (hasIntroPlayed) {
    // --- SKIP INTRO ---
    console.log("Intro already played this session. Skipping animation.");
    if (overlay) overlay.style.display = 'none';
    if (navbar) navbar.classList.add('visible');
    if (heroSection) heroSection.classList.add('visible');
    initializeTypedJs();

  } else {
    // --- PLAY INTRO (Transform Animation) ---
    console.log("Starting transform intro sequence.");

    if (!overlay || !navbar || !heroSection || !targetElement) {
       console.error("Missing critical elements for intro sequence. Skipping animation.");
       if(overlay) overlay.style.display = 'none';
       if(navbar) navbar.classList.add('visible');
       if(heroSection) heroSection.classList.add('visible');
       initializeTypedJs();
       return;
    }

    // --- 1. Disable Scrolling ---
    console.log("Disabling scroll.");
    bodyElement.classList.add('no-scroll');

    // --- 2. Wait for Fonts, Calculate, Animate ---
    console.log("Waiting for document fonts to be ready...");
    document.fonts.ready.then(() => {
        console.log("Fonts are ready. Proceeding with animation setup.");

        setTimeout(() => {
            console.log("Calculating intro animation parameters...");
            try { void overlay.offsetHeight; void targetElement.offsetHeight; } catch (e) { console.warn("Could not force reflow.", e); }

            let targetRect, overlayRect, targetX, targetY, targetScale = 1;

            try {
                 targetRect = targetElement.getBoundingClientRect();
                 overlayRect = overlay.getBoundingClientRect();
                 if (!targetRect || !overlayRect || targetRect.width === 0 || overlayRect.width === 0) { throw new Error("Failed to get valid bounding client rects."); }

                const targetCenterX = targetRect.left + targetRect.width / 2;
                const targetCenterY = targetRect.top + targetRect.height / 2;
                const overlayCenterX = overlayRect.left + overlayRect.width / 2;
                const overlayCenterY = overlayRect.top + overlayRect.height / 2;
                targetX = targetCenterX - overlayCenterX;
                targetY = targetCenterY - overlayCenterY;

                const overlayStyle = window.getComputedStyle(overlay);
                const targetStyle = window.getComputedStyle(targetElement);
                const overlayFontSize = parseFloat(overlayStyle.fontSize); // Reflects media query change on mobile
                const targetFontSize = parseFloat(targetStyle.fontSize);

                console.log("Font Sizes - Overlay:", overlayFontSize, "Target:", targetFontSize);
                console.log("Rects - Overlay:", overlayRect, "Target:", targetRect);

                if (!isNaN(overlayFontSize) && !isNaN(targetFontSize) && overlayFontSize > 0 && targetFontSize > 0) {
                    targetScale = targetFontSize / overlayFontSize;
                } else {
                    console.warn(`Font size calculation issue. Using default scale 1.`);
                    targetScale = 1;
                }
                console.log("Final Calculated transform:", { targetX, targetY, targetScale });

                overlay.style.setProperty('--target-x', `${targetX}px`);
                overlay.style.setProperty('--target-y', `${targetY}px`);
                overlay.style.setProperty('--target-scale', targetScale);

                // --- 3. Animation Trigger Phase ---
                const animationStartTime = 1000; const animationDuration = 1500; const animationEndTime = animationStartTime + animationDuration;
                const contentFadeInDuration = 500; const overlayFadeOutDuration = 300;
                const contentFadeInDelay = animationEndTime - contentFadeInDuration; const overlayFadeOutDelay = animationEndTime;
                const scrollEnableDelay = overlayFadeOutDelay + overlayFadeOutDuration; const typedJsInitDelay = scrollEnableDelay + 100;

                console.log("Triggering animations...");
                overlay.classList.add('animate');

                setTimeout(() => {
                  console.log(`Fading in main content at ${Date.now()}ms`);
                  if (navbar) navbar.classList.add('visible');
                  if (heroSection) heroSection.classList.add('visible');
                }, contentFadeInDelay);

                setTimeout(() => {
                  console.log(`Fading out overlay at ${Date.now()}ms`);
                  if (overlay) overlay.classList.add('fade-out');
                }, overlayFadeOutDelay);

                 setTimeout(() => {
                    console.log("Re-enabling scroll.");
                    bodyElement.classList.remove('no-scroll');
                }, scrollEnableDelay);

                setTimeout(() => {
                  console.log(`Initializing Typed.js at ${Date.now()}ms`);
                  initializeTypedJs();
                }, typedJsInitDelay);

                // --- 4. Set Flag ---
                console.log("Setting introPlayed flag in sessionStorage.");
                sessionStorage.setItem('introPlayed', 'true');

            } catch (error) {
                 console.error("Error during intro animation calculation/setup:", error);
                 if (overlay) overlay.style.display = 'none';
                 if (navbar) navbar.classList.add('visible');
                 if (heroSection) heroSection.classList.add('visible');
                 initializeTypedJs();
                 bodyElement.classList.remove('no-scroll');
            }
        }, 100); // Delay after fonts ready

    }).catch(error => {
        console.error("Fonts failed to load or check failed:", error);
        if (overlay) overlay.style.display = 'none';
        if (navbar) navbar.classList.add('visible');
        if (heroSection) heroSection.classList.add('visible');
        initializeTypedJs();
        bodyElement.classList.remove('no-scroll');
    });
  } // End else (Intro Will Play)

  // --- Initialize AOS ---
  if (typeof AOS !== 'undefined') {
    console.log("Initializing AOS...");
    AOS.init({ duration: 800, once: true, offset: 50 });
  } else { console.warn("AOS library not found."); }

}); // End DOMContentLoaded