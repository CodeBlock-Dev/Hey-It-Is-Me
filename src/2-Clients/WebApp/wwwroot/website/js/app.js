// Consolidated JavaScript for both index.html and page.html

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the index page (has typing animation)
    if (document.getElementById('typingText')) {
        initializeIndexPage();
    }
    
    // Check if we're on the page.html (has circular social items)
    if (document.querySelector('.circular-social')) {
        initializePagePage();
    }
    
    // Check if we're on the page.html (has new fact items)
    if (document.querySelector('.fact-item')) {
        initializeFactItems();
        initializeFactsScrollArrow();
    }
    
    // Initialize pricing section functionality
    initializePricingSection();
    
    // Initialize testimonials section functionality
    initializeTestimonialsSection();
    
    // Initialize steps section functionality
    initializeStepsSection();
    
    // Initialize AI process section functionality
    initializeAIProcessSection();
    
    // Create floating fact images for both page.html and index.html
    createFloatingFactImages();
    
    // Handle window resize to recreate the wall
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const container = document.getElementById('floatingFactImages');
            if (container) {
                container.innerHTML = ''; // Clear existing images
                createFloatingFactImages(); // Recreate the wall
            }
        }, 250);
    });
    
    // Handle anchor navigation after page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(function() {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }
});

// Index page functionality (typing animation)
function initializeIndexPage() {
    // Typing animation
    function getTipsFromHTML() {
        const tipsContainer = document.getElementById('tipsData');
        const tipElements = tipsContainer.querySelectorAll('[data-tip]');
        return Array.from(tipElements).map(el => el.getAttribute('data-tip'));
    }

    const tips = getTipsFromHTML();
    let currentTipIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 10;
    let deletingSpeed = 15;
    let pauseTime = 1000;

    function typeText() {
        const textElement = document.getElementById('text');
        const currentTip = tips[currentTipIndex];

        if (isDeleting) {
            textElement.textContent = currentTip.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = deletingSpeed;
        } else {
            textElement.textContent = currentTip.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && currentCharIndex === currentTip.length) {
            typingSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTipIndex = (currentTipIndex + 1) % tips.length;
            typingSpeed = 500;
        }

        setTimeout(typeText, typingSpeed);
    }

    // Start typing animation
    typeText();
}

