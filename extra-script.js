document.addEventListener('DOMContentLoaded', () => {

    const isDesktop = window.matchMedia("(min-width: 769px)").matches;

    // --- 1. SPOTLIGHT CURSOR EFFECT ---
    try {
        const spotlight = document.querySelector('.spotlight');
        if (spotlight && isDesktop) {
            window.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    spotlight.style.setProperty('--cursorX', e.clientX + 'px');
                    spotlight.style.setProperty('--cursorY', e.clientY + 'px');
                });
            });
        }
    } catch (error) {
        console.error("Spotlight Effect Error:", error);
    }
    
    // --- 2. SCROLL-TRIGGERED FADE-IN ANIMATIONS ---
    const scrollSections = document.querySelectorAll('.scroll-section');
    if (scrollSections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        scrollSections.forEach(section => {
            observer.observe(section);
        });
        
        setTimeout(() => scrollSections[0].classList.add('in-view'), 100);
    }


    // --- 3. 3D PARALLAX HOVER ON CARDS ---
    try {
        if(isDesktop){
            const cards = document.querySelectorAll('.movie-card-item');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const { width, height } = rect;
                    
                    const rotateX = (y - height / 2) / (height / 2) * -7;
                    const rotateY = (x - width / 2) / (width / 2) * 7;
                    
                    requestAnimationFrame(() => {
                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                        card.style.zIndex = '10';
                    });
                });

                card.addEventListener('mouseleave', () => {
                    requestAnimationFrame(() => {
                        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                        card.style.zIndex = '1';
                    });
                });
            });
        }
    } catch (error) {
        console.error("Parallax Effect Error:", error);
    }
    

    // --- 4. COUNTDOWN TIMER ---
    try {
        const countdownDate = new Date("Aug 8, 2025 00:00:00").getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const formatTime = (time) => time < 10 ? `0${time}` : time;
            
            const daysEl = document.getElementById("days");
            const hoursEl = document.getElementById("hours");
            const minutesEl = document.getElementById("minutes");
            const secondsEl = document.getElementById("seconds");

            if(daysEl) daysEl.innerText = formatTime(days);
            if(hoursEl) hoursEl.innerText = formatTime(hours);
            if(minutesEl) minutesEl.innerText = formatTime(minutes);
            if(secondsEl) secondsEl.innerText = formatTime(seconds);

            if (distance < 0) {
                clearInterval(timer);
                const timerEl = document.getElementById("countdown-timer");
                if(timerEl) timerEl.innerHTML = "<div style='font-size: 1.5rem; color: var(--accent-primary);'>Out Now!</div>";
            }
        }, 1000);
    } catch (error) {
        console.error("Countdown Timer Error:", error);
    }
    
    // --- 5. INFINITE CAROUSEL ---
    try {
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            const movieGrid = carouselContainer.querySelector('.movie-grid');
            if (movieGrid) {
                const originalCards = movieGrid.innerHTML;
                movieGrid.innerHTML += originalCards;

                // **MODIFIED**: Only run JS animation on desktop
                if (isDesktop) {
                    let position = 0;
                    let isPausedByHover = false;
                    let isDragging = false;
                    let startX;
                    let startPosition;
                    const scrollSpeed = 0.4;
                    const loopPoint = movieGrid.scrollWidth / 2;

                    function animateCarousel() {
                        if (!isPausedByHover && !isDragging) {
                            position -= scrollSpeed;
                        }
                        
                        if (Math.abs(position) >= loopPoint) {
                            position %= loopPoint;
                        }

                        movieGrid.style.transform = `translateX(${position}px)`;
                        
                        requestAnimationFrame(animateCarousel);
                    }
                    
                    requestAnimationFrame(animateCarousel);
                    
                    carouselContainer.addEventListener('mouseenter', () => isPausedByHover = true);
                    carouselContainer.addEventListener('mouseleave', () => {
                        if(!isDragging) isPausedByHover = false;
                    });

                    carouselContainer.addEventListener('mousedown', (e) => {
                        isDragging = true;
                        startX = e.pageX;
                        startPosition = position;
                        e.preventDefault();
                    });

                    window.addEventListener('mouseup', () => {
                        if (isDragging) {
                            isDragging = false;
                            if (!carouselContainer.matches(':hover')) {
                                isPausedByHover = false;
                            }
                        }
                    });

                    window.addEventListener('mousemove', (e) => {
                        if (!isDragging) return;
                        const walk = e.pageX - startX;
                        position = startPosition + walk;
                    });

                    carouselContainer.addEventListener('click', (e) => {
                        if(Math.abs(position - startPosition) > 5) {
                             if (e.target.closest('a')) {
                                e.preventDefault();
                            }
                        }
                    }, true);
                }
                // On mobile, the CSS handles the overflow scrolling, so no JS is needed.
            }
        }
    } catch (error) {
        console.error("Carousel Error:", error);
    }
    

    // --- 6. BACK TO TOP BUTTON ---
    try {
        const backToTopBtn = document.getElementById("backToTopBtn");
        if(backToTopBtn) {
            window.onscroll = () => {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    backToTopBtn.classList.add("show");
                } else {
                    backToTopBtn.classList.remove("show");
                }
            };
            backToTopBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
        }
    } catch (error) {
        console.error("Back To Top Button Error:", error);
    }

    // --- 7. YOUTUBE IFRAME FALLBACK ---
    try {
        const trailerFrame = document.querySelector('.trailer-container iframe');
        const trailerPlaceholder = document.querySelector('.trailer-container .youtube-placeholder');
        
        const showPlaceholder = () => {
            if (trailerFrame) trailerFrame.style.display = 'none';
            if (trailerPlaceholder) trailerPlaceholder.style.display = 'flex';
        }

        if (trailerFrame) {
            trailerFrame.onerror = showPlaceholder;
            if (!trailerFrame.src || trailerFrame.src.length < 50 || trailerFrame.src.includes("googleusercontent.com")) { 
                showPlaceholder();
            }
        } else if (trailerPlaceholder) {
            showPlaceholder();
        }
    } catch(error) {
        console.error("YouTube Fallback Error:", error);
    }
});
