// ===== MAIN JAVASCRIPT FILE =====
// Vivekananda Polytechnic Sitasaongi Website
// Author: AI Assistant
// Date: December 2024

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== GLOBAL VARIABLES =====
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let chatMessages = [];
    let isTyping = false;

    // ===== INITIALIZATION =====
    initializeWebsite();
    
    // ===== MAIN INITIALIZATION FUNCTION =====
    function initializeWebsite() {
        setActiveNavigation();
        initializeAnimations();
        initializeFacultyFilter();
        initializeNotesFilter();
        initializeChatbot();
        initializeLoginForms();
        initializePasswordToggles();
        initializeDownloadButtons();
        initializeSearchFunctionality();
        initializeSmoothScrolling();
        initializeResponsiveBehavior();
        initializeAuthLinks();
        initializeGetStartedLink();
    }

    // Ensure Get Started button always redirects to login (works even if other handlers interfere)
    function initializeGetStartedLink() {
        const getStarted = document.querySelector('.hero-buttons a[href*="register.html"]') || document.querySelector('.hero-buttons a');
        if (getStarted) {
            getStarted.addEventListener('click', function(e) {
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                window.location.href = 'register.html';
            });
        }
    }

    // ===== NAVIGATION FUNCTIONS =====
    function setActiveNavigation() {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ===== ANIMATION FUNCTIONS =====
    function initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll('.feature-card, .value-card, .faculty-card, .gallery-item, .stat-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Animated heading effect
        const animatedHeadings = document.querySelectorAll('.animated-heading');
        animatedHeadings.forEach(heading => {
            animateText(heading);
        });
    }

    function animateText(element) {
        const text = element.textContent;
        element.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.opacity = '0';
            span.style.animation = `fadeInChar 0.1s ease forwards ${i * 0.05}s`;
            element.appendChild(span);
        }
    }

    // Add CSS animation for text characters
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInChar {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ===== FACULTY FILTER FUNCTIONS =====
    function initializeFacultyFilter() {
        const filterButtons = document.querySelectorAll('.btn-filter');
        const facultyItems = document.querySelectorAll('.faculty-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter faculty items
                facultyItems.forEach(item => {
                    const department = item.getAttribute('data-department');
                    
                    if (filter === 'all' || department === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ===== NOTES FILTER FUNCTIONS =====
    function initializeNotesFilter() {
        const filterButtons = document.querySelectorAll('.filter-tabs .btn-filter');
        const notesRows = document.querySelectorAll('.notes-row');
        const yearFilter = document.getElementById('yearFilter');
        const yearButtons = yearFilter ? yearFilter.querySelectorAll('.year-btn') : [];

        let activeBranch = 'all';
        let activeYear = 'all';

        function applyFilters() {
            notesRows.forEach(row => {
                const department = row.getAttribute('data-department');
                const rowYear = row.getAttribute('data-year') || 'all';

                const branchMatch = (activeBranch === 'all') || (department === activeBranch);
                const yearMatch = (activeYear === 'all') || (rowYear === activeYear);

                if (branchMatch && yearMatch) {
                    row.style.display = 'table-row';
                    row.style.animation = 'fadeIn 0.5s ease';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // Branch buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                activeBranch = filter;

                // Show year filter only when a specific branch is selected
                if (activeBranch === 'all') {
                    if (yearFilter) yearFilter.style.display = 'none';
                    activeYear = 'all';
                } else {
                    if (yearFilter) yearFilter.style.display = 'block';
                    // reset year selection to 'all' when branch changes
                    activeYear = 'all';
                    yearButtons.forEach(btn => btn.classList.remove('active'));
                    if (yearButtons[0]) yearButtons[0].classList.add('active');
                }

                applyFilters();
            });
        });

        // Year buttons
        yearButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                yearButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeYear = year;
                applyFilters();
            });
        });

        // Initialize (show all rows)
        applyFilters();
    }

    // ===== CHATBOT FUNCTIONS =====
    function initializeChatbot() {
        const sendButton = document.getElementById('sendMessage');
        const messageInput = document.getElementById('messageInput');
        const chatMessages = document.getElementById('chatMessages');
        const clearButton = document.getElementById('clearChat');
        const quickActionButtons = document.querySelectorAll('.quick-action-btn');

        if (sendButton && messageInput) {
            // Send message on button click
            sendButton.addEventListener('click', sendMessage);
            
            // Send message on Enter key
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }

        if (clearButton) {
            clearButton.addEventListener('click', clearChat);
        }

        // Quick action buttons
        quickActionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const question = this.getAttribute('data-question');
                messageInput.value = question;
                sendMessage();
            });
        });
    }

    function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        messageInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate bot response after delay
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1500);
    }

    function addMessage(content, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                ${formatMessageContent(content)}
            </div>
            <div class="message-time">${currentTime}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatMessageContent(content) {
        // Convert URLs to clickable links
        content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks to HTML
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }

    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Simple response logic based on keywords
        if (message.includes('course') || message.includes('available')) {
            return `Here are the available courses at VPS:\n\n• Computer Engineering\n• Mechanical Engineering\n• Electrical Engineering\n• Civil Engineering\n\nEach program offers comprehensive technical education with practical training.`;
        }
        else if (message.includes('faculty') || message.includes('contact') || message.includes('teacher')) {
            return `You can contact faculty members through:\n\n• Email: faculty@vps.edu.in\n• Phone: +91 98765 43210\n• Visit the Faculty page for individual contact details\n• Office hours: 9:00 AM - 5:00 PM`;
        }
        else if (message.includes('study') || message.includes('material') || message.includes('notes')) {
            return `Study materials are available in the Notes section:\n\n• Download PDF notes for all subjects\n• Organized by department and topic\n• Updated regularly by faculty\n• Access requires student login`;
        }
        else if (message.includes('facility') || message.includes('campus') || message.includes('lab')) {
            return `Our campus facilities include:\n\n• Modern computer labs\n• Well-equipped workshops\n• Library with technical books\n• Sports facilities\n• Cafeteria and hostel\n• Wi-Fi enabled campus`;
        }
        else if (message.includes('admission') || message.includes('apply') || message.includes('enroll')) {
            return `For admissions:\n\n• Visit our website\n• Contact admission office\n• Required documents: 10th/12th marksheet, ID proof\n• Application fee: ₹500\n• Merit-based selection`;
        }
        else if (message.includes('fee') || message.includes('cost') || message.includes('payment')) {
            return `Fee structure:\n\n• Tuition fee: ₹15,000 per semester\n• Laboratory fee: ₹2,000 per semester\n• Library fee: ₹500 per semester\n• Payment plans available\n• Scholarships for meritorious students`;
        }
        else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return `Hello! Welcome to Vivekananda Polytechnic Sitasaongi. How can I help you today?`;
        }
        else {
            return `Thank you for your question. For specific information about ${userMessage}, please:\n\n• Check our website sections\n• Contact the relevant department\n• Visit our office during working hours\n• Email us at info@vps.edu.in`;
        }
    }

    function showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
        }
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    function clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Keep only the welcome message
            const welcomeMessage = chatMessages.querySelector('.bot-message');
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
        }
    }

    // ===== LOGIN FORM FUNCTIONS =====
    function initializeLoginForms() {
        const studentForm = document.getElementById('studentForm');
        const facultyForm = document.getElementById('facultyForm');
        const loginTypeRadios = document.querySelectorAll('input[name="loginType"]');

        // Handle login type switching
        loginTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const type = this.value;
                if (type === 'student') {
                    document.getElementById('studentLoginForm').style.display = 'block';
                    document.getElementById('facultyLoginForm').style.display = 'none';
                } else {
                    document.getElementById('studentLoginForm').style.display = 'none';
                    document.getElementById('facultyLoginForm').style.display = 'block';
                }
            });
        });

        // Student form submission
        if (studentForm) {
            studentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateStudentForm()) {
                    handleStudentLogin();
                }
            });
        }

        // Faculty form submission
        if (facultyForm) {
            facultyForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateFacultyForm()) {
                    handleFacultyLogin();
                }
            });
        }
    }

    function validateStudentForm() {
        const rollNo = document.getElementById('studentRollNo').value.trim();
        const password = document.getElementById('studentPassword').value.trim();
        let isValid = true;

        // Reset previous validation states
        document.getElementById('studentRollNo').classList.remove('is-invalid');
        document.getElementById('studentPassword').classList.remove('is-invalid');

        // Validate roll number
        if (!rollNo) {
            document.getElementById('studentRollNo').classList.add('is-invalid');
            isValid = false;
        }

        // Validate password
        if (!password) {
            document.getElementById('studentPassword').classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    function validateFacultyForm() {
        const email = document.getElementById('facultyEmail').value.trim();
        const password = document.getElementById('facultyPassword').value.trim();
        let isValid = true;

        // Reset previous validation states
        document.getElementById('facultyEmail').classList.remove('is-invalid');
        document.getElementById('facultyPassword').classList.remove('is-invalid');

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            document.getElementById('facultyEmail').classList.add('is-invalid');
            isValid = false;
        }

        // Validate password
        if (!password) {
            document.getElementById('facultyPassword').classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    function handleStudentLogin() {
        // Simulate login process
        const loginButton = document.querySelector('#studentForm button[type="submit"]');
        const originalText = loginButton.innerHTML;
        
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        setTimeout(() => {
            // Simulate successful login
            showNotification('Login successful! Welcome back, Student.', 'success');
            loginButton.disabled = false;
            loginButton.innerHTML = originalText;
            
            // Persist login state
            localStorage.setItem('loggedIn', 'true');
            // Redirect to dashboard
            setTimeout(() => {
                showNotification('Redirecting to student dashboard...', 'info');
                // Store user type in sessionStorage for dashboard
                sessionStorage.setItem('userType', 'student');
                sessionStorage.setItem('userName', 'Student');
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            }, 1000);
        }, 2000);
    }

    function handleFacultyLogin() {
        // Simulate login process
        const loginButton = document.querySelector('#facultyForm button[type="submit"]');
        const originalText = loginButton.innerHTML;
        
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        setTimeout(() => {
            // Simulate successful login
            showNotification('Login successful! Welcome back, Faculty.', 'success');
            loginButton.disabled = false;
            loginButton.innerHTML = originalText;
            
            // Persist login state
            localStorage.setItem('loggedIn', 'true');
            // Redirect to dashboard
            setTimeout(() => {
                showNotification('Redirecting to faculty dashboard...', 'info');
                // Store user type in sessionStorage for dashboard
                sessionStorage.setItem('userType', 'faculty');
                sessionStorage.setItem('userName', 'Faculty Member');
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            }, 1000);
        }, 2000);
    }

    // ===== PASSWORD TOGGLE FUNCTIONS =====
    function initializePasswordToggles() {
        const toggleStudentPassword = document.getElementById('toggleStudentPassword');
        const toggleFacultyPassword = document.getElementById('toggleFacultyPassword');

        if (toggleStudentPassword) {
            toggleStudentPassword.addEventListener('click', function() {
                togglePasswordVisibility('studentPassword', this);
            });
        }

        if (toggleFacultyPassword) {
            toggleFacultyPassword.addEventListener('click', function() {
                togglePasswordVisibility('facultyPassword', this);
            });
        }
    }

    function togglePasswordVisibility(inputId, button) {
        const input = document.getElementById(inputId);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // ===== DOWNLOAD BUTTON FUNCTIONS =====
    function initializeDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-btn');

        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const fileUrl = this.getAttribute('data-file');
                if (!fileUrl) {
                    showNotification('No file specified for download.', 'warning');
                    return;
                }
                handleDownload(this, fileUrl);
            });
        });
    }

    function handleDownload(button, fileUrl) {
        const originalHTML = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

        // Small delay so spinner/notification is visible
        setTimeout(() => {
            try {
                // If fileUrl is an absolute HTTP(S) URL, open in a new tab
                if (/^https?:\/\//i.test(fileUrl)) {
                    window.open(fileUrl, '_blank');
                } else {
                    // For relative URLs, create a temporary anchor with download attribute
                    const a = document.createElement('a');
                    a.href = fileUrl;
                    const filename = fileUrl.split('/').pop();
                    a.setAttribute('download', filename || 'download');
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }

                showNotification(`Download started: ${fileUrl}`, 'success');
            } catch (err) {
                console.error('Download failed', err);
                showNotification('Unable to start download; opening file in a new tab.', 'danger');
                window.open(fileUrl, '_blank');
            } finally {
                button.disabled = false;
                button.innerHTML = originalHTML;
            }
        }, 600);
    }

    // ===== SEARCH FUNCTIONALITY =====
    function initializeSearchFunctionality() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                filterNotesBySearch(searchTerm);
            });
        }
    }

    function filterNotesBySearch(searchTerm) {
        const notesRows = document.querySelectorAll('.notes-row');
        
        notesRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== RESPONSIVE BEHAVIOR =====
    function initializeResponsiveBehavior() {
        // Handle mobile menu toggle
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function() {
                navbarCollapse.classList.toggle('show');
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // ===== SCROLL EFFECTS =====
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(230, 81, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, var(--primary-color), #FB8C00)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // ===== PAGE LOAD ANIMATIONS =====
    window.addEventListener('load', function() {
        // Add page load animation
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===== ERROR HANDLING =====
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        showNotification('An error occurred. Please refresh the page.', 'danger');
    });

    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll events
    const optimizedScrollHandler = debounce(function() {
        // Scroll handling code here
    }, 16); // ~60fps

    window.addEventListener('scroll', optimizedScrollHandler);

    // ===== ACCESSIBILITY IMPROVEMENTS =====
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals/menus
        if (e.key === 'Escape') {
            const navbarCollapse = document.querySelector('.navbar-collapse.show');
            if (navbarCollapse) {
                navbarCollapse.classList.remove('show');
            }
        }
    });

    // ===== ANALYTICS AND TRACKING =====
    function trackEvent(eventName, eventData = {}) {
        // In a real application, this would send data to analytics service
        console.log('Event tracked:', eventName, eventData);
    }

    // Track page views
    trackEvent('page_view', { page: currentPage });

    // Track user interactions
    document.addEventListener('click', function(e) {
        if (e.target.matches('button, a, .btn')) {
            const element = e.target.closest('button, a, .btn');
            if (element) {
                trackEvent('click', {
                    element: element.textContent.trim(),
                    page: currentPage
                });
            }
        }
    });

    console.log('Vivekananda Polytechnic Website initialized successfully!');
    console.log('Current page:', currentPage);

    // ===== AUTH LINK HANDLING =====
    function initializeAuthLinks() {
        // If user is logged in, restore real hrefs from data-real-href
        const loggedIn = localStorage.getItem('loggedIn') === 'true';

        // Redirect already-logged-in users away from registration page (no login page exists)
        if (loggedIn && (currentPage === 'register.html' || currentPage === '')) {
            // send to home if already logged in
            window.location.href = 'home.html';
            return;
        }

        const protectedLinks = document.querySelectorAll('a[data-real-href]');
        protectedLinks.forEach(link => {
            const real = link.getAttribute('data-real-href');
            if (loggedIn) {
                link.setAttribute('href', real);
            } else {
                // point protected links to registration since login page was removed
                link.setAttribute('href', 'register.html');
            }
        });
    }
});