// Page.html functionality (circular social, contact modal, scroll indicator)
function initializePagePage() {
    // Add click and touch events to scroll arrow
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        function handleScrollClick() {
            // Add a subtle click animation
            scrollArrow.style.transform = 'scale(0.95)';
            setTimeout(() => {
                scrollArrow.style.transform = 'scale(1)';
            }, 150);
            
            // Smooth scroll to facts section
            const factsSection = document.getElementById('facts');
            if (factsSection) {
                factsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Add both click and touch events for better mobile support
        scrollArrow.addEventListener('click', handleScrollClick);
        scrollArrow.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleScrollClick();
        });
        
        // Add touch start for visual feedback
        scrollArrow.addEventListener('touchstart', function(e) {
            // Don't prevent default - let the touchend handle the action
            this.style.transform = 'scale(0.95)';
        });
    }
    
    // Initialize circular social items
    initializeCircularSocial();
    
    // Contact modal functionality
    const contactButton = document.getElementById('contactButton');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    
    if (contactButton && contactModal && closeModal) {
        contactButton.addEventListener('click', function() {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        // Add touch support for mobile
        contactButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeModal.addEventListener('click', function() {
            contactModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
        
        // Add touch support for close button
        closeModal.addEventListener('touchend', function(e) {
            e.preventDefault();
            contactModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal when touching outside (mobile)
        contactModal.addEventListener('touchend', function(e) {
            if (e.target === contactModal) {
                e.preventDefault();
                contactModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) {
                contactModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Circular social items functionality
function initializeCircularSocial() {
    const socialItems = document.querySelectorAll('.social-item');
    const customTooltip = document.getElementById('customTooltip');
    
    socialItems.forEach(item => {
        // Add hover events for custom tooltip
        item.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText && customTooltip) {
                customTooltip.textContent = tooltipText;
                customTooltip.classList.add('show');
                
                // Position tooltip relative to the social item
                const rect = this.getBoundingClientRect();
                const tooltipRect = customTooltip.getBoundingClientRect();
                
                // Position tooltip above the social item
                const left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                const top = rect.top - tooltipRect.height - 10;
                
                customTooltip.style.left = left + 'px';
                customTooltip.style.top = top + 'px';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (customTooltip) {
                customTooltip.classList.remove('show');
            }
        });
        
        // Add click animation
        item.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 150);
            
            // Add a subtle pulse effect
            this.style.boxShadow = '0 0 20px rgba(78, 205, 196, 0.5)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 300);
        });
        
        // Add touch support for mobile
        item.addEventListener('touchstart', function(e) {
            // Don't prevent default for links - let them work normally
            if (!this.href) {
                e.preventDefault();
            }
            this.style.transform = 'scale(0.9)';
        });
        
        item.addEventListener('touchend', function(e) {
            // Don't prevent default for links - let them work normally
            if (!this.href) {
                e.preventDefault();
            }
            this.style.transform = 'scale(1.1)';
        });
        
        // Add keyboard navigation support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const socialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate social items when they come into view
                const socialItems = entry.target.querySelectorAll('.social-item');
                socialItems.forEach((item, index) => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    item.style.transition = `all 0.5s ease ${index * 0.1}s`;
                });
            } else {
                // Reset animation when they go out of view
                const socialItems = entry.target.querySelectorAll('.social-item');
                socialItems.forEach(item => {
                    item.style.opacity = '0.7';
                    item.style.transform = 'scale(0.8)';
                });
            }
        });
    }, observerOptions);
    
    // Observe the avatar container
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        // Set initial state for animation
        const socialItems = avatarContainer.querySelectorAll('.social-item');
        socialItems.forEach(item => {
            item.style.opacity = '0.7';
            item.style.transform = 'scale(0.8)';
            item.style.transition = 'all 0.5s ease';
        });
        
        socialObserver.observe(avatarContainer);
    }
}

// Floating fact images functionality for both page.html and index.html
function createFloatingFactImages() {
    const container = document.getElementById('floatingFactImages');
    if (!container) return;
    
    // Get fact images from HTML data attributes
    const factImagesData = document.querySelectorAll('[data-fact-image]');
    const factImages = Array.from(factImagesData).map(img => img.getAttribute('data-fact-image'));
    
    // Fallback images if no data attributes are found
    if (factImages.length === 0) {
        const fallbackImages = [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop'
        ];
        factImages.push(...fallbackImages);
    }
    
    // Create a seamless tiled wall
    const imageSize = 200; // Base size for images
    const rows = Math.ceil(window.innerHeight / imageSize) + 2; // Extra rows for seamless effect
    const colsPerSet = Math.ceil(window.innerWidth / imageSize) + 2; // Extra cols for seamless effect
    
    // Create two identical sets for seamless looping
    for (let set = 0; set < 2; set++) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < colsPerSet; col++) {
                const image = document.createElement('img');
                image.className = 'floating-fact-image';
                
                // Randomly select an image from the fact images
                const randomImageIndex = Math.floor(Math.random() * factImages.length);
                image.src = factImages[randomImageIndex];
                image.alt = `Fact Image ${randomImageIndex + 1}`;
                
                // Calculate position
                const x = (col * imageSize) + (set * colsPerSet * imageSize);
                const y = row * imageSize;
                
                // Set size with slight variation for more natural look
                const sizeVariation = Math.random() * 40 + 20; // ±20px variation
                const width = imageSize + sizeVariation;
                const height = imageSize + sizeVariation;
                
                image.style.width = width + 'px';
                image.style.height = height + 'px';
                image.style.left = x + 'px';
                image.style.top = y + 'px';
                
                // Add slight rotation for more dynamic look
                const rotation = (Math.random() - 0.5) * 4; // ±2 degrees
                image.style.transform = `rotate(${rotation}deg)`;
                
                container.appendChild(image);
            }
        }
    }
    
    // Add some additional random images for more variety
    for (let i = 0; i < 20; i++) {
        const image = document.createElement('img');
        image.className = 'floating-fact-image';
        
        const randomImageIndex = Math.floor(Math.random() * factImages.length);
        image.src = factImages[randomImageIndex];
        image.alt = `Fact Image ${randomImageIndex + 1}`;
        
        // Random position
        const x = Math.random() * (window.innerWidth * 2);
        const y = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 100 + 150; // 150-250px
        image.style.width = size + 'px';
        image.style.height = size + 'px';
        image.style.left = x + 'px';
        image.style.top = y + 'px';
        
        // Random rotation
        const rotation = (Math.random() - 0.5) * 6; // ±3 degrees
        image.style.transform = `rotate(${rotation}deg)`;
        
        container.appendChild(image);
    }
}

