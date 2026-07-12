/* ==========================================================================
   INTERACTION SCRIPT: PAPER & PENCIL (ART | ARCHITECTURE | INTERIORS)
   Liquid-smooth lag cursor, parallax scroll layers, section reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     PAGE INITIALIZATION & HERO REVEAL
     ========================================================================== */
  window.addEventListener('load', () => {
    // Add page loaded class to body to trigger staggered hero title lines
    setTimeout(() => {
      document.body.classList.add('page-loaded');
    }, 100);
  });


  /* ==========================================================================
     LIQUID CUSTOM CURSOR WITH DAMPED LAG (requestAnimationFrame)
     ========================================================================== */
  const cursorDot = document.getElementById('js-cursor-dot');
  const cursorRing = document.getElementById('js-cursor-ring');
  
  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    
    // Easing weights (smaller = more lag/damping)
    const dotEase = 0.4;
    const ringEase = 0.12;

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animation Loop
    const updateCursor = () => {
      // Easing calculation
      dotX += (mouseX - dotX) * dotEase;
      dotY += (mouseY - dotY) * dotEase;
      
      ringX += (mouseX - ringX) * ringEase;
      ringY += (mouseY - ringY) * ringEase;
      
      // Update DOM styles using high-performance translate3d
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      
      requestAnimationFrame(updateCursor);
    };
    
    requestAnimationFrame(updateCursor);

    // Hover Event Listeners
    const hoverTargets = document.querySelectorAll('.js-hover-target');
    const goldHoverTargets = document.querySelectorAll('.js-hover-target-gold');

    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    goldHoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover', 'cursor-gold-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover', 'cursor-gold-hover');
      });
    });
  }


  /* ==========================================================================
     SHRINKING NAVIGATION ON SCROLL
     ========================================================================== */
  const navbar = document.getElementById('js-navbar');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  };
  
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once in case user starts refreshed/scrolled


  /* ==========================================================================
     HIGH-PERFORMANCE PARALLAX SCROLLING
     ========================================================================== */
  const heroBg = document.getElementById('js-hero-bg');
  const studioImg = document.getElementById('js-studio-img');
  
  const handleParallax = () => {
    const scrollY = window.scrollY;
    
    // 1. Hero Parallax: Simple relative translation
    if (heroBg && scrollY < window.innerHeight) {
      // 0.25 scaling speed
      heroBg.style.transform = `translate3d(0, ${scrollY * 0.22}px, 0)`;
    }
    
    // 2. Studio Image Parallax: Scroll progress based calculation
    if (studioImg) {
      const rect = studioImg.parentElement.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Check if element is in viewport
      if (rect.top < viewHeight && rect.bottom > 0) {
        // Calculate raw relative scroll coordinate
        const scrollDistance = (viewHeight - rect.top);
        // Translate up to 12% shift
        studioImg.style.transform = `translate3d(0, ${-40 + (scrollDistance * 0.1)}px, 0)`;
      }
    }
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax(); // Run once at initial load


  /* ==========================================================================
     INTERSECTION OBSERVER FOR SCROLL REVEALS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Optional: Stop observing once revealed
          // revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12, // Trigger when 12% in view
      rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('in-view'));
  }


  /* ==========================================================================
     MINIMALIST CONTACT FORM INTERACTIVE SUCCESS STATE
     ========================================================================== */
  const contactForm = document.getElementById('js-contact-form');
  const formSuccess = document.getElementById('js-form-success');
  
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform sleek transition: fade out form elements
      contactForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      contactForm.style.opacity = '0';
      contactForm.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        contactForm.style.display = 'none';
        
        // Show success block with premium animation
        formSuccess.style.display = 'block';
      }, 400);
    });
  }

});
