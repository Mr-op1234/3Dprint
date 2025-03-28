// Main JavaScript for 3D Printing Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the carousel
    initCarousel();
    
    // Initialize page transitions
    initPageTransitions();
    
    // Initialize animations
    initAnimations();
    
    // Other initializations can go here
});

// Page Transitions
function initPageTransitions() {
    // Handle internal links with smooth transitions
    const internalLinks = document.querySelectorAll('a[href^="#"], a[href^="homepage.html#"], a[href="homepage.html"], a[href="team.html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const isHomePage = window.location.pathname.endsWith('homepage.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
            
            // Handle services section navigation
            if (href === '#services' || href === 'homepage.html#services') {
                if (!isHomePage) {
                    // If not on homepage, redirect with transition
                    const transition = document.querySelector('.page-transition');
                    transition.style.transformOrigin = 'left';
                    transition.style.transform = 'scaleX(1)';
                    
                    setTimeout(() => {
                        window.location.href = 'homepage.html#services';
                    }, 500);
                } else {
                    // If on homepage, smooth scroll to services section with center alignment
                    const servicesSection = document.querySelector('#services');
                    const viewportHeight = window.innerHeight;
                    const elementTop = servicesSection.getBoundingClientRect().top + window.pageYOffset;
                    const elementHeight = servicesSection.offsetHeight;
                    const centerPosition = elementTop - (viewportHeight - elementHeight) / 2;
                    
                    window.scrollTo({
                        top: centerPosition,
                        behavior: 'smooth'
                    });
                    history.pushState(null, '', '#services');
                }
                return;
            }
            
            // Handle team.html and home navigation
            if (href === 'team.html' || (window.location.pathname.endsWith('team.html') && (href === '#home' || href === 'homepage.html' || href === 'homepage.html#home'))) {
                // Add transition effect before navigating
                const transition = document.querySelector('.page-transition');
                transition.style.transformOrigin = 'left';
                transition.style.transform = 'scaleX(1)';
                
                // Navigate after transition
                setTimeout(() => {
                    if (href === 'team.html') {
                        window.location.href = href;
                    } else {
                        window.location.href = 'homepage.html#home';
                    }
                }, 500);
                return;
            }
            
            // Handle home link specially
            if (href === '#home' || href === 'homepage.html' || href === 'homepage.html#home') {
                // Scroll to top with smooth animation for home section
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, '', '#home');
                
                // Update active state in navigation
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === '#home') {
                        navLink.classList.add('active');
                    }
                });
                return;
            }
        });
    });
    
    // Handle page load transition
    window.addEventListener('load', () => {
        const transition = document.querySelector('.page-transition');
        transition.style.transformOrigin = 'right';
        transition.style.transform = 'scaleX(0)';
    });
}

// Animations
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate hero section text
    const heroText = document.querySelectorAll('.animate-text');
    const heroTextDelay = document.querySelectorAll('.animate-text-delay');
    const heroTextDelay2 = document.querySelectorAll('.animate-text-delay-2');
    
    gsap.from(heroText, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from(heroTextDelay, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from(heroTextDelay2, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.6,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    // Animate team members on scroll
    const teamMembers = document.querySelectorAll('.team-member');
    if (teamMembers.length > 0) {
        gsap.from(teamMembers, {
            opacity: 0,
            y: 100,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.team-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }
    
    // Animate section headers on scroll
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        gsap.from(header, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
}

// Carousel functionality
function initCarousel() {
    // Initialize all carousels on the page
    const carousels = document.querySelectorAll('.project-carousel');
    if (carousels.length === 0) return;
    
    // Loop through each carousel and initialize it
    carousels.forEach(carousel => {
        initSingleCarousel(carousel);
    });
}

// Function to initialize a single carousel
function initSingleCarousel(carousel) {
    
    const carouselTrack = carousel.querySelector('.carousel-track');
    const slides = Array.from(carouselTrack.children);
    const nextButton = carousel.querySelector('.carousel-button-next');
    const prevButton = carousel.querySelector('.carousel-button-prev');
    const dotsNav = carousel.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);
    
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Arrange slides next to each other
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    // Function to move to a specific slide
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };
    
    // Update dots
    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide');
    };
    
    // Hide/show arrows
    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
    };
    
    // When I click left, move slides to the left
    prevButton.addEventListener('click', e => {
        const currentSlide = carouselTrack.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        const prevDot = currentDot.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);
        
        moveToSlide(carouselTrack, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        hideShowArrows(slides, prevButton, nextButton, prevIndex);
    });
    
    // When I click right, move slides to the right
    nextButton.addEventListener('click', e => {
        const currentSlide = carouselTrack.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        const nextDot = currentDot.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);
        
        moveToSlide(carouselTrack, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    });
    
    // When I click the nav indicators, move to that slide
    dotsNav.addEventListener('click', e => {
        // what indicator was clicked on?
        const targetDot = e.target.closest('button');
        
        if (!targetDot) return;
        
        const currentSlide = carouselTrack.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-slide');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];
        
        moveToSlide(carouselTrack, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    });
    
    // Auto-play functionality
    let autoplayInterval;
    
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            const currentSlide = carouselTrack.querySelector('.current-slide');
            let nextSlide = currentSlide.nextElementSibling;
            
            // If we're at the last slide, loop back to the first
            if (!nextSlide) {
                nextSlide = slides[0];
            }
            
            const currentDot = dotsNav.querySelector('.current-slide');
            const nextIndex = slides.findIndex(slide => slide === nextSlide);
            const nextDot = dots[nextIndex];
            
            moveToSlide(carouselTrack, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        }, 5000); // Change slide every 5 seconds
    };
    
    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}