// Fact items functionality with scroll animations
function initializeFactItems() {
    const factItems = document.querySelectorAll('.fact-item');
    
    if (factItems.length === 0) {
        return;
    }
    
    // Initialize fact items with scroll animations
    factItems.forEach((item, index) => {
        // Set initial state - visible but positioned off-screen
        item.style.opacity = '1';
        item.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
        
        // Determine layout direction based on CSS flex-direction
        const isEvenItem = index % 2 === 0;
        const factImage = item.querySelector('.fact-image');
        const factContent = item.querySelector('.fact-content');
        
        if (isEvenItem) {
            // Even items: image on left, content on right
            if (factImage) {
                factImage.style.transform = 'translateX(-80px)';
                factImage.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                factImage.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                factImage.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            }
            if (factContent) {
                factContent.style.transform = 'translateX(80px)';
                factContent.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                factContent.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                factContent.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            }
        } else {
            // Odd items: content on left, image on right (due to flex-direction: row-reverse)
            if (factContent) {
                factContent.style.transform = 'translateX(-80px)';
                factContent.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                factContent.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                factContent.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            }
            if (factImage) {
                factImage.style.transform = 'translateX(80px)';
                factImage.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                factImage.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                factImage.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            }
        }
        
        const factImageImg = item.querySelector('.fact-image img');
        if (factImageImg) {
            factImageImg.style.transition = 'opacity 0.5s ease, filter 0.5s ease, transform 0.3s ease';
        }
        
        // Add hover effects to fact-image only - using previous scroll effects
        const factImageHover = item.querySelector('.fact-image');
        if (factImageHover) {
            factImageHover.addEventListener('mouseenter', function() {
                this.style.borderColor = 'rgba(78, 205, 196, 0.6)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 35px rgba(78, 205, 196, 0.3)';
                
                const image = this.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1.05)';
                    image.style.filter = 'brightness(1.1) contrast(1.05)';
                }
            });
            
            factImageHover.addEventListener('mouseleave', function() {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
                
                const image = this.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1)';
                    image.style.filter = 'brightness(1) contrast(1)';
                }
            });
        }
        
        // Add hover effects to fact-content only - using previous scroll effects
        const factContentHover = item.querySelector('.fact-content');
        if (factContentHover) {
            factContentHover.addEventListener('mouseenter', function() {
                this.style.borderColor = 'rgba(78, 205, 196, 0.8)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(78, 205, 196, 0.4)';
            });
            
            factContentHover.addEventListener('mouseleave', function() {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            });
        }
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const factObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            
            // Get the index to determine layout
            const index = Array.from(factItems).indexOf(entry.target);
            const isEvenItem = index % 2 === 0;
            
            if (entry.isIntersecting) {
                // Slide-in animation when fact comes into view
                const factImage = entry.target.querySelector('.fact-image');
                const factContent = entry.target.querySelector('.fact-content');
                
                // Both elements slide to center position
                if (factImage) {
                    factImage.style.transform = 'translateX(0)';
                }
                
                if (factContent) {
                    factContent.style.transform = 'translateX(0)';
                }
            } else {
                // Reset animation when fact goes out of view
                const factImage = entry.target.querySelector('.fact-image');
                const factContent = entry.target.querySelector('.fact-content');
                
                if (isEvenItem) {
                    // Even items: image slides left, content slides right
                    if (factImage) {
                        factImage.style.transform = 'translateX(-80px)';
                    }
                    if (factContent) {
                        factContent.style.transform = 'translateX(80px)';
                    }
                } else {
                    // Odd items: content slides left, image slides right
                    if (factContent) {
                        factContent.style.transform = 'translateX(-80px)';
                    }
                    if (factImage) {
                        factImage.style.transform = 'translateX(80px)';
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe each fact item
    factItems.forEach((item, index) => {
        factObserver.observe(item);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            scrollToNextFact();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollToPreviousFact();
        }
    });
}

// Facts Scroll Arrow functionality
function initializeFactsScrollArrow() {
    const factsScrollArrow = document.getElementById('factsScrollArrow');
    const factItems = document.querySelectorAll('.fact-item');
    const ctaSection = document.getElementById('cta');
    
    if (!factsScrollArrow || factItems.length === 0) {
        return;
    }
    
    let currentFactIndex = 0;
    let isVisible = false;
    
    // Function to get the currently visible fact item
    function getCurrentVisibleFact() {
        let currentFact = null;
        let currentIndex = -1;
        
        factItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            
            // Check if the fact item is visible in the viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Find the fact item that's most centered in the viewport
                const centerY = window.innerHeight / 2;
                const itemCenterY = rect.top + rect.height / 2;
                const distanceFromCenter = Math.abs(centerY - itemCenterY);
                
                // If this is the first item or closer to center than current best
                if (currentFact === null || distanceFromCenter < Math.abs(centerY - (currentFact.getBoundingClientRect().top + currentFact.getBoundingClientRect().height / 2))) {
                    currentFact = item;
                    currentIndex = index;
                }
            }
        });
        
        // Always return an object, even if no fact is visible
        return { fact: currentFact, index: currentIndex };
    }
    
    // Function to show/hide the scroll arrows
    function updateScrollArrowVisibility() {
        const heroSection = document.getElementById('hero');
        const factsSection = document.getElementById('facts');
        const ctaContent = document.querySelector('.cta-content');
        const scrollToTop = document.getElementById('scrollToTop');
        
        if (!heroSection || !factsSection || !ctaContent || !scrollToTop) {
            return;
        }

        const heroSectionRect = heroSection.getBoundingClientRect();
        const factsSectionRect = factsSection.getBoundingClientRect();
        const ctaContentRect = ctaContent.getBoundingClientRect();
        
        const isHeroSectionVisible = heroSectionRect.top < window.innerHeight && heroSectionRect.bottom > 0;
        const isFactsSectionVisible = factsSectionRect.top < window.innerHeight && factsSectionRect.bottom > 0;
        const isCtaContentVisible = ctaContentRect.top < window.innerHeight && ctaContentRect.bottom > 0;

        // Handle facts scroll arrow
        // Show only when facts section is visible AND hero section is NOT visible AND CTA content is NOT visible
        if (isFactsSectionVisible && !isHeroSectionVisible && !isCtaContentVisible) {
            showScrollArrow();
        } else {
            hideScrollArrow();
        }

        // Handle scroll to top arrow
        // Show only when CTA content is visible
        if (isCtaContentVisible) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    }
    
    function showScrollArrow() {
        if (!isVisible) {
            factsScrollArrow.style.opacity = '1';
            factsScrollArrow.style.visibility = 'visible';
            factsScrollArrow.style.pointerEvents = 'all';
            factsScrollArrow.classList.add('visible');
            isVisible = true;
        }
    }
    
    function hideScrollArrow() {
        if (isVisible) {
            factsScrollArrow.style.opacity = '0';
            factsScrollArrow.style.visibility = 'hidden';
            factsScrollArrow.style.pointerEvents = 'none';
            factsScrollArrow.classList.remove('visible');
            isVisible = false;
        }
    }
    
    // Function to scroll to next fact
    function scrollToNextFact() {
        const nextIndex = currentFactIndex + 1;
        if (nextIndex < factItems.length) {
            factItems[nextIndex].scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Add click event to scroll arrow
    factsScrollArrow.addEventListener('click', function() {
        // Add click animation
        const content = this.querySelector('.scroll-arrow-content');
        content.style.transform = 'scale(0.95)';
        setTimeout(() => {
            content.style.transform = 'scale(1)';
        }, 150);
        
        scrollToNextFact();
    });
    
    // Add touch support for mobile
    factsScrollArrow.addEventListener('touchend', function(e) {
        e.preventDefault();
        const content = this.querySelector('.scroll-arrow-content');
        content.style.transform = 'scale(0.95)';
        setTimeout(() => {
            content.style.transform = 'scale(1)';
        }, 150);
        
        scrollToNextFact();
    });
    
    // Add touch start for visual feedback
    factsScrollArrow.addEventListener('touchstart', function(e) {
        const content = this.querySelector('.scroll-arrow-content');
        content.style.transform = 'scale(0.95)';
    });
    
    // Update arrow visibility on scroll and resize
    document.addEventListener('scroll', function() {
        updateScrollArrowVisibility();
    });
    
    // Update arrow visibility on resize
    window.addEventListener('resize', function() {
        updateScrollArrowVisibility();
    });
    
    // Initial check
    updateScrollArrowVisibility();
    
    // Force a check after a short delay to ensure DOM is ready
    setTimeout(function() {
        updateScrollArrowVisibility();
    }, 1000);

    // Initialize scroll to top functionality
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add touch support
        scrollToTop.addEventListener('touchend', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndY - touchStartY;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe down - go to previous fact
                scrollToPreviousFact();
            } else {
                // Swipe up - go to next fact
                scrollToNextFact();
            }
        }
    }
    
    function scrollToNextFact() {
        const currentFact = getCurrentVisibleFact();
        if (currentFact && currentFact.nextElementSibling) {
            currentFact.nextElementSibling.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    function scrollToPreviousFact() {
        const currentFact = getCurrentVisibleFact();
        if (currentFact && currentFact.previousElementSibling) {
            currentFact.previousElementSibling.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    function getCurrentVisibleFact() {
        let currentFact = null;
        factItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentFact = item;
            }
        });
        return currentFact;
    }
}

