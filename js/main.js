// VieOS Flash Tool - Main JavaScript

// Global Variables
let donateDatabase = {};
let currentDonateIndex = 0;

// Configuration for Google Drive Video
const VIDEO_CONFIG = {
    // Replace with your actual Google Drive file ID
    driveFileId: '1LMHmOuJ9DLPDxP7xVTvryy3UBIHHVMTz',
    fallbackVideoUrl: './video/video.mp4',
    posterImage: './img/video-poster.png'
};

// Database Management
async function loadDatabase() {
    try {
        const response = await fetch('./database.json');
        if (response.ok) {
            donateDatabase = await response.json();
            console.log('Database loaded successfully:', donateDatabase.version);
            updatePageWithDatabaseInfo();
        } else {
            // Fallback to default database if file not found
            donateDatabase = getDefaultDatabase();
            console.log('Using fallback database');
            updatePageWithDatabaseInfo();
        }
    } catch (error) {
        console.log('Error loading database, using fallback:', error);
        donateDatabase = getDefaultDatabase();
        updatePageWithDatabaseInfo();
    }
}

// Default database as fallback
function getDefaultDatabase() {
    return {
        version: "1.1.1",
        lastUpdated: "2025-08-03",
        donateOptions: [
            {
                id: 2,
                title: "MoMo",
                type: "ewallet",
                info: "Cảm ơn mọi người đã hỗ trợ",
                image: "./img/moc.png"
            }
        ],
        stats: {
            totalDownloads: 12485,
            currentVersion: "1.1.1",
            supportedDevices: 15,
            lastUpdate: "2025-08-03"
        }
    };
}

// Update page elements with database info
function updatePageWithDatabaseInfo() {
    // Update version numbers throughout the page
    const versionElements = document.querySelectorAll('[data-version]');
    versionElements.forEach(el => {
        el.textContent = el.textContent.replace(/v[\d.]+/, `v${donateDatabase.version}`);
    });

    // Update stats if displayed
    if (donateDatabase.stats) {
        console.log(`Stats: ${donateDatabase.stats.totalDownloads} downloads, ${donateDatabase.stats.supportedDevices} devices supported`);
    }
}

// Video Management Functions
function initializeVideoPlayer() {
    const videoContainer = document.getElementById('videoContainer');
    const videoFallback = document.getElementById('videoFallback');
    const iframe = document.getElementById('tutorialVideo');
    
    if (!iframe) return;
    
    // Show loading state
    videoFallback.classList.remove('hidden');
    
    // Set up Google Drive video URL
    if (VIDEO_CONFIG.driveFileId && VIDEO_CONFIG.driveFileId !== 'YOUR_GOOGLE_DRIVE_FILE_ID') {
        const driveUrl = `https://drive.google.com/file/d/${VIDEO_CONFIG.driveFileId}/preview`;
        iframe.src = driveUrl;
        
        // Hide loading after a delay
        setTimeout(() => {
            videoFallback.classList.add('hidden');
        }, 2000);
        
        // Handle iframe load events
        iframe.addEventListener('load', () => {
            videoFallback.classList.add('hidden');
        });
        
        iframe.addEventListener('error', () => {
            handleVideoError();
        });
    } else {
        // Use fallback video if Google Drive ID not configured
        handleVideoError();
    }
}

function handleVideoError() {
    const videoContainer = document.getElementById('videoContainer');
    const videoFallback = document.getElementById('videoFallback');
    
    // Create fallback video element
    videoContainer.innerHTML = `
        <video 
            class="w-full h-full object-cover" 
            controls 
            poster="${VIDEO_CONFIG.posterImage}"
        >
            <source src="${VIDEO_CONFIG.fallbackVideoUrl}" type="video/mp4">
            <p class="text-white p-4">Trình duyệt của bạn không hỗ trợ video HTML5.</p>
        </video>
    `;
    
    videoFallback.classList.add('hidden');
}

// Update video with new Google Drive ID
function updateVideoSource(driveFileId) {
    VIDEO_CONFIG.driveFileId = driveFileId;
    initializeVideoPlayer();
}

