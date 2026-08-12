// ==========================================
// ISD Campus — Main Application JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Navbar Scroll Effect
    // ==========================================
    const navbar = document.querySelector('.navbar');

    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // ==========================================
    // Mobile Navigation Toggle
    // ==========================================
    const hamburger = document.querySelector('.navbar__hamburger');
    const navLinks = document.querySelector('.navbar__links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // Active Navigation Link (by current page)
    // ==========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__links a:not(.navbar__cta)').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // Scroll Animations (Intersection Observer)
    // ==========================================
    const animateElements = document.querySelectorAll('.animate-on-scroll, .timeline__item, .journey-step');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => scrollObserver.observe(el));

    // ==========================================
    // Testimonial Carousel
    // ==========================================
    const carouselTrack = document.querySelector('.testimonials__track');
    const carouselDots = document.querySelectorAll('.carousel-dot');

    if (carouselTrack && carouselDots.length > 0) {
        let currentSlide = 0;
        const totalSlides = carouselDots.length;
        let autoplayInterval;

        const goToSlide = (index) => {
            currentSlide = index;
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            carouselDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        const nextSlide = () => {
            goToSlide((currentSlide + 1) % totalSlides);
        };

        const startAutoplay = () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };

        startAutoplay();

        const carouselContainer = carouselTrack.closest('.testimonials');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoplay);
            carouselContainer.addEventListener('mouseleave', startAutoplay);
        }

        carouselDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                goToSlide(i);
                startAutoplay();
            });
        });
    }

    // ==========================================
    // Tabs (Programs Page)
    // ==========================================
    const tabBtns = document.querySelectorAll('.tabs__btn');
    const tabContents = document.querySelectorAll('.tabs__content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;

                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const targetContent = document.getElementById(target);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }

    // ==========================================
    // Contact Form Validation
    // ==========================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();

            if (!name || !email) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            showFormMessage('Thank you! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    function showFormMessage(message, type) {
        const existing = document.querySelector('.form-message');
        if (existing) existing.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message form-message--${type}`;
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            padding: 14px 20px;
            border-radius: 8px;
            margin-top: 16px;
            font-size: 0.875rem;
            font-weight: 500;
            animation: fadeIn 0.3s ease;
            ${type === 'success'
                ? 'background: rgba(34, 197, 94, 0.15); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3);'
                : 'background: rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3);'}
        `;

        contactForm.appendChild(msgDiv);

        setTimeout(() => {
            msgDiv.style.opacity = '0';
            msgDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => msgDiv.remove(), 300);
        }, 4000);
    }

    // ==========================================
    // Counter Animation (Stats)
    // ==========================================
    const counters = document.querySelectorAll('[data-count]');

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }

    // ==========================================
    // Gemini AI Chat Widget Interactions
    // ==========================================
    const chatToggle = document.getElementById('gemini-chat-toggle');
    const chatWindow = document.getElementById('gemini-chat-window');
    const chatClose = document.getElementById('chat-close-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle && chatWindow && chatClose) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });
    }

    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            // Append User Message
            appendMessage(userText, 'user-message');
            chatInput.value = '';

            // Append Loading Indicator
            const loadingDiv = appendMessage('Gemini is thinking...', 'bot-message');

            try {
                const response = await fetch('/api/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userText })
                });

                const data = await response.json();
                loadingDiv.remove();

                if (response.ok && data.reply) {
                    appendMessage(data.reply, 'bot-message');
                } else {
                    appendMessage(data.error || 'Failed to get a response from Gemini.', 'bot-message');
                }
            } catch (err) {
                loadingDiv.remove();
                appendMessage('Error connecting to backend server.', 'bot-message');
            }
        });
    }

    function appendMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
    }

});