// Pricing section functionality
function initializePricingSection() {
    // Handle smooth scrolling to pricing section
    const createPageBtn = document.getElementById('createPageBtn');
    if (createPageBtn) {
        createPageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                pricingSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Add hover effects to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Testimonials section functionality
function initializeTestimonialsSection() {
    // Add hover effects to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to stat items (hearts, comments, retweets)
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Simulate interaction (in a real app, this would update the count)
            const icon = this.querySelector('i');
            const count = this.querySelector('span');
            
            if (icon.classList.contains('bi-heart')) {
                // Heart animation
                icon.style.color = '#e74c3c';
                setTimeout(() => {
                    icon.style.color = '';
                }, 1000);
            } else if (icon.classList.contains('bi-chat')) {
                // Comment animation
                icon.style.color = '#3498db';
                setTimeout(() => {
                    icon.style.color = '';
                }, 1000);
            } else if (icon.classList.contains('bi-repeat')) {
                // Retweet animation
                icon.style.color = '#2ecc71';
                setTimeout(() => {
                    icon.style.color = '';
                }, 1000);
            }
        });
    });
    
    // Pause animation on hover for better readability
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    
    if (testimonialsTrack && testimonialsCarousel) {
        testimonialsCarousel.addEventListener('mouseenter', function() {
            testimonialsTrack.style.animationPlayState = 'paused';
        });
        
        testimonialsCarousel.addEventListener('mouseleave', function() {
            testimonialsTrack.style.animationPlayState = 'running';
        });
    }
    
    // Add touch/swipe support for mobile (optional enhancement)
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (testimonialsCarousel) {
        testimonialsCarousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        testimonialsCarousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleTestimonialSwipe();
        });
    }
    
    function handleTestimonialSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            // Add a subtle visual feedback for swipe
            testimonialsTrack.style.transform = `translateX(${swipeDistance * 0.1}px)`;
            setTimeout(() => {
                testimonialsTrack.style.transform = '';
            }, 200);
        }
    }
}