// Donate Modal Functions
function showDonateModal() {
    const modal = document.getElementById('donateModal');
    const donateImage = document.getElementById('donateImage');
    const donateTitle = document.getElementById('donateTitle');
    const donateInfo = document.getElementById('donateInfo');
    
    const currentOption = donateDatabase.donateOptions[currentDonateIndex];
    
    donateImage.src = currentOption.image;
    donateImage.classList.remove('hidden');
    donateTitle.textContent = currentOption.title;
    donateInfo.textContent = currentOption.info;
    
    modal.classList.remove('hidden');
    modal.classList.add('animate-fade-in');
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeDonateModal();
        }
    });
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.classList.add('hidden');
}

function copyDonateInfo() {
    const currentOption = donateDatabase.donateOptions[currentDonateIndex];
    navigator.clipboard.writeText(currentOption.info).then(() => {
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Đã sao chép!';
        button.classList.add('bg-green-500');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-500');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = currentOption.info;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Đã sao chép!';
        button.classList.add('bg-green-500');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-500');
        }, 2000);
    });
}

// Cycle through donate options
function cycleDonateOption() {
    currentDonateIndex = (currentDonateIndex + 1) % donateDatabase.donateOptions.length;
    if (document.getElementById('donateModal').classList.contains('hidden') === false) {
        showDonateModal();
    }
}

// Navigation Functions
function handleNavigation() {
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    // Handle specific routes
    switch(path) {
        case '/download':
            document.title = 'Tải xuống - VieOS Flash Tool';
            break;
        case '/tutorial':
            document.title = 'Hướng dẫn - VieOS Flash Tool';
            break;
        case '/roms':
            document.title = 'ROM VieOS - VieOS Flash Tool';
            break;
        case '/support':
            document.title = 'Hỗ trợ - VieOS Flash Tool';
            break;
        case '/tools':
            document.title = 'Công cụ - VieOS Flash Tool';
            break;
        default:
            document.title = 'VieOS - OnePlus Flash Tool';
    }
}

// Utility Functions
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    updateCounter();
}

function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('hidden');
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'floating 3s ease-in-out infinite';
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.card-hover').forEach(card => {
        observer.observe(card);
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Button loading states
function initializeButtonStates() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('no-loading') && !this.hasAttribute('onclick')) {
                const originalText = this.textContent;
                this.textContent = 'Đang tải...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1000);
            }
        });
    });
}

// Keyboard support
function initializeKeyboardSupport() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDonateModal();
        }
        
        // Add more keyboard shortcuts as needed
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            // Could add search functionality here
        }
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Monitor resource usage
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            console.log(`Memory usage: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
        }, 30000); // Log every 30 seconds
    }
}

// Error handling
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        // You could send error reports to analytics here
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

// Auto-cycle donate options every 10 seconds when modal is open
setInterval(() => {
    if (!document.getElementById('donateModal').classList.contains('hidden')) {
        cycleDonateOption();
    }
}, 10000);

// Service Worker Registration
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('VieOS Flash Tool Website Loaded');
    
    // Initialize all components
    loadDatabase();
    initializeVideoPlayer();
    handleNavigation();
    initializeAnimations();
    initializeSmoothScrolling();
    initializeButtonStates();
    initializeKeyboardSupport();
    initializePerformanceMonitoring();
    initializeErrorHandling();
    initializeServiceWorker();
    
    // Add dynamic hero interaction
    const hero = document.querySelector('section');
    if (hero) {
        hero.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(229, 62, 62, 0.1) 0%, transparent 50%)';
        });
        
        hero.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    console.log('Window resized:', window.innerWidth);
    
    // Reinitialize video player on orientation change
    if (window.innerWidth !== window.innerHeight) {
        setTimeout(initializeVideoPlayer, 500);
    }
});

// Export functions for global access
window.VieOSApp = {
    showDonateModal,
    closeDonateModal,
    copyDonateInfo,
    updateVideoSource,
    loadDatabase,
    toggleMobileMenu
};