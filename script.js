// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Modal Functionality
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
};



// Form Validation
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Firebase Config
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = 'dashboard.html';
                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = signupForm.querySelector('input[name="username"]').value;
            const email = signupForm.querySelector('input[name="email"]').value;
            const password = signupForm.querySelector('input[name="password"]').value;
            if (username.length >= 3 && validateEmail(email) && password.length >= 6) {
                alert('Signup form submitted! (Demo: Formspree will handle submission)');
                signupForm.submit();
            } else {
                alert('Please enter a valid username (3+ characters), email, and password (6+ characters).');
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

// Password Reset
function resetPassword() {
    const email = document.getElementById('login-email').value;
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('Password reset email sent! Check your inbox.');
        })
        .catch(error => {
            alert(error.message);
        });
}

// Scroll to Contact
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn('Contact section not found. Ensure <section id="contact"> exists.');
    }
}
// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const textReveals = document.querySelectorAll('.text-reveal');
    
    const elementInView = (el, offset = 150) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) - offset)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const displayTextReveal = () => {
        textReveals.forEach((el, index) => {
            if (elementInView(el, 150)) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 300);
            }
        });
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 150)) {
                displayScrollElement(el);
            }
        });
        displayTextReveal();
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollAnimation();
                ticking = false;
            });
            ticking = true;
        }
    });

    handleScrollAnimation();
});

// Gaming Animation
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gaming-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const sprites = [];
    const spriteCount = 15;
    for (let i = 0; i < spriteCount; i++) {
        sprites.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 6 + 4,
            alpha: 0.5,
            trail: []
        });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function drawSprite(sprite) {
        sprite.trail.forEach((point, index) => {
            ctx.fillStyle = `rgba(58, 58, 58, ${0.08 * (1 - index / 8)})`;
            ctx.fillRect(point.x, point.y, sprite.size, sprite.size);
        });

        ctx.fillStyle = `rgba(224, 224, 224, ${sprite.alpha})`;
        ctx.fillRect(sprite.x, sprite.y, sprite.size, sprite.size);

        ctx.fillStyle = `rgba(58, 58, 58, 0.2)`;
        ctx.fillRect(sprite.x - 1, sprite.y - 1, sprite.size + 2, sprite.size + 2);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sprites.forEach(sprite => {
            const dx = mouseX - sprite.x;
            const dy = mouseY - sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 50) {
                sprite.vx += dx / distance * 0.008;
                sprite.vy += dy / distance * 0.008;
            }

            const speed = Math.sqrt(sprite.vx * sprite.vx + sprite.vy * sprite.vy);
            if (speed > 1) {
                sprite.vx *= 1 / speed;
                sprite.vy *= 1 / speed;
            }

            sprite.x += sprite.vx;
            sprite.y += sprite.vy;

            sprite.trail.unshift({ x: sprite.x, y: sprite.y });
            if (sprite.trail.length > 8) sprite.trail.pop();

            if (sprite.x < -sprite.size) sprite.x = canvas.width;
            if (sprite.x > canvas.width) sprite.x = -sprite.size;
            if (sprite.y < -sprite.size) sprite.y = canvas.height;
            if (sprite.y > canvas.height) sprite.y = -sprite.size;

            drawSprite(sprite);
        });

        requestAnimationFrame(animate);
    }

    setTimeout(animate, 1000);
});

// Photo Zoom Animation
document.addEventListener('DOMContentLoaded', () => {
    const photo = document.querySelector('.profile-photo');
    if (photo) {
        photo.style.transform = 'scale(0.9)';
        photo.style.opacity = '0';
        setTimeout(() => {
            photo.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            photo.style.transform = 'scale(1)';
            photo.style.opacity = '1';
        }, 100);
    }
});



