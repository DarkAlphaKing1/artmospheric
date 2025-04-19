$(document).ready(function() {
    // Loading screen animation
    $(window).on('load', function() {
        setTimeout(function() {
            $('.loader-progress span').css('width', '100%');
            setTimeout(function() {
                $('.loading-screen').fadeOut(500);
            }, 500);
        }, 1000);
    });

    // Custom cursor effect
    const cursor = $('.cursor');
    const cursorDot = $('.cursor-dot');
    
    $(document).mousemove(function(e) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        
        gsap.to(cursorDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.01
        });
    });
    
    // Enlarge cursor on hoverable elements
    $('a, button, .showcase-item, .blog-card').hover(
        function() {
            cursor.addClass('cursor-active');
        },
        function() {
            cursor.removeClass('cursor-active');
        }
    );

    // Smooth scrolling for anchor links with offset for fixed header
    $('a[href^="#"]').on('click', function(event) {
        if (this.hash !== '') {
            event.preventDefault();
            const hash = this.hash;
            const headerHeight = $('#main-header').outerHeight();
            
            $('html, body').animate({
                scrollTop: $(hash).offset().top - headerHeight
            }, 800, 'easeInOutQuad', function() {
                window.location.hash = hash;
            });
            
            // Close mobile menu if open
            if ($('.nav-menu').hasClass('active')) {
                $('.nav-menu').removeClass('active');
                $('.menu-toggle i').removeClass('fa-times').addClass('fa-bars');
            }
        }
    });

    // Mobile menu toggle
    $('.menu-toggle').on('click', function() {
        $('.nav-menu').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });

    // Dropdown menu for mobile
    $('.dropdown > a').on('click', function(e) {
        if (window.innerWidth < 992) {
            e.preventDefault();
            $(this).siblings('.dropdown-menu').slideToggle(300);
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
        }
    });

    // Sticky header on scroll
    const header = $('#main-header');
    const heroSection = $('.hero-section');
    const heroHeight = heroSection.outerHeight();
    let lastScrollTop = 0;
    
    $(window).scroll(function() {
        const st = $(this).scrollTop();
        
        if (st > heroHeight / 2) {
            header.addClass('header-sticky');
            
            if (st > lastScrollTop && st > heroHeight) {
                // Scrolling down
                header.addClass('header-hidden');
            } else {
                // Scrolling up
                header.removeClass('header-hidden');
            }
        } else {
            header.removeClass('header-sticky header-hidden');
        }
        
        lastScrollTop = st;
        
        // Back to top button visibility
        if (st > 400) {
            $('#back-to-top').addClass('visible');
        } else {
            $('#back-to-top').removeClass('visible');
        }
    });

    // Back to top button
    $('#back-to-top').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 800, 'easeInOutQuad');
    });

    // 3D rotating showcase in hero section
    function initRotatingShowcase() {
        const container = document.getElementById('rotating-showcase');
        
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create showcase items (placeholders for now)
        const geometry = new THREE.BoxGeometry(2, 2, 0.1);
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0x2c3e50 }),
            new THREE.MeshBasicMaterial({ color: 0x3498db }),
            new THREE.MeshBasicMaterial({ color: 0x9b59b6 }),
            new THREE.MeshBasicMaterial({ color: 0x2ecc71 }),
            new THREE.MeshBasicMaterial({ color: 0xe74c3c })
        ];
        
        const showcaseGroup = new THREE.Group();
        scene.add(showcaseGroup);
        
        for (let i = 0; i < 5; i++) {
            const mesh = new THREE.Mesh(geometry, materials[i]);
            const angle = (i / 5) * Math.PI * 2;
            const radius = 4;
            
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.z = Math.sin(angle) * radius;
            mesh.lookAt(0, 0, 0);
            
            showcaseGroup.add(mesh);
        }
        
        camera.position.z = 6;
        
        function animate() {
            requestAnimationFrame(animate);
            
            showcaseGroup.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
    
    initRotatingShowcase();

    // Service tab functionality
    $('.tab-btn').on('click', function() {
        const tabId = $(this).data('tab');
        
        // Update active tab button
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        
        // Show corresponding tab content
        $('.tab-pane').removeClass('active');
        $('#' + tabId).addClass('active');
        
        // Animate content in
        gsap.fromTo('#' + tabId + ' .service-card', 
            { y: 20, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                stagger: 0.1,
                duration: 0.4,
                ease: "power2.out"
            }
        );
    });

    // Portfolio filtering
    $('.filter-btn').on('click', function() {
        const filter = $(this).data('filter');
        
        // Update active filter button
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        
        if (filter === 'all') {
            // Show all items with animation
            gsap.to('.showcase-item', { 
                scale: 1, 
                opacity: 1, 
                duration: 0.4,
                stagger: 0.05,
                ease: "power1.out"
            });
        } else {
            // Hide non-matching items
            gsap.to('.showcase-item:not(.' + filter + ')', { 
                scale: 0.8, 
                opacity: 0, 
                duration: 0.3
            });
            
            // Show matching items
            gsap.to('.showcase-item.' + filter, { 
                scale: 1, 
                opacity: 1, 
                duration: 0.4,
                stagger: 0.05,
                delay: 0.1,
                ease: "power1.out"
            });
        }
    });

    // Before & after image comparison slider
    function initBeforeAfterSlider() {
        const sliders = $('.comparison-slider');
        
        sliders.each(function() {
            const slider = $(this);
            const resizer = slider.find('.slider-resizer');
            const handle = slider.find('.slider-handle');
            const beforeImage = slider.find('.before-image');
            const afterImage = slider.find('.after-image');
            let isDragging = false;
            
            // Set initial position to 50%
            resizer.css('width', '50%');
            handle.css('left', '50%');
            
            // Handle mouse/touch events
            handle.on('mousedown touchstart', function(e) {
                e.preventDefault();
                isDragging = true;
            });
            
            $(document).on('mouseup touchend', function() {
                isDragging = false;
            });
            
            slider.on('mousemove touchmove', function(e) {
                if (!isDragging) return;
                
                const rect = this.getBoundingClientRect();
                let x;
                
                if (e.type === 'touchmove') {
                    x = e.touches[0].clientX - rect.left;
                } else {
                    x = e.clientX - rect.left;
                }
                
                const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                resizer.css('width', percent + '%');
                handle.css('left', percent + '%');
            });
        });
    }
    
    initBeforeAfterSlider();

    // Testimonial slider controls
    $('.next-testimonial').on('click', function() {
        navigateTestimonial(1);
    });
    
    $('.prev-testimonial').on('click', function() {
        navigateTestimonial(-1);
    });
    
    $('.carousel-dots .dot').on('click', function() {
        const index = $(this).index();
        showTestimonial(index);
    });
    
    let currentTestimonialIndex = 0;
    const testimonials = $('.testimonial-item');
    const testimonialDots = $('.carousel-dots .dot');
    const totalTestimonials = testimonials.length;
    
    function showTestimonial(index) {
        // Update current index
        currentTestimonialIndex = index;
        
        // Hide all testimonials and show the current one
        testimonials.removeClass('active');
        $(testimonials[index]).addClass('active');
        
        // Update dots
        testimonialDots.removeClass('active');
        $(testimonialDots[index]).addClass('active');
        
        // Animate content
        gsap.fromTo($(testimonials[index]).find('.testimonial-card'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
        );
    }
    
    function navigateTestimonial(direction) {
        // Calculate new index
        let newIndex = currentTestimonialIndex + direction;
        
        // Handle wrapping
        if (newIndex < 0) {
            newIndex = totalTestimonials - 1;
        } else if (newIndex >= totalTestimonials) {
            newIndex = 0;
        }
        
        showTestimonial(newIndex);
    }
    
    // Auto-rotate testimonials
    let testimonialInterval = setInterval(function() {
        navigateTestimonial(1);
    }, 7000);
    
    // Pause auto-rotation on hover
    $('.testimonial-carousel').hover(
        function() {
            clearInterval(testimonialInterval);
        },
        function() {
            testimonialInterval = setInterval(function() {
                navigateTestimonial(1);
            }, 7000);
        }
    );

    // Testimonial tabs
    $('.testimonials-tabs .tab-btn').on('click', function() {
        const tabId = $(this).data('tab');
        
        // Update active tab button
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        
        // Show corresponding content
        $('.testimonials-content .tab-pane').removeClass('active');
        $('#' + tabId).addClass('active');
    });

    // FAQ accordion
    $('.faq-question').on('click', function() {
        const item = $(this).parent();
        const answer = item.find('.faq-answer');
        const toggle = $(this).find('.faq-toggle i');
        
        if (item.hasClass('active')) {
            // Close this item
            answer.slideUp(300);
            item.removeClass('active');
            toggle.removeClass('fa-minus').addClass('fa-plus');
        } else {
            // Close other items
            $('.faq-item.active .faq-answer').slideUp(300);
            $('.faq-item.active .faq-toggle i').removeClass('fa-minus').addClass('fa-plus');
            $('.faq-item').removeClass('active');
            
            // Open this item
            answer.slideDown(300);
            item.addClass('active');
            toggle.removeClass('fa-plus').addClass('fa-minus');
        }
    });

    // Portfolio grid loading with pagination
    function loadPortfolioItems(page = 1) {
        // Simulation of loading items
        const itemsPerPage = 6;
        const categories = ['residential', 'commercial', 'corporate-events', 'social-events'];
        const portfolioGrid = $('.portfolio-grid');
        
        // Clear current items
        portfolioGrid.empty();
        
        // Show loading indicator
        portfolioGrid.append('<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i></div>');
        
        // Simulate server delay
        setTimeout(function() {
            portfolioGrid.empty();
            
            // Generate items
            for (let i = 0; i < itemsPerPage; i++) {
                const index = ((page - 1) * itemsPerPage) + i;
                const category = categories[index % categories.length];
                const item = `
                    <div class="portfolio-item ${category}">
                        <div class="portfolio-image">
                            <img src="images/AVIADEV BLUE 1.jpg" alt="Portfolio Item ${index + 1}">
                            <div class="portfolio-overlay">
                                <div class="portfolio-info">
                                    <h3>Project Title ${index + 1}</h3>
                                    <p>${category.replace('-', ' ')}</p>
                                    <a href="#" class="btn-view-details">View Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                portfolioGrid.append(item);
                
                // Animate in
                gsap.fromTo(portfolioGrid.children().last(), 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.4,
                        delay: i * 0.1,
                        ease: "power2.out"
                    }
                );
            }
            
            // Update pagination buttons
            $('.portfolio-pagination .pagination-btn').removeClass('active');
            $(`.portfolio-pagination .pagination-btn:nth-child(${page})`).addClass('active');
        }, 500);
    }
    
    // Load initial portfolio items
    loadPortfolioItems(1);
    
    // Handle pagination clicks
    $('.portfolio-pagination .pagination-btn').on('click', function() {
        const page = parseInt($(this).text());
        loadPortfolioItems(page);
    });
    
    $('.portfolio-pagination .pagination-next').on('click', function() {
        const currentPage = $('.portfolio-pagination .pagination-btn.active').text();
        const nextPage = parseInt(currentPage) % 3 + 1;
        loadPortfolioItems(nextPage);
    });

    // Portfolio category filters
    $('.portfolio-categories .category-btn').on('click', function() {
        const category = $(this).data('category');
        
        // Update active button
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        
        // Reset to page 1 with new filter
        loadPortfolioItems(1);
    });

    // Contact form validation and submission
    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();
        const service = $('#service').val();
        const message = $('#message').val().trim();
        
        // Basic validation
        if (!name || !email || !message) {
            // Show error message
            showFormMessage('error', 'Please complete all required fields.');
            
            // Highlight empty required fields
            if (!name) $('#name').addClass('error');
            if (!email) $('#email').addClass('error');
            if (!message) $('#message').addClass('error');
            
            return;
        }
        
        // Email validation
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            $('#email').addClass('error');
            showFormMessage('error', 'Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalBtnText = submitBtn.text();
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Sending...');
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(function() {
            // Reset form
            $('#contactForm').trigger('reset');
            $('.form-group .error').removeClass('error');
            
            // Show success message
            showFormMessage('success', 'Thank you! Your message has been sent successfully.');
            
            // Reset button
            submitBtn.prop('disabled', false).text(originalBtnText);
        }, 1500);
    });
    
    // Remove error class on input change
    $('#contactForm input, #contactForm textarea').on('input', function() {
        $(this).removeClass('error');
    });
    
    function showFormMessage(type, message) {
        // Remove any existing messages
        $('.form-message').remove();
        
        // Create message element
        const messageHtml = `<div class="form-message ${type}"><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}</div>`;
        
        // Add to form
        $('#contactForm').prepend(messageHtml);
        
        // Animate in
        gsap.fromTo('.form-message', 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.4 }
        );
        
        // Auto remove after delay if success
        if (type === 'success') {
            setTimeout(function() {
                gsap.to('.form-message', { 
                    opacity: 0, 
                    y: -20, 
                    duration: 0.4,
                    onComplete: function() {
                        $('.form-message').remove();
                    }
                });
            }, 5000);
        }
    }

    // Newsletter form submission
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val().trim();
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        
        if (!email || !emailRegex.test(email)) {
            $(this).find('input[type="email"]').addClass('error');
            return;
        }
        
        // Show success state
        const form = $(this);
        const originalHtml = form.html();
        
        form.html('<div class="success-message"><i class="fas fa-check-circle"></i> Thank you for subscribing!</div>');
        
        // Reset form after delay
        setTimeout(function() {
            form.html(originalHtml);
        }, 3000);
    });

    // Remove error class on newsletter input change
    $('.newsletter-form input').on('input', function() {
        $(this).removeClass('error');
    });

    // Animation on scroll using GSAP and ScrollTrigger
    function initScrollAnimations() {
        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header.children, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                }
            });
        });
        
        // Service cards
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                }
            });
        });
        
        // About section
        gsap.from('.about-text', {
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.about-section',
                start: "top 70%",
            }
        });
        
        gsap.from('.about-image', {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.about-section',
                start: "top 70%",
            }
        });
        
        // Stats counter animation
        gsap.utils.toArray('.stat-number').forEach(stat => {
            const target = parseInt(stat.textContent);
            gsap.fromTo(stat, 
                { innerText: 0 },
                {
                    innerText: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    scrollTrigger: {
                        trigger: stat,
                        start: "top 85%",
                    }
                }
            );
        });
        
        // Team members
        gsap.utils.toArray('.team-member').forEach((member, i) => {
            gsap.from(member, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: member,
                    start: "top 85%",
                }
            });
        });
        
        // Blog cards
        gsap.utils.toArray('.blog-card').forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                }
            });
        });
    }
    
    // Initialize animations after a slight delay to ensure all elements are properly loaded
    setTimeout(initScrollAnimations, 500);

    // Dynamic text animation for hero section heading
    function initTextAnimation() {
        const heading = $('.animated-heading');
        const originalText = heading.text();
        const words = originalText.split(' ');
        
        // Clear original text and prepare for animation
        heading.empty();
        
        // Create wrapper for each word
        words.forEach((word, index) => {
            const wordSpan = $('<span class="word">').appendTo(heading);
            
            // Create wrapper for each letter
            for (let i = 0; i < word.length; i++) {
                $('<span class="letter">').text(word[i]).appendTo(wordSpan);
            }
            
            // Add space after word (except last word)
            if (index < words.length - 1) {
                heading.append(' ');
            }
        });
        
        // Animate each letter in sequence
        gsap.fromTo('.animated-heading .letter',
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0, 
                stagger: 0.05,
                duration: 0.5,
                ease: "power2.out",
                delay: 0.5
            }
        );
    }
    
    initTextAnimation();

    // Initialize hover effects for showcase items
    $('.showcase-item').hover(
        function() {
            gsap.to($(this).find('.showcase-overlay'), {
                opacity: 1,
                duration: 0.3
            });
            
            gsap.to($(this).find('.showcase-info'), {
                y: 0,
                opacity: 1,
                duration: 0.4,
                delay: 0.1
            });
        },
        function() {
            gsap.to($(this).find('.showcase-overlay'), {
                opacity: 0,
                duration: 0.3
            });
            
            gsap.to($(this).find('.showcase-info'), {
                y: 20,
                opacity: 0,
                duration: 0.3
            });
        }
    );

    // Handle window resize events
    $(window).on('resize', function() {
        // Check for mobile menu dropdown
        if (window.innerWidth >= 992) {
            $('.dropdown-menu').removeAttr('style');
        }
    });
});