// Steps section functionality
function initializeStepsSection() {
    // Only apply animations if we're NOT on the index page (i.e., on page.html)
    // Since page.html doesn't have steps section, this effectively disables animations for index.html
    const isIndexPage = document.getElementById('typingText') !== null;
    
    // Add hover effects to step items
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        // Only add animation delay if not on index page
        if (!isIndexPage) {
            item.style.animationDelay = `${index * 0.1}s`;
        }
        
        // Add click interaction for mobile
        item.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1)';
            }, 150);
            
            // Add a subtle pulse effect
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 300);
        });
        
        // Remove problematic touch event handlers that prevent scrolling
        // The CSS touch-action properties will handle touch behavior properly
    });
    
    // Only add scroll animations if not on index page
    if (!isIndexPage) {
        // Add intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const stepsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe step items for scroll animations
        stepItems.forEach((item, index) => {
            // Set initial state for animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `all 0.6s ease ${index * 0.1}s`;
            
            stepsObserver.observe(item);
        });
    }
    
    // Add special hover effect for step icons
    const stepIcons = document.querySelectorAll('.step-icon');
    stepIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            // Add a subtle rotation effect
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Add click effect to step numbers
    const stepNumbers = document.querySelectorAll('.step-number');
    stepNumbers.forEach(number => {
        number.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Add click animation
            this.style.transform = 'translateX(-50%) scale(1.2)';
            this.style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.6)';
            
            setTimeout(() => {
                this.style.transform = 'translateX(-50%) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(255, 193, 7, 0.4)';
            }, 200);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Add focus styles for accessibility
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('step-item')) {
                focusedElement.style.outline = '2px solid #4ecdc4';
                focusedElement.style.outlineOffset = '2px';
            }
        }
    });
    
    // Remove focus outline when clicking
    stepItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.outline = 'none';
        });
    });
}

