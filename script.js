document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Loader & Scroll Operations
       ========================================================================== */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 300);
    });

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        highlightNavLinkOnScroll();
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================================
       Theme Toggle Manager
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        // Update particle colors on theme toggle
        initParticleColor();
    });

    /* ==========================================================================
       Hamburger Mobile Menu
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuItems = document.getElementById('menu-items');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        menuItems.classList.toggle('open');
    });

    // Close menu when clicking items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            menuItems.classList.remove('open');
        });
    });

    // Highlight active section link in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLinkOnScroll() {
        let scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ==========================================================================
       Typing Text Animation
       ========================================================================== */
    const typingText = document.getElementById('typing-text');
    const words = ["Full Stack Developer", "AI & ML Enthusiast", "Computer Science Student"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }
    
    if (typingText) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       Canvas Particles Network
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleColor = 'rgba(0, 229, 255, 0.4)';
    let lineColor = 'rgba(0, 229, 255, 0.08)';

    function initParticleColor() {
        if (body.classList.contains('light-theme')) {
            particleColor = 'rgba(37, 99, 235, 0.3)';
            lineColor = 'rgba(37, 99, 235, 0.06)';
        } else {
            particleColor = 'rgba(0, 229, 255, 0.4)';
            lineColor = 'rgba(0, 229, 255, 0.08)';
        }
    }
    initParticleColor();

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;

            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function setupParticles() {
        particles = [];
        const count = Math.min(80, Math.floor(canvas.width / 15));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    setupParticles();
    window.addEventListener('resize', setupParticles);

    function connectParticles() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < maxDist) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1 - (dist / maxDist);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();





    /* ==========================================================================
       Project Filtering System
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Re-trigger animation
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       Contact Form Validation & Mock Submit
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('form-submit-btn');
    const statusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;

            // Name
            if (nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('invalid');
            }

            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('invalid');
            }

            // Subject
            if (subjectInput.value.trim() === '') {
                subjectInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                subjectInput.parentElement.classList.remove('invalid');
            }

            // Message
            if (messageInput.value.trim() === '') {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('invalid');
            }

            if (isValid) {
                // Prepare email submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Preparing Email...';
                
                setTimeout(() => {
                    const name = nameInput.value.trim();
                    const email = emailInput.value.trim();
                    const subject = subjectInput.value.trim();
                    const message = messageInput.value.trim();
                    
                    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                    const mailtoUrl = `mailto:mekalalokesh40@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    
                    window.location.href = mailtoUrl;

                    statusMsg.className = 'form-status-msg success';
                    statusMsg.textContent = 'Opening your email client to send the message...';
                    statusMsg.style.display = 'block';
                    
                    // Reset Form
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    // Clear status after 5s
                    setTimeout(() => {
                        statusMsg.style.display = 'none';
                    }, 5000);
                }, 800);
            }
        });

        // Live validation clearing on input
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }

    /* ==========================================================================
       Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       Recruiter Chatbot FAQ Widget
       ========================================================================== */
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatBox = document.getElementById('chat-box');
    const chatBody = document.getElementById('chat-body');
    const chatBadge = document.querySelector('.chat-badge');
    const chatOptionsContainer = document.getElementById('chat-options');

    const botAnswers = {
        skills: "Lokesh is proficient in <strong>JavaScript/TypeScript</strong> (React, Next.js), <strong>Python</strong> (Flask, Machine Learning, NLP), <strong>Java</strong>, and <strong>SQL/MongoDB</strong> query optimization.",
        internship: "Lokesh completed software/data internships at <strong>Hexart.in</strong> and <strong>1stop.ai</strong>. He is actively seeking Full-Time software engineer roles or B.Tech AI & ML internships starting immediately!",
        projects: "His projects include <strong>EcoScan</strong> (a waste classification app with 92% accuracy), <strong>Rythu Chutneys</strong> (a freelance React/Node.js e-commerce website), <strong>CO2 Tracker</strong>, and <strong>Form Health</strong> (a HIPAA-secure records manager).",
        contact: "You can reach Lokesh directly at <a href='mailto:mekalalokesh40@gmail.com'><strong>mekalalokesh40@gmail.com</strong></a> or call <a href='tel:+917207324983'><strong>+91 72073 24983</strong></a>. Alternatively, use the contact form on the left!"
    };

    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('open');
        if (chatBadge) {
            chatBadge.style.display = 'none'; // Hide badge on open
        }
    });

    chatClose.addEventListener('click', () => {
        chatBox.classList.remove('open');
    });

    // Close chat if clicked outside
    document.addEventListener('click', (e) => {
        if (!chatBox.contains(e.target) && !chatToggle.contains(e.target) && chatBox.classList.contains('open')) {
            chatBox.classList.remove('open');
        }
    });

    chatOptionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-opt-btn')) {
            const questionType = e.target.getAttribute('data-question');
            const questionText = e.target.textContent;
            
            // Append User Question
            appendMessage(questionText, 'user');
            
            // Disable options during typing simulation
            toggleOptions(false);

            // Simulation of typing
            showTypingIndicator();

            setTimeout(() => {
                removeTypingIndicator();
                appendMessage(botAnswers[questionType], 'bot');
                toggleOptions(true);
            }, 800);
        }
    });

    function appendMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${sender}`;
        msg.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    let typingBubble = null;
    function showTypingIndicator() {
        typingBubble = document.createElement('div');
        typingBubble.className = 'chat-message bot typing-indicator-bubble';
        typingBubble.innerHTML = `<p><span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span></p>`;
        chatBody.appendChild(typingBubble);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Typing dots animation style
        let dots = 0;
        typingBubble.interval = setInterval(() => {
            dots = (dots + 1) % 4;
            typingBubble.querySelector('p').textContent = '.'.repeat(dots) || '...';
        }, 250);
    }

    function removeTypingIndicator() {
        if (typingBubble) {
            clearInterval(typingBubble.interval);
            typingBubble.remove();
            typingBubble = null;
        }
    }

    function toggleOptions(enable) {
        const buttons = chatOptionsContainer.querySelectorAll('.chat-opt-btn');
        buttons.forEach(btn => btn.disabled = !enable);
    }
});