// AI Process section functionality
function initializeAIProcessSection() {
    // Get process steps and connections
    const processSteps = document.querySelectorAll('.process-step');
    const processConnections = document.querySelectorAll('.process-connection');

    // Initialize step elements without scroll animations - keep them visible
    processSteps.forEach((step, index) => {
        // Set elements to be visible by default (no scroll animation)
        step.style.opacity = '1';
        step.style.transform = 'translateY(0) scale(1)';
        step.style.transition = 'all 0.3s ease'; // Keep transition for hover effects
    });

    // Initialize connection elements without scroll animations
    processConnections.forEach(connection => {
        connection.style.opacity = '1';
        connection.style.transform = 'scale(1)';
        connection.style.transition = 'all 0.3s ease'; // Keep transition for hover effects
    });

    // Initialize chat messages without scroll animations
    const chatMessages = document.querySelectorAll('.chat-message');
    chatMessages.forEach((message, index) => {
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
        message.style.transition = 'all 0.3s ease'; // Keep transition for hover effects
    });

    // Add hover effects for process steps (keeping these as requested)
    processSteps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            step.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        step.addEventListener('mouseleave', () => {
            step.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation for connection icons
    processConnections.forEach(connection => {
        const icon = connection.querySelector('.connection-icon');
        if (icon) {
            icon.addEventListener('click', () => {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            });
        }
    });
